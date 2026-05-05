import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Upload, FileText, Brain, Database, Shield, ChevronRight, Download,
  Beaker, BarChart3, FileSearch, Users, FlaskConical, Activity,
  ArrowRight, CheckCircle2, Dna, Microscope, ClipboardList, Layers,
  Tag, AlertCircle, XCircle, GitMerge, ArrowDown,
} from "lucide-react";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

type AnalysisMode = "validation" | "prediction" | null;
type GroundTruth = "toxic" | "non-toxic" | null;

interface AnalysisResult {
  predictedClass: "Toxic" | "Non-Toxic";
  predictedLabel: "toxic" | "non-toxic";
  displayLabel: "Potentially Not Safe" | "Likely Safe";
  confidence: number;
  safeProbability: number | null;
  matchesGroundTruth: boolean | null;

  sampleName: string;
  sampleId: string;
  userName: string;
  analysisMode: Exclude<AnalysisMode, null>;

  compoundName: string;
  cellModel: string;
  dose: string;
  treatmentDuration: string;
  notes: string;
}

function Navbar() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border" data-testid="navbar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <button onClick={() => scrollTo("hero")} className="flex items-center gap-2 group" data-testid="link-home">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Dna className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-semibold text-foreground text-sm tracking-tight">AI-Safe</span>
        </button>
        <div className="hidden md:flex items-center gap-1">
          {[
            { label: "About", id: "about" },
            { label: "Workflow", id: "workflow" },
            { label: "Analysis", id: "mode-select" },
            { label: "Database", id: "database" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-md"
              data-testid={`link-${item.id}`}
            >
              {item.label}
            </button>
          ))}
        </div>
        <Button size="sm" onClick={() => scrollTo("mode-select")} data-testid="button-nav-upload">
          Upload Data
        </Button>
      </div>
    </nav>
  );
}

function HeroSection() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="hero" className="relative min-h-[76vh] flex items-center overflow-hidden" data-testid="section-hero">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-chart-2/5 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px]">
          <svg viewBox="0 0 800 800" className="w-full h-full opacity-[0.03]">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="800" height="800" fill="url(#grid)" />
          </svg>
        </div>
        <div className="absolute top-20 right-20 opacity-[0.06]">
          <Dna className="w-64 h-64 text-primary" />
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="max-w-3xl"
        >
          <motion.div variants={fadeIn} className="mb-6">
            <Badge variant="outline" className="px-3 py-1 text-xs font-medium text-primary border-primary/20">
              <FlaskConical className="w-3 h-3 mr-1.5" />
              Research Platform — Proof of Concept
            </Badge>
          </motion.div>

          <motion.h1
            variants={fadeIn}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground tracking-tight leading-[1.1] mb-6"
            data-testid="text-hero-title"
          >
            AI-Safe Food Safety{" "}
            <span className="text-primary">Platform</span>
          </motion.h1>

          <motion.p
            variants={fadeIn}
            className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-2xl mb-10"
            data-testid="text-hero-subtitle"
          >
            A proof-of-concept AI-assisted platform for food-related transcriptomic
            data upload, toxicity prediction, and model validation.
          </motion.p>

          <motion.div variants={fadeIn} className="flex flex-wrap gap-3">
            <Button size="lg" onClick={() => scrollTo("mode-select")} className="gap-2" data-testid="button-upload-demo">
              <Upload className="w-4 h-4" />
              Start Analysis
            </Button>
            <Button size="lg" variant="outline" onClick={() => scrollTo("about")} className="gap-2" data-testid="button-explore">
              Explore Platform
              <ArrowRight className="w-4 h-4" />
            </Button>
          </motion.div>

          <motion.div variants={fadeIn} className="mt-16 grid grid-cols-3 gap-8 max-w-lg">
            {[
              { value: "RNA-seq", label: "Data Support" },
              { value: "AI-Powered", label: "Prediction Model" },
              { value: "Open", label: "Reference DB" },
            ].map((stat) => (
              <div key={stat.label} className="text-center sm:text-left">
                <div className="text-sm font-semibold text-foreground">{stat.value}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function AboutSection() {
  const features = [
    {
      icon: Upload,
      title: "Upload Transcriptomic Data",
      description: "Submit RNA-seq derived expression matrices and gene count files through a simple drag-and-drop interface.",
    },
    {
      icon: Brain,
      title: "AI-Safe Prediction Model",
      description: "Run a trained AI-Safe model that classifies transcriptomic samples as toxic or non-toxic based on gene expression patterns.",
    },
    {
      icon: GitMerge,
      title: "Validation & Prediction Modes",
      description: "Choose between validating a known sample label against model output, or exploring a new sample of unknown toxicity.",
    },
    {
      icon: Database,
      title: "Consent-Based Reference Database",
      description: "Contribute anonymized, labeled, and matched samples to a growing food safety reference database for future model improvement.",
    },
  ];

  return (
    <section id="about" className="py-24 bg-card/30" data-testid="section-about">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={stagger}
          className="text-center mb-16"
        >
          <motion.div variants={fadeIn}>
            <Badge variant="secondary" className="mb-4">Platform Overview</Badge>
          </motion.div>
          <motion.h2
            variants={fadeIn}
            className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight mb-4"
            data-testid="text-about-title"
          >
            Supporting Food Safety with AI
          </motion.h2>
          <motion.p variants={fadeIn} className="text-muted-foreground max-w-2xl mx-auto text-base leading-relaxed">
            This platform supports food safety assessment using transcriptomic data and
            AI-assisted toxicity prediction. Researchers can upload gene expression data, run the
            AI-Safe model, and optionally contribute validated samples to the reference database.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={stagger}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {features.map((feature) => (
            <motion.div key={feature.title} variants={fadeIn}>
              <Card className="h-full transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 border-border/60">
                <CardHeader className="pb-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                    <feature.icon className="w-5 h-5 text-primary" />
                  </div>
                  <CardTitle className="text-base font-semibold">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function WorkflowSection() {
  return (
    <section id="workflow" className="py-24" data-testid="section-workflow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={stagger}
          className="text-center mb-16"
        >
          <motion.div variants={fadeIn}>
            <Badge variant="secondary" className="mb-4">How It Works</Badge>
          </motion.div>
          <motion.h2
            variants={fadeIn}
            className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight mb-4"
            data-testid="text-workflow-title"
          >
            Analysis Workflows
          </motion.h2>
          <motion.p variants={fadeIn} className="text-muted-foreground max-w-xl mx-auto text-base">
            Two distinct paths depending on whether the ground-truth label of your sample is known.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={stagger}
          className="grid md:grid-cols-2 gap-8"
        >
          {/* Validation Mode flow */}
          <motion.div variants={fadeIn}>
            <Card className="h-full border-border/60 shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
              <div className="bg-primary/5 border-b border-border/60 px-6 py-4">
                <div className="flex items-center gap-2 mb-1">
                  <Tag className="w-4 h-4 text-primary" />
                  <span className="font-semibold text-sm text-foreground">Validation Mode</span>
                </div>
                <p className="text-xs text-muted-foreground">For samples with known toxic / non-toxic labels</p>
              </div>
              <CardContent className="pt-6 pb-6 px-6">
                <div className="flex flex-col gap-2">
                  {[
                    { icon: Upload, text: "Upload transcriptomic data" },
                    { icon: Tag, text: "Provide known ground-truth label" },
                    { icon: Brain, text: "Run AI-Safe prediction model" },
                    { icon: GitMerge, text: "Compare prediction vs. known label" },
                    { icon: Database, text: "Optionally contribute matched sample" },
                  ].map((step, i, arr) => (
                    <div key={step.text}>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          <step.icon className="w-4 h-4 text-primary" />
                        </div>
                        <span className="text-sm text-foreground">{step.text}</span>
                      </div>
                      {i < arr.length - 1 && (
                        <div className="ml-4 my-1">
                          <ArrowDown className="w-3 h-3 text-border" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Prediction Mode flow */}
          <motion.div variants={fadeIn}>
            <Card className="h-full border-border/60 shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
              <div className="bg-chart-4/5 border-b border-border/60 px-6 py-4">
                <div className="flex items-center gap-2 mb-1">
                  <Brain className="w-4 h-4 text-chart-4" />
                  <span className="font-semibold text-sm text-foreground">Prediction Mode</span>
                </div>
                <p className="text-xs text-muted-foreground">For new samples without a known label</p>
              </div>
              <CardContent className="pt-6 pb-6 px-6">
                <div className="flex flex-col gap-2">
                  {[
                    { icon: Upload, text: "Upload transcriptomic data" },
                    { icon: Brain, text: "Run AI-Safe prediction model" },
                    { icon: FileSearch, text: "View prediction result & confidence" },
                    { icon: BarChart3, text: "Explore interpretation summary" },
                  ].map((step, i, arr) => (
                    <div key={step.text}>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-chart-4/10 flex items-center justify-center shrink-0">
                          <step.icon className="w-4 h-4 text-chart-4" />
                        </div>
                        <span className="text-sm text-foreground">{step.text}</span>
                      </div>
                      {i < arr.length - 1 && (
                        <div className="ml-4 my-1">
                          <ArrowDown className="w-3 h-3 text-border" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

interface ModeSelectorProps {
  analysisMode: AnalysisMode;
  onSelectMode: (mode: AnalysisMode) => void;
}

function ModeSelector({ analysisMode, onSelectMode }: ModeSelectorProps) {
  return (
    <section id="mode-select" className="py-24 bg-card/30" data-testid="section-mode-select">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={stagger}
          className="text-center mb-12"
        >
          <motion.div variants={fadeIn}>
            <Badge variant="secondary" className="mb-4">Analysis Setup</Badge>
          </motion.div>
          <motion.h2
            variants={fadeIn}
            className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight mb-4"
            data-testid="text-mode-title"
          >
            Choose Analysis Mode
          </motion.h2>
          <motion.p variants={fadeIn} className="text-muted-foreground max-w-xl mx-auto text-base">
            Select the mode that matches your research scenario before uploading data.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={stagger}
          className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto"
        >
          {/* Validation Mode Card */}
          <motion.div variants={fadeIn}>
            <button
              className="w-full text-left"
              onClick={() => onSelectMode(analysisMode === "validation" ? null : "validation")}
              data-testid="card-validation-mode"
            >
              <Card className={`h-full border-2 transition-all duration-200 cursor-pointer hover:shadow-md hover:-translate-y-0.5 ${
                analysisMode === "validation"
                  ? "border-primary shadow-md bg-primary/[0.03]"
                  : "border-border/60 hover:border-primary/30"
              }`}>
                <CardContent className="pt-6 pb-6 px-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      analysisMode === "validation" ? "bg-primary/15" : "bg-muted"
                    }`}>
                      <Tag className={`w-6 h-6 ${analysisMode === "validation" ? "text-primary" : "text-muted-foreground"}`} />
                    </div>
                    {analysisMode === "validation" && (
                      <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                        <CheckCircle2 className="w-3.5 h-3.5 text-primary-foreground" />
                      </div>
                    )}
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">Validation Mode</h3>
                  <p className="text-xs text-muted-foreground mb-4 font-medium">For samples with known toxic / non-toxic labels</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    You know whether your sample is toxic or non-toxic. Upload your data, provide the
                    ground-truth label, run the model, and compare the prediction to your known result.
                    Matched samples can optionally be contributed to the reference database.
                  </p>
                </CardContent>
              </Card>
            </button>
          </motion.div>

          {/* Prediction Mode Card */}
          <motion.div variants={fadeIn}>
            <button
              className="w-full text-left"
              onClick={() => onSelectMode(analysisMode === "prediction" ? null : "prediction")}
              data-testid="card-prediction-mode"
            >
              <Card className={`h-full border-2 transition-all duration-200 cursor-pointer hover:shadow-md hover:-translate-y-0.5 ${
                analysisMode === "prediction"
                  ? "border-chart-4 shadow-md bg-chart-4/[0.03]"
                  : "border-border/60 hover:border-chart-4/40"
              }`}>
                <CardContent className="pt-6 pb-6 px-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      analysisMode === "prediction" ? "bg-chart-4/15" : "bg-muted"
                    }`}>
                      <Brain className={`w-6 h-6 ${analysisMode === "prediction" ? "text-chart-4" : "text-muted-foreground"}`} />
                    </div>
                    {analysisMode === "prediction" && (
                      <div className="w-5 h-5 rounded-full bg-chart-4 flex items-center justify-center">
                        <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                      </div>
                    )}
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">Prediction Mode</h3>
                  <p className="text-xs text-muted-foreground mb-4 font-medium">For new samples without a known label</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    You do not know whether your sample is toxic or non-toxic. Upload your transcriptomic
                    data, run the AI-Safe model, and receive a prediction with confidence score and
                    a research-use interpretation summary.
                  </p>
                </CardContent>
              </Card>
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

interface UploadSectionProps {
  analysisMode: AnalysisMode;
  onResult: (result: AnalysisResult) => void;
}

function UploadSection({ analysisMode, onResult }: UploadSectionProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [groundTruth, setGroundTruth] = useState<GroundTruth>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [formData, setFormData] = useState({
    sampleName: "",
    compoundName: "",
    cellModel: "",
    dose: "",
    treatmentDuration: "",
    notes: "",
  });

  if (!analysisMode) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setSelectedFile(file);
    setUploadMessage(null);
    setErrorMessage(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0] ?? null;
    if (file) {
      setSelectedFile(file);
      setUploadMessage(null);
      setErrorMessage(null);
    }
  };

  const handleRunPrediction = async () => {
    if (!selectedFile) {
    setErrorMessage("Please select a CSV file first.");
    return;
  }

  setIsRunning(true);
  setUploadMessage(null);
  setErrorMessage(null);

  try {
    const payload = new FormData();
    payload.append("file", selectedFile);
    payload.append("analysisMode", analysisMode ?? "");
    payload.append("sampleName", formData.sampleName ?? "");

    if (analysisMode === "validation" && groundTruth) {
      payload.append("groundTruth", groundTruth);
    }

    const response = await fetch("/api/predict", {
      method: "POST",
      body: payload,
    });

    const data = await response.json();

    if (!response.ok || !data.ok) {
      throw new Error(data.message || "Prediction failed.");
    }

    const rawLabel = data.prediction?.label ?? "";
    const normalizedLabel = String(rawLabel).toLowerCase();

    const predictedClass =
      normalizedLabel === "toxic" ? "Toxic" : "Non-Toxic";
    
    const confidenceScore = Number(data.prediction?.confidenceScore ?? 0);

    setUploadMessage(
      `Prediction completed: ${rawLabel} for ${data.upload.originalName}`
    );

        const predictedLabel: "toxic" | "non-toxic" =
      normalizedLabel === "toxic" ? "toxic" : "non-toxic";

    const displayLabel: "Potentially Not Safe" | "Likely Safe" =
      predictedLabel === "toxic" ? "Potentially Not Safe" : "Likely Safe";

    const safeProbabilityRaw = data.prediction?.safeProbability;
    const safeProbability =
      safeProbabilityRaw === null || safeProbabilityRaw === undefined
        ? null
        : Number(safeProbabilityRaw);

    onResult({
      predictedClass,
      predictedLabel,
      displayLabel,
      confidence: confidenceScore,
      safeProbability,
      matchesGroundTruth:
        analysisMode === "validation" && groundTruth
          ? (groundTruth === "toxic" && normalizedLabel === "toxic") ||
            (groundTruth === "non-toxic" &&
              (normalizedLabel === "nontoxic" || normalizedLabel === "non-toxic"))
          : null,

      sampleName: formData.sampleName,
      sampleId: formData.sampleName,
      userName: "N/A",
      analysisMode: analysisMode,

      compoundName: formData.compoundName,
      cellModel: formData.cellModel,
      dose: formData.dose,
      treatmentDuration: formData.treatmentDuration,
      notes: formData.notes,
    });

    setTimeout(() => {
      document.getElementById("results")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown prediction error.";
    setErrorMessage(message);
  } finally {
    setIsRunning(false);
  }
};


  const canRun =
    selectedFile &&
    formData.sampleName &&
    (analysisMode === "prediction" || groundTruth !== null);

  return (
    <section id="upload" className="py-24" data-testid="section-upload">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={stagger}
          className="text-center mb-12"
        >
          <motion.div variants={fadeIn}>
            <Badge
              variant="secondary"
              className="mb-4"
              style={analysisMode === "prediction" ? { borderColor: "hsl(var(--chart-4)/0.4)", color: "hsl(var(--chart-4))" } : {}}
            >
              {analysisMode === "validation" ? "Validation Mode — " : "Prediction Mode — "}Data Submission
            </Badge>
          </motion.div>
          <motion.h2
            variants={fadeIn}
            className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight mb-4"
            data-testid="text-upload-title"
          >
            Upload Your Data
          </motion.h2>
          <motion.p variants={fadeIn} className="text-muted-foreground max-w-xl mx-auto text-base">
            {analysisMode === "validation"
              ? "Submit your transcriptomic data and provide the known ground-truth label for model validation."
              : "Submit transcriptomic data for AI-Safe toxicity prediction."}
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeIn}
          className="max-w-3xl mx-auto"
        >
          <Card className="border-border/60 shadow-sm">
            <CardContent className="p-6 sm:p-8">
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                className="hidden"
                onChange={handleFileChange}
              />
              {/* Drop zone */}
              <div
                role="button"
                tabIndex={0}
                aria-label="Upload file dropzone. Click or press Enter to select a file."
                className={`relative border-2 border-dashed rounded-xl p-10 text-center transition-all duration-200 cursor-pointer mb-8 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
                  isDragging
                    ? "border-primary bg-primary/5"
                    : selectedFile
                    ? "border-chart-2/50 bg-chart-2/5"
                    : "border-border hover:border-primary/40 hover:bg-primary/[0.02]"
                }`}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    fileInputRef.current?.click();
                  }
                }}
                data-testid="upload-dropzone"
              >
                {selectedFile ? (
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-14 h-14 rounded-xl bg-chart-2/10 flex items-center justify-center">
                      <CheckCircle2 className="w-7 h-7 text-chart-2" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground text-sm">{selectedFile.name}</p>
                      <p className="text-xs text-muted-foreground mt-1">File selected — ready for submission</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => { e.stopPropagation(); setSelectedFile(null); }}
                      className="text-xs text-muted-foreground"
                      data-testid="button-remove-file"
                    >
                      Remove
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Upload className="w-7 h-7 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground text-sm">Drag & drop your file here</p>
                      <p className="text-xs text-muted-foreground mt-1">or click to select a file</p>
                    </div>
                    <Button variant="outline" size="sm" className="mt-1" data-testid="button-select-file">
                      Select File
                    </Button>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-2 mb-8">
                <span className="text-xs text-muted-foreground">Accepted formats:</span>
                {["expression_matrix.csv", "gene_counts.tsv", "sample_metadata.xlsx"].map((f) => (
                  <Badge key={f} variant="outline" className="text-xs font-mono">{f}</Badge>
                ))}
              </div>

              {/* Sample metadata */}
              <div className="space-y-5 mb-8">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Beaker className="w-4 h-4 text-primary" />
                  Sample Metadata
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="sample-name" className="text-xs font-medium text-muted-foreground">
                      Sample Name <span className="text-destructive">*</span>
                    </label>
                    <Input
                      id="sample-name"
                      placeholder="e.g., HepG2_BPA_24h"
                      value={formData.sampleName}
                      onChange={(e) => setFormData({ ...formData, sampleName: e.target.value })}
                      data-testid="input-sample-name"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="compound-name" className="text-xs font-medium text-muted-foreground">Compound Name</label>
                    <Input
                      id="compound-name"
                      placeholder="e.g., Bisphenol A"
                      value={formData.compoundName}
                      onChange={(e) => setFormData({ ...formData, compoundName: e.target.value })}
                      data-testid="input-compound-name"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="cell-model" className="text-xs font-medium text-muted-foreground">Cell Model</label>
                    <Input
                      id="cell-model"
                      placeholder="e.g., HepG2"
                      value={formData.cellModel}
                      onChange={(e) => setFormData({ ...formData, cellModel: e.target.value })}
                      data-testid="input-cell-model"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="dose" className="text-xs font-medium text-muted-foreground">Dose</label>
                    <Input
                      id="dose"
                      placeholder="e.g., 10 µM"
                      value={formData.dose}
                      onChange={(e) => setFormData({ ...formData, dose: e.target.value })}
                      data-testid="input-dose"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="treatment-duration" className="text-xs font-medium text-muted-foreground">Treatment Duration</label>
                    <Input
                      id="treatment-duration"
                      placeholder="e.g., 24 hours"
                      value={formData.treatmentDuration}
                      onChange={(e) => setFormData({ ...formData, treatmentDuration: e.target.value })}
                      data-testid="input-treatment-duration"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="notes" className="text-xs font-medium text-muted-foreground">Notes</label>
                  <Textarea
                    id="notes"
                    placeholder="Additional experimental notes or observations..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="min-h-[60px]"
                    data-testid="input-notes"
                  />
                </div>
              </div>

              {/* Ground-truth label — Validation Mode only */}
              <AnimatePresence>
                {analysisMode === "validation" && (
                  <motion.div
                    key="ground-truth"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}
                    className="mb-8"
                  >
                    <div className="p-5 rounded-xl bg-primary/[0.04] border border-primary/20">
                      <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-1">
                        <Tag className="w-4 h-4 text-primary" />
                        Ground-Truth Label <span className="text-destructive">*</span>
                      </h3>
                      <p className="text-xs text-muted-foreground mb-4">
                        Select the known toxicity label for this sample. The model prediction will be compared against this value.
                      </p>
                      <div className="flex gap-3">
                        <button
                          onClick={() => setGroundTruth("toxic")}
                          data-testid="button-gt-toxic"
                          className={`flex-1 py-3 px-4 rounded-lg border-2 text-sm font-medium transition-all duration-150 ${
                            groundTruth === "toxic"
                              ? "border-destructive bg-destructive/10 text-destructive"
                              : "border-border bg-background text-muted-foreground hover:border-destructive/40"
                          }`}
                        >
                          Toxic
                        </button>
                        <button
                          onClick={() => setGroundTruth("non-toxic")}
                          data-testid="button-gt-non-toxic"
                          className={`flex-1 py-3 px-4 rounded-lg border-2 text-sm font-medium transition-all duration-150 ${
                            groundTruth === "non-toxic"
                              ? "border-chart-2 bg-chart-2/10 text-chart-2"
                              : "border-border bg-background text-muted-foreground hover:border-chart-2/40"
                          }`}
                        >
                          Non-Toxic
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Run button */}
              <div className="space-y-3">
                <Button
                  className="w-full gap-2"
                  size="lg"
                  onClick={handleRunPrediction}
                  disabled={!canRun || isRunning}
                  data-testid="button-run-prediction"
                >
                  {isRunning ? (
                    <>
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      Running AI-Safe Prediction…
                    </>
                  ) : (
                    <>
                      <Brain className="w-4 h-4" />
                      Run AI-Safe Prediction
                    </>
                  )}
                </Button>

                {uploadMessage && (
                  <div className="rounded-md border border-green-300 bg-green-50 px-4 py-3 text-sm text-green-700">
                    {uploadMessage}
                  </div>
                )}

                {errorMessage && (
                  <div className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                    {errorMessage}
                  </div>
                )}

                <p className="text-center text-xs text-muted-foreground">
                  This prototype is intended for research use only. Results do not constitute clinical or regulatory advice.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}

interface ResultsSectionProps {
  analysisMode: AnalysisMode;
  result: AnalysisResult | null;
}

function ResultsSection({ analysisMode, result }: ResultsSectionProps) {
  const [consentContribute, setConsentContribute] = useState(false);
  const [contributed, setContributed] = useState(false);
  const [isDownloadingReport, setIsDownloadingReport] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  if (!result) return null;

  const isMatched = result.matchesGroundTruth === true;
  const isNotMatched = result.matchesGroundTruth === false;
  const handleDownloadReport = async () => {
    try {
      setIsDownloadingReport(true);
      setDownloadError(null);

      const response = await fetch("/api/report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sampleName: result.sampleName,
          sampleId: result.sampleId,
          userName: result.userName,
          predictedLabel: result.predictedLabel,
          confidenceScore: result.confidence,
          safeProbability: result.safeProbability,
          analysisMode: result.analysisMode,
          compoundName: result.compoundName,
          cellModel: result.cellModel,
          dose: result.dose,
          treatmentDuration: result.treatmentDuration,
          notes: result.notes,
        }),
      });

      if (!response.ok) {
        let message = "Failed to generate report.";
        try {
          const errorData = await response.json();
          message = errorData.message || message;
        } catch {
          // ignore JSON parse failure and keep fallback message
        }
        throw new Error(message);
      }

      const blob = await response.blob();

      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      const safeName =
        result.sampleName?.trim().replace(/[^\w\-]+/g, "_") || "sample";

      link.href = downloadUrl;
      link.download = `${safeName}-report.docx`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown report download error.";
      setDownloadError(message);
    } finally {
      setIsDownloadingReport(false);
    }
  };
  const pathways = [
    { name: "NRF2-mediated Oxidative Stress Response", direction: "Up", pValue: "2.3e-6" },
    { name: "Xenobiotic Metabolism Signaling", direction: "Up", pValue: "4.1e-5" },
    { name: "Aryl Hydrocarbon Receptor Signaling", direction: "Up", pValue: "1.7e-4" },
    { name: "Mitochondrial Dysfunction", direction: "Down", pValue: "3.2e-4" },
    { name: "Glutathione-mediated Detoxification", direction: "Up", pValue: "8.9e-4" },
  ];

  return (
    <section id="results" className="py-24 bg-card/30" data-testid="section-results">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={stagger}
          className="text-center mb-12"
        >
          <motion.div variants={fadeIn}>
            <Badge variant="secondary" className="mb-4">Prediction Result</Badge>
          </motion.div>
          <motion.h2
            variants={fadeIn}
            className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight mb-4"
            data-testid="text-results-title"
          >
            {analysisMode === "validation" ? "Validation Result" : "Prediction Result"}
          </motion.h2>
          <motion.p variants={fadeIn} className="text-muted-foreground max-w-xl mx-auto text-base">
            {analysisMode === "validation"
              ? "Model output compared against the ground-truth label you provided."
              : "AI-Safe model output for your uploaded sample."}
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeIn}
          className="max-w-4xl mx-auto space-y-6"
        >
          {/* Main result card */}
          <Card className="border-border/60 shadow-sm overflow-hidden">
            <div className="bg-primary/5 border-b border-border/60 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileSearch className="w-5 h-5 text-primary" />
                <div>
                  <h3 className="font-semibold text-sm text-foreground">AI-Safe Analysis Report</h3>
                  <p className="text-xs text-muted-foreground">
                    {analysisMode === "validation" ? "Validation Mode" : "Prediction Mode"} — Generated {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </p>
                </div>
              </div>
              
            </div>

            <CardContent className="p-6 sm:p-8 space-y-8">
              {/* Core metrics */}
              <div className={`grid gap-4 ${analysisMode === "validation" ? "sm:grid-cols-4" : "sm:grid-cols-3"}`}>
                <div className={`p-4 rounded-lg border ${
                  result.predictedClass === "Toxic"
                    ? "bg-destructive/5 border-destructive/20"
                    : "bg-chart-2/5 border-chart-2/20"
                }`}>
                  <div className="text-xs text-muted-foreground mb-1">Model Prediction</div>
                  <div className={`text-lg font-bold ${result.predictedClass === "Toxic" ? "text-destructive" : "text-chart-2"}`}
                    data-testid="text-predicted-class">
                    {result.predictedClass}
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                  <div className="text-xs text-muted-foreground mb-1">Confidence Score</div>
                  <div className="flex items-end gap-2">
                    <span className="text-lg font-bold text-primary" data-testid="text-confidence">{result.confidence}%</span>
                  </div>
                  <Progress value={result.confidence} className="mt-2 h-1.5" />
                </div>
                
                {analysisMode === "validation" && (
                  <div className={`p-4 rounded-lg border ${
                    isMatched
                      ? "bg-chart-2/5 border-chart-2/20"
                      : "bg-amber-500/5 border-amber-500/20"
                  }`}>
                    <div className="text-xs text-muted-foreground mb-1">Match Status</div>
                    <div className={`flex items-center gap-1.5 text-base font-bold ${isMatched ? "text-chart-2" : "text-amber-500"}`}
                      data-testid="text-match-status">
                      {isMatched ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                      {isMatched ? "Matched" : "Not matched"}
                    </div>
                  </div>
                )}
              </div>

              {/* Pathway table */}
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-primary" />
                  Top Altered Pathways
                </h4>
                <div className="rounded-lg border border-border/60 overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/30">
                        <TableHead className="text-xs">Pathway</TableHead>
                        <TableHead className="text-xs w-24">Direction</TableHead>
                        <TableHead className="text-xs w-24 text-right">p-value</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pathways.map((p) => (
                        <TableRow key={p.name}>
                          <TableCell className="text-sm font-medium">{p.name}</TableCell>
                          <TableCell>
                            <Badge variant={p.direction === "Up" ? "default" : "secondary"} className="text-xs">
                              {p.direction === "Up" ? "↑" : "↓"} {p.direction}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right font-mono text-xs text-muted-foreground">{p.pValue}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* Interpretation summary */}
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-primary" />
                  Interpretation Summary
                </h4>
                <div className="p-4 rounded-lg bg-muted/20 border border-border/60">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    The submitted sample shows a gene expression profile consistent with{" "}
                    {result.predictedClass === "Toxic"
                      ? "toxicity-associated stress responses. Key upregulated pathways include NRF2-mediated oxidative stress response and aryl hydrocarbon receptor signaling, suggesting significant cellular perturbation."
                      : "adaptive stress responses rather than overt cytotoxicity. Key upregulated pathways include NRF2-mediated oxidative stress response and xenobiotic metabolism, suggesting activation of cellular defense mechanisms."}
                    {" "}
                    The AI-Safe model predicts this sample as{" "}
                    <strong>{result.predictedClass === "Toxic" ? "toxic" : "likely non-toxic"}</strong>{" "}
                    with {result.confidence}% confidence. These results should be validated with complementary assays.
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-border/60 space-y-3">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <p className="text-xs text-muted-foreground italic">
                    This is a prototype demonstration. No real biological analysis was performed.
                  </p>
                  <Button
                    variant="outline"
                    className="gap-2 shrink-0"
                    data-testid="button-download-report"
                    onClick={handleDownloadReport}
                    disabled={isDownloadingReport}
                  >
                    {isDownloadingReport ? (
                      <>
                        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                        </svg>
                        Generating Report...
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4" />
                        Download Report
                      </>
                    )}
                  </Button>
                </div>

                {downloadError && (
                  <div className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                    {downloadError}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Validation Mode — match / no-match panels */}
          {analysisMode === "validation" && (
            <AnimatePresence>
              {isMatched && !contributed && (
                <motion.div
                  key="contribution-panel"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="border-chart-2/30 bg-chart-2/[0.03] shadow-sm" data-testid="card-contribution">
                    <CardContent className="p-6 sm:p-8">
                      <div className="flex items-start gap-4 mb-5">
                        <div className="w-10 h-10 rounded-lg bg-chart-2/15 flex items-center justify-center shrink-0">
                          <Database className="w-5 h-5 text-chart-2" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground mb-1">
                            Contribute this sample to the AI-Safe reference database
                          </h3>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            The model prediction matched your provided label. Anonymized labeled samples
                            submitted with user consent may help improve the AI-Safe food safety reference
                            database and future model development. Contributions are subject to quality
                            review and internal curation by the research team.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 mb-5 p-4 rounded-lg bg-background/60 border border-border/60">
                        <Checkbox
                          id="consent-contribute"
                          checked={consentContribute}
                          onCheckedChange={(v) => setConsentContribute(v as boolean)}
                          data-testid="checkbox-consent-contribute"
                        />
                        <label htmlFor="consent-contribute" className="text-sm text-muted-foreground leading-relaxed cursor-pointer">
                          I consent to the use of this anonymized labeled sample for inclusion in the
                          AI-Safe research reference database, subject to quality review and internal curation.
                        </label>
                      </div>
                      <Button
                        variant="outline"
                        className="gap-2 border-chart-2/40 text-chart-2 hover:bg-chart-2/10"
                        disabled={!consentContribute}
                        onClick={() => setContributed(true)}
                        data-testid="button-contribute-sample"
                      >
                        <Database className="w-4 h-4" />
                        Contribute Sample
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {isMatched && contributed && (
                <motion.div
                  key="contributed-panel"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="border-chart-2/30 bg-chart-2/[0.03]" data-testid="card-contributed">
                    <CardContent className="p-6 flex items-center gap-4">
                      <CheckCircle2 className="w-8 h-8 text-chart-2 shrink-0" />
                      <div>
                        <h3 className="font-semibold text-foreground mb-0.5">Sample submitted for curation</h3>
                        <p className="text-sm text-muted-foreground">
                          Thank you. Your anonymized sample has been flagged for review by the AI-Safe curation team.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {isNotMatched && (
                <motion.div
                  key="mismatch-panel"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="border-amber-500/30 bg-amber-500/[0.03]" data-testid="card-mismatch">
                    <CardContent className="p-6 sm:p-8">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
                          <AlertCircle className="w-5 h-5 text-amber-500" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground mb-2">Prediction does not match provided label</h3>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            The model prediction does not match the user-provided label. This sample may
                            represent a difficult or out-of-distribution case. It can still be retained
                            for private reference in this prototype, but it should not be automatically
                            prioritized for database contribution. Consider reviewing the input data or
                            running additional biological assays.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          )}

          {/* Prediction Mode disclaimer */}
          {analysisMode === "prediction" && (
            <Card className="border-border/40 bg-muted/20" data-testid="card-prediction-disclaimer">
              <CardContent className="p-5 flex items-start gap-3">
                <Shield className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                <p className="text-xs text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">Research use only.</strong>{" "}
                  This result was generated by a prototype model and is intended solely for exploratory
                  research purposes. It should not be used as the basis for regulatory, clinical, or
                  safety-critical decisions. No data has been stored or transmitted.
                </p>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
    </section>
  );
}

function DatabaseSection() {
  const metrics = [
    { icon: FileText, label: "Total Curated Studies", value: "1,247" },
    { icon: Shield, label: "Non-Toxic References", value: "892" },
    { icon: FlaskConical, label: "Toxic References", value: "355" },
    { icon: Beaker, label: "Supported Cell Models", value: "12" },
  ];

  const recentSubmissions = [
    { id: "SUB-2847", sample: "HepaRG_AFB1_6h", compound: "Aflatoxin B1", cellModel: "HepaRG", status: "Curated", date: "Mar 8, 2026" },
    { id: "SUB-2846", sample: "HepG2_DMSO_24h", compound: "DMSO (Control)", cellModel: "HepG2", status: "Curated", date: "Mar 7, 2026" },
    { id: "SUB-2845", sample: "MCF7_BPA_48h", compound: "Bisphenol A", cellModel: "MCF-7", status: "Under Review", date: "Mar 7, 2026" },
    { id: "SUB-2844", sample: "HepG2_DON_24h", compound: "Deoxynivalenol", cellModel: "HepG2", status: "Curated", date: "Mar 6, 2026" },
    { id: "SUB-2843", sample: "Caco2_OTA_12h", compound: "Ochratoxin A", cellModel: "Caco-2", status: "Curated", date: "Mar 5, 2026" },
  ];

  return (
    <section id="database" className="py-24 bg-card/30" data-testid="section-database">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={stagger}
          className="text-center mb-12"
        >
          <motion.div variants={fadeIn}>
            <Badge variant="secondary" className="mb-4">Reference Database</Badge>
          </motion.div>
          <motion.h2
            variants={fadeIn}
            className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight mb-4"
            data-testid="text-database-title"
          >
            AI-Safe Reference Database
          </motion.h2>
          <motion.p variants={fadeIn} className="text-muted-foreground max-w-xl mx-auto text-base">
            A curated food safety reference database built through consented, anonymized submissions
            from researchers. Only samples where the model prediction matched a user-provided label
            are considered for curation, subject to internal quality review.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={stagger}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12"
        >
          {metrics.map((metric) => (
            <motion.div key={metric.label} variants={fadeIn}>
              <Card className="border-border/60 hover:shadow-md transition-all duration-200">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <metric.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-foreground">{metric.value}</div>
                    <div className="text-xs text-muted-foreground">{metric.label}</div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeIn}
        >
          <Card className="border-border/60 shadow-sm overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" />
                Recent Curated Submissions
              </CardTitle>
              <CardDescription>
                Anonymized samples consented by researchers and accepted after quality curation
              </CardDescription>
            </CardHeader>
            <CardContent className="px-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/20">
                    <TableHead className="text-xs">ID</TableHead>
                    <TableHead className="text-xs">Sample</TableHead>
                    <TableHead className="text-xs hidden sm:table-cell">Compound</TableHead>
                    <TableHead className="text-xs hidden md:table-cell">Cell Model</TableHead>
                    <TableHead className="text-xs">Status</TableHead>
                    <TableHead className="text-xs text-right hidden sm:table-cell">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentSubmissions.map((sub) => (
                    <TableRow key={sub.id}>
                      <TableCell className="font-mono text-xs text-primary">{sub.id}</TableCell>
                      <TableCell className="font-medium text-sm">{sub.sample}</TableCell>
                      <TableCell className="text-sm text-muted-foreground hidden sm:table-cell">{sub.compound}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Badge variant="outline" className="text-xs">{sub.cellModel}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={sub.status === "Curated" ? "secondary" : "default"}
                          className="text-xs"
                        >
                          {sub.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right text-xs text-muted-foreground hidden sm:table-cell">{sub.date}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          <p className="text-xs text-muted-foreground text-center mt-4">
            The reference database grows through consented and validated submissions. Only anonymized
            data is included. Contributions are never used for purposes beyond model and database improvement.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

function EthicsSection() {
  const points = [
    {
      icon: Shield,
      title: "Research Use Only",
      description: "This platform is designed exclusively for academic and research purposes. It is not intended as a clinical diagnostic or regulatory system.",
    },
    {
      icon: FileText,
      title: "Consent-Based Data Use",
      description: "Uploaded data will only be considered for database contribution if explicit user consent is provided. Only anonymized data is retained beyond the session.",
    },
    {
      icon: Database,
      title: "Curated Contributions",
      description: "Only matched, consented samples may be submitted for curation. All contributions undergo internal quality review before inclusion in the reference database.",
    },
  ];

  return (
    <section id="ethics" className="py-24" data-testid="section-ethics">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={stagger}
          className="text-center mb-12"
        >
          <motion.div variants={fadeIn}>
            <Badge variant="secondary" className="mb-4">Intended Use & Data Policy</Badge>
          </motion.div>
          <motion.h2
            variants={fadeIn}
            className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight mb-4"
            data-testid="text-ethics-title"
          >
            Responsible Use & Data Policy
          </motion.h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={stagger}
          className="grid md:grid-cols-3 gap-5 max-w-4xl mx-auto"
        >
          {points.map((point) => (
            <motion.div key={point.title} variants={fadeIn}>
              <Card className="h-full border-border/60 hover:shadow-md transition-all duration-200">
                <CardContent className="pt-6 pb-6 px-6 text-center">
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center mx-auto mb-4">
                    <point.icon className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <h3 className="font-semibold text-sm text-foreground mb-2">{point.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{point.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function Footer() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const links = [
    { label: "About", id: "about" },
    { label: "Workflow", id: "workflow" },
    { label: "Analysis", id: "mode-select" },
    { label: "Reference Database", id: "database" },
    { label: "Data Policy", id: "ethics" },
  ];

  return (
    <footer className="border-t border-border bg-card/50 py-12" data-testid="footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Dna className="w-4 h-4 text-primary-foreground" />
            </div>
            <div>
              <span className="font-semibold text-foreground text-sm">AI-Safe Food Safety Platform</span>
              <p className="text-xs text-muted-foreground">Proof-of-Concept Research Platform</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-1">
            {links.map((link) => (
              <button
                key={link.label}
                onClick={() => scrollTo(link.id)}
                className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-md"
                data-testid={`link-footer-${link.label.toLowerCase().replace(/\s/g, '-')}`}
              >
                {link.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border/60 text-center">
          <p className="text-xs text-muted-foreground">
            AI-Safe Food Safety Platform is a research prototype developed for academic purposes.
            Not intended for clinical or regulatory use. Uploaded data is used only with explicit
            user consent. Anonymized contributions are subject to quality review. All demonstration
            data is fictional.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default function Home() {
  const [analysisMode, setAnalysisMode] = useState<AnalysisMode>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  const handleSelectMode = (mode: AnalysisMode) => {
    setAnalysisMode(mode);
    setAnalysisResult(null);
    if (mode) {
      setTimeout(() => {
        document.getElementById("upload")?.scrollIntoView({ behavior: "smooth" });
      }, 150);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <WorkflowSection />
      <ModeSelector analysisMode={analysisMode} onSelectMode={handleSelectMode} />
      <UploadSection analysisMode={analysisMode} onResult={setAnalysisResult} />
      <ResultsSection analysisMode={analysisMode} result={analysisResult} />
      <DatabaseSection />
      <EthicsSection />
      <Footer />
    </div>
  );
}
