import { buildReportData } from "./report/buildReportData";
import { generateReport } from "./report/generateReport";
import type { Express } from "express";
import { type Server } from "http";
import { storage } from "./storage";
import multer from "multer";
import path from "path";
import fs from "fs";
import { execFile } from "child_process";
import { promisify } from "util";
const execFileAsync = promisify(execFile);

const uploadDir = path.resolve(process.cwd(), "uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storageEngine = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const timestamp = Date.now();
    const safeOriginalName = file.originalname.replace(/\s+/g, "_");
    cb(null, `${timestamp}-${safeOriginalName}`);
  },
});

const upload = multer({
  storage: storageEngine,
  limits: {
    fileSize: 20 * 1024 * 1024,
  },
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();

    if (ext !== ".csv") {
      cb(new Error("Only CSV files are allowed."));
      return;
    }

    cb(null, true);
  },
});

export async function registerRoutes(
  httpServer: Server,
  app: Express,
): Promise<Server> {
  // health check
  app.get("/api/health", (_req, res) => {
    res.json({
      ok: true,
      message: "Server is running.",
    });
  });

  // file upload route
  app.post("/api/predict", upload.single("file"), async (req, res) => {
    try {
    const file = req.file;
    const { analysisMode, sampleName, groundTruth } = req.body;

    if (!file) {
      return res.status(400).json({
        ok: false,
        message: "No file was uploaded.",
      });
    }

    const projectRoot = process.cwd();
    const scriptPath = path.resolve(projectRoot, "ml", "predict.py");

    // Windows 上优先尝试 py，再退回 python
    let stdout = "";
    let stderr = "";

    try {
      const result = await execFileAsync("py", [scriptPath, file.path], {
        cwd: projectRoot,
      });
      stdout = result.stdout;
      stderr = result.stderr;
    } catch (firstError) {
      const result = await execFileAsync("python", [scriptPath, file.path], {
        cwd: projectRoot,
      });
      stdout = result.stdout;
      stderr = result.stderr;
    }

    if (stderr && stderr.trim()) {
      console.warn("Python stderr:", stderr);
    }

    let parsed;
    try {
      parsed = JSON.parse(stdout.trim());
    } catch {
      return res.status(500).json({
        ok: false,
        message: "Python returned invalid JSON.",
        rawOutput: stdout,
      });
    }

    if (!parsed.ok) {
      return res.status(400).json({
        ok: false,
        message: parsed.error || "Prediction failed in Python.",
        details: parsed,
      });
    }

    return res.json({
      ok: true,
      message: "Prediction completed successfully.",
      debugRouteMarker: "ROUTES_20260407_V3",
      upload: {
        originalName: file.originalname,
        storedName: file.filename,
        size: file.size,
        mimetype: file.mimetype,
        savedPath: file.path,
      },
      metadata: {
        analysisMode: analysisMode ?? null,
        sampleName: sampleName ?? null,
        groundTruth: groundTruth ?? null,
      },
      prediction: {
        label: parsed.prediction,
        confidenceScore: parsed.confidence_score ?? null,
        safeProbability: parsed.safe_probability ?? null,
        numInputFeatures: parsed.num_input_features,
      },
      
    });
  } catch (error) {
    console.error("Prediction route error:", error);

    return res.status(500).json({
      ok: false,
      message: "Prediction failed on the server.",
      error: error instanceof Error ? error.message : String(error),
    });
  }
});

    // report generation route
  app.post("/api/report", async (req, res) => {
    try {
      const {
        sampleName,
        sampleId,
        userName,
        predictedLabel,
        confidenceScore,
        safeProbability,
        analysisMode,
        compoundName,
        cellModel,
        dose,
        treatmentDuration,
        notes,
      } = req.body ?? {};

      if (!sampleName || !predictedLabel) {
        return res.status(400).json({
          ok: false,
          message: "Missing required fields: sampleName and predictedLabel are required.",
        });
      }

      const reportData = buildReportData({
        sampleName,
        sampleId: sampleId ?? sampleName,
        userName: userName ?? "",
        predictedLabel,
        confidenceScore:
          confidenceScore === null || confidenceScore === undefined
            ? null
            : Number(confidenceScore),
        safeProbability:
          safeProbability === null || safeProbability === undefined
            ? null
            : Number(safeProbability),
        analysisMode: analysisMode ?? null,
        compoundName: compoundName ?? "",
        cellModel: cellModel ?? "",
        dose: dose ?? "",
        treatmentDuration: treatmentDuration ?? "",
        notes: notes ?? "",
      });

      const reportBuffer = await generateReport(reportData);

      const safeSampleName = String(sampleName)
        .trim()
        .replace(/[^\w\-]+/g, "_")
        .replace(/^_+|_+$/g, "");

      const downloadFileName = `${safeSampleName || "sample"}-report.docx`;

      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      );
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${downloadFileName}"`,
      );

      return res.send(reportBuffer);
    } catch (error) {
      console.error("Report route error:", error);

      return res.status(500).json({
        ok: false,
        message: "Report generation failed on the server.",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });

  // multer / upload error handler
  app.use((err: any, _req: any, res: any, next: any) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({
        ok: false,
        message: err.message,
      });
    }

    if (err) {
      return res.status(400).json({
        ok: false,
        message: err.message || "Unknown upload error.",
      });
    }

    next();
  });

  // keep this import for future database/storage usage
  void storage;

  return httpServer;
}
