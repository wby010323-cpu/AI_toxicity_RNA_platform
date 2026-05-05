export type ConfidenceCategory = "high" | "moderate" | "lower";

export interface BuildReportDataInput {
  sampleName: string;
  sampleId?: string;
  userName?: string;
  predictedLabel: string;
  confidenceScore?: number | null;
  safeProbability?: number | null;
  analysisMode?: string | null;
  compoundName?: string;
  cellModel?: string;
  dose?: string;
  treatmentDuration?: string;
  notes?: string;
}

export interface ReportTemplateData {
  displayLabel: string;
  sampleName: string;
  sampleId: string;
  userName: string;
  reportTime: string;
  reportId: string;
  confidenceScore: string;
  confidenceCategory: ConfidenceCategory;
  primaryModel: string;

  // 下面这些不是你模板当前必须用到的，
  // 但后面 generateReport 或前端扩展时可能会有用，先一起保留
  predictedLabel: string;
  safeProbability: number | null;
  analysisMode: string | null;
  compoundName: string;
  cellModel: string;
  dose: string;
  treatmentDuration: string;
  notes: string;
}

function normalizePredictedLabel(label: string): string {
  return String(label).trim().toLowerCase();
}

function toDisplayLabel(predictedLabel: string): string {
  const normalized = normalizePredictedLabel(predictedLabel);

  if (normalized === "toxic") {
    return "Potentially Not Safe";
  }

  if (normalized === "non-toxic" || normalized === "nontoxic") {
    return "Likely Safe";
  }

  // 如果后面出现异常值，先给个保守兜底
  return predictedLabel;
}

function toConfidenceCategory(score: number | null | undefined): ConfidenceCategory {
  if (score === null || score === undefined || Number.isNaN(score)) {
    return "lower";
  }

  if (score > 85) {
    return "high";
  }

  if (score >= 70) {
    return "moderate";
  }

  return "lower";
}

function formatConfidenceScore(score: number | null | undefined): string {
  if (score === null || score === undefined || Number.isNaN(score)) {
    return "Not available in current version";
  }

  return `${Number(score).toFixed(1)}%`;
}

function formatReportTime(date: Date = new Date()): string {
  return date.toLocaleString("en-SG", {
    timeZone: "Asia/Singapore",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }) + " SGT";
}

function generateReportId(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `RPT-${year}${month}${day}-${hours}${minutes}${seconds}`;
}

export function buildReportData(input: BuildReportDataInput): ReportTemplateData {
  const now = new Date();

  const normalizedPredictedLabel = normalizePredictedLabel(input.predictedLabel);
  const displayLabel = toDisplayLabel(normalizedPredictedLabel);
  const confidenceCategory = toConfidenceCategory(input.confidenceScore);
  const confidenceScore = formatConfidenceScore(input.confidenceScore);

  return {
    displayLabel,
    sampleName: input.sampleName,
    sampleId: input.sampleId?.trim() || input.sampleName,
    userName: input.userName?.trim() || "N/A",
    reportTime: formatReportTime(now),
    reportId: generateReportId(now),
    confidenceScore,
    confidenceCategory,
    primaryModel: "Linear SVM",

    predictedLabel: normalizedPredictedLabel,
    safeProbability:
      input.safeProbability === null || input.safeProbability === undefined
        ? null
        : Number(input.safeProbability),
    analysisMode: input.analysisMode ?? null,
    compoundName: input.compoundName?.trim() || "",
    cellModel: input.cellModel?.trim() || "",
    dose: input.dose?.trim() || "",
    treatmentDuration: input.treatmentDuration?.trim() || "",
    notes: input.notes?.trim() || "",
  };
}