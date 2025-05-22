/** Defines the structure for video data used throughout the app. */
export interface Video {
  /** Local file system URI for the video. */
  uri?: string;
  /** Additional details about the video. */
  metadata?: VideoMetadata;
}

/**
 * Detailed information about a video.
 * All properties are optional as they may not always be available from the source.
 */
export interface VideoMetadata {
  /** Original filename from the device. */
  fileName?: string;
  /** File size in bytes. */
  fileSize?: number;
  /** Duration in seconds. */
  duration?: number;
  /** User-provided title. */
  title?: string;
  /** User-provided description. */
  description?: string;
}
