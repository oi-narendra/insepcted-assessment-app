/** Converts bytes to a string like "10.50 MB". */
export const formatFileSize = (bytes?: number): string => {
  if (!bytes) return 'Unknown size';
  const mb = bytes / (1024 * 1024); // Convert bytes to megabytes
  return `${mb.toFixed(2)} MB`; // Format to 2 decimal places
};

/** Converts seconds to a string like "05:30". */
export const formatDuration = (seconds?: number): string => {
  if (!seconds) return 'Unknown duration';

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  // Pad with leading zero if necessary to ensure two digits for minutes and seconds
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};
