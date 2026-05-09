export interface VarietyData {
  id: string;
  name: string;
  category: 'Mango' | 'Date';
  sci?: string;
  origin?: string;
  season?: string;
  color?: string;
  shape?: string;
  fiber?: string;
  brix?: string;
  best_for?: string;
  avg_price: string;
  description?: string;
}

export interface MandiRate {
  city: string;
  variety: string;
  price: number;
  trend: 'up' | 'down' | 'stable';
}

export interface AnalysisResult {
  variety: string;
  confidence: number;
  quality_score: number;
  ripeness: string;
  defects: string[];
  recommendation: string;
  details?: string;
}

export interface TraceRecord {
  id: string;
  variety: string;
  origin: string;
  harvestDate: string;
  batchSize: string;
  complianceScore: number;
}
