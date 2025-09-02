export interface ApiError {
  errorCode: number;
  errorName: string;
  message: string;
  userMessage: string;
  timestamp: string; // ISO string
  path: string;
  method: string;
  causedBy: string;
  suggestions: string[];
}
