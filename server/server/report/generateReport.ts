import fs from "fs";
import path from "path";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import type { ReportTemplateData } from "./buildReportData";

export async function generateReport(
  reportData: ReportTemplateData,
): Promise<Buffer> {
  const projectRoot = process.cwd();
  const templatePath = path.resolve(
    projectRoot,
    "templates",
    "report-template.docx",
  );

  if (!fs.existsSync(templatePath)) {
    throw new Error(`Report template not found at: ${templatePath}`);
  }

  const templateBinary = fs.readFileSync(templatePath, "binary");
  const zip = new PizZip(templateBinary);

  const doc = new Docxtemplater(zip, {
  paragraphLoop: true,
  linebreaks: true,
  delimiters: {
    start: "{{",
    end: "}}",
  },
});

  doc.render({
    displayLabel: reportData.displayLabel,
    sampleName: reportData.sampleName,
    sampleId: reportData.sampleId,
    userName: reportData.userName,
    reportTime: reportData.reportTime,
    reportId: reportData.reportId,
    confidenceScore: reportData.confidenceScore,
    confidenceCategory: reportData.confidenceCategory,
    primaryModel: reportData.primaryModel,
  });

  const buffer = doc.getZip().generate({
    type: "nodebuffer",
    compression: "DEFLATE",
  });

  return buffer;
}