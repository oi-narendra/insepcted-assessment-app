export interface Video {
  uri?: string;
  metadata?: VideoMetadata;
}

export interface VideoMetadata {
  fileName?: string;
  fileSize?: number;
  duration?: number;
  title?: string;
  description?: string;
}
