# Notes

## App Structure and Rationale

The application is structured to separate concerns:

- **`App.tsx`**: Entry point of the application.
- **`src/`**: Contains the core application logic.
  - **`video/index.tsx`**: Main page for video display and selection orchestration.
  - **`components/`**: Reusable UI components.
    - **`video/VideoPicker.tsx`**: Handles video selection, permission, file size checks, and metadata input.
    - **`video/VideoDetails.tsx`**: Displays video metadata and change video option.
    - **`video/VideoProgressBar.tsx`**: (If implemented for custom controls)
  - **`hooks/`**: Reusable logic hooks.
    - **`usePersistedVideo.ts`**: Manages video state, persistence to AsyncStorage, and video player instance.
  - **`utils/`**: Utility functions like formatters.
  - **`constants/`**: Application-wide constants (e.g., storage keys, error messages, limits).
  - **`types/`**: TypeScript type definitions.
- **`assets/`**: Static assets like images.

This structure promotes modularity and maintainability.

## Assumptions Made

- The user expects a simple, straightforward interface.
- Native video controls provided by `expo-video` are sufficient for playback.
- The 50MB file size limit is a hard limit.
- Dark theme is preferred.

## Potential Improvements and Expansions (with more time)

- Custom video playback controls instead of native ones.
- More robust error handling and user feedback.
- Thumbnail generation for selected videos instead of a static placeholder.
