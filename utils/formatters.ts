export const formatFileSize = (bytes?: number): string => {
  if (!bytes) return 'Unknown size';
  const mb = bytes / (1024 * 1024);
  return `${mb.toFixed(2)} MB`;
};

export const formatDuration = (seconds?: number): string => {
  if (!seconds) return 'Unknown duration';

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};
