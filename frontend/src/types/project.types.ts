// ── Project types ──────────────────────────────────────────────

export type ProjectStatus = 'UPLOADING' | 'PROCESSING' | 'INDEXING' | 'READY' | 'FAILED' | 'DELETED';
export type SourceType = 'ZIP_UPLOAD' | 'GITHUB';

export interface Project {
  id: string;
  name: string;
  description?: string;
  sourceType: SourceType;
  githubUrl?: string;
  primaryLanguage?: string;
  status: ProjectStatus;
  totalFiles: number;
  totalSizeBytes: number;
  indexedFiles: number;
  frameworkDetected?: string;
  languageStats?: Record<string, number>;
  indexingProgress: number;
  storageSizeFormatted: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateGithubProjectRequest {
  name: string;
  description?: string;
  sourceType: 'GITHUB';
  githubUrl: string;
}

export interface PagedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}
