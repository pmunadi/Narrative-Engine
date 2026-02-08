
export interface AudioData {
  base64: string;
  mimeType: string;
  name: string;
}

export interface AppState {
  insights: string;
  narration: string;
  loading: boolean;
  error: string | null;
}
