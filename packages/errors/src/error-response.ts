import type { ErrorCode } from "./error-codes.js";

export interface ErrorResponse {
  success: false;
  error: {
    code: ErrorCode;
    message: string;
    details: unknown;
    requestId: string;
  };
}

export interface SuccessResponse<T> {
  success: true;
  data: T;
  meta?: {
    requestId?: string;
  };
}