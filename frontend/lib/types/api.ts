export type ApiResponse<T = any> = {
    success: boolean;
    data?: T;
    error?: string;
    code?: number;
  };