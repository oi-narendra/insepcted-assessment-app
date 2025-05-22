# Video Picker & Player App

This is a simple React Native app built with Expo and TypeScript that allows users to select a video from their device, view it with playback controls, display relevant video information, and submit a title and description. All data is stored locally using AsyncStorage.

## Setup Instructions

To run the app locally, follow these steps:

1.  **Clone the repository:**

    ```bash
    git clone <repository-url>
    cd <repository-name>
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Start the Expo development server:**

    ```bash
    npx expo start
    ```

    OR

    ```bash
    npm start
    ```

    This will open the Expo DevTools in your browser. You can then run the app on an Android emulator/device, iOS simulator/device, or in the web browser.

## Time Spent

Approximately 9 hours, broken down as follows:

- Project Setup & Initial Configuration (Expo, TypeScript, NativeWind): ~1 hour
- Video Selection & Permissions (`expo-image-picker`): ~1.5 hours
- Video Playback & Controls (`expo-av`): ~1.5 hours
- Displaying Video Metadata (Filename, Duration, Size): ~0.75 hours (45 mins)
- Persistent State with AsyncStorage (Video URI, Title, Description): ~1.25 hours
- Title & Description Input Fields and Submission Logic: ~0.75 hours (45 mins)
- Implementing File Size Limit & Error Handling: ~0.5 hours (30 mins)
- Writing Unit Test for Utility Function (e.g., time formatting): ~0.75 hours (45 mins)
- Documentation (Inline comments, `NOTES.md`, `README.md`): ~1 hour
