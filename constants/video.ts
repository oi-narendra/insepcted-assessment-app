export const FILE_SIZE_LIMIT_MB = 50;
export const FILE_SIZE_LIMIT_BYTES = FILE_SIZE_LIMIT_MB * 1024 * 1024;
export const VIDEO_MAX_DURATION_SECONDS = 60;

export const ERROR_MESSAGES = {
  PERMISSION_DENIED: 'Please grant permission to access your media library to select videos.',
  FILE_TOO_LARGE: `Please select a video smaller than ${FILE_SIZE_LIMIT_MB}MB.`,
  PICKER_ERROR: 'Failed to pick video. Please try again.',
} as const;
