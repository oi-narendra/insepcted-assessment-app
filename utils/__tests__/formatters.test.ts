import { formatDuration } from '../formatters';

describe('formatDuration', () => {
  it('should format seconds into mm:ss', () => {
    expect(formatDuration(0)).toBe('00:00');
    expect(formatDuration(5)).toBe('00:05');
    expect(formatDuration(60)).toBe('01:00');
    expect(formatDuration(65)).toBe('01:05');
    expect(formatDuration(3599)).toBe('59:59'); // 59 minutes 59 seconds
    expect(formatDuration(3600)).toBe('60:00'); // 60 minutes
  });

  it('should return "Unknown duration" for undefined input', () => {
    expect(formatDuration(undefined)).toBe('Unknown duration');
  });

  it('should handle larger numbers of seconds correctly', () => {
    expect(formatDuration(3661)).toBe('61:01'); // 61 minutes 1 second
    expect(formatDuration(7200)).toBe('120:00'); // 120 minutes
  });
}); 