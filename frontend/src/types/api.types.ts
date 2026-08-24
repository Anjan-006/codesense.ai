// ═══════════════════════════════════════════════════════════════
// API Types — Standard response envelope
// ═══════════════════════════════════════════════════════════════

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

export interface ErrorResponse {
  success: boolean;
  message: string;
  status: number;
  path: string;
  errors?: Record<string, string>;
  details?: string[];
  timestamp: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}
