export type DimensionMode = 'evidence' | 'work' | 'memory' | 'time';

export type AssetStatus =
  | 'Verified'
  | 'Needs Review'
  | 'Draft'
  | 'Archived';

export interface RepositoryAsset {
  id: string;
  title: string;
  author: string;
  summary: string;
  status: AssetStatus;
  confidence: 'High' | 'Medium' | 'Low' | 'Unknown';
  dimension: DimensionMode;
  tags: string[];
  sourceId?: string;
  projectId?: string;
  modelUrl?: string;
  thumbnail?: string;
  lastVerified: string;
  createdAt: string;
  updatedAt: string;
  memoryBytes: number;
  quantizedBytes: number;
  geometry: 'icosahedron' | 'torus' | 'box' | 'sphere';
}

export interface MemoryTelemetry {
  activeCanvases: number;
  cachedModels: number;
  estimatedGpuMb: number;
  totalRawBytes: number;
  totalQuantizedBytes: number;
}
