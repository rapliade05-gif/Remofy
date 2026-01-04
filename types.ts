
export interface ImageData {
  base64: string;
  mimeType: string;
  previewUrl: string;
}

export interface ProcessingState {
  isProcessing: boolean;
  error: string | null;
  resultUrl: string | null;
}
