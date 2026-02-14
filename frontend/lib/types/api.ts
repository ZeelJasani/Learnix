export type ApiResponse<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string;
  code?: number;
};