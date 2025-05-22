// Maximum video file size in MB
export const FILE_SIZE_LIMIT_MB = 50;

// Maximum video file size in bytes
export const FILE_SIZE_LIMIT_BYTES = FILE_SIZE_LIMIT_MB * 1024 * 1024;

// User-facing error messages for video processing
export const ERROR_MESSAGES = {
  PERMISSION_DENIED: 'Please grant permission to access your media library to select videos.',
  FILE_TOO_LARGE: `Please select a video smaller than ${FILE_SIZE_LIMIT_MB}MB.`,
  PICKER_ERROR: 'Failed to pick video. Please try again.',
} as const;
