export const formatFileSize = (bytes?: number): string => {
  if (!bytes) return 'Unknown size';
  const mb = bytes / (1024 * 1024);
  return `${mb.toFixed(2)} MB`;
};

export const formatDuration = (seconds?: number): string => {
  if (!seconds) return 'Unknown duration';
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};
