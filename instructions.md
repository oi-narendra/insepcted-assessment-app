# 🎥 Assistant Developer Challenge – Video Picker & Player

## 🧠 Objective

Build a simple React Native app using **Expo + TypeScript** that allows a user to:

1. Select a video from their device
2. View the video with playback controls
3. Display relevant video information
4. Submit a title and description, and store all data locally

---

## 🧩 App Requirements

### 📱 Core Features

- Built with **Expo + TypeScript**
- Use `expo-image-picker` to select a video file
- Use `expo-av` to play the selected video
- Use **nativewind** (TailwindCSS for React Native) for styling

---

### 🎯 Functional Requirements

#### 1. Video Selection

- Show a “Select Video” button on launch
- After selection, display the video using `expo-av`
- Show a “Change Video” button to reselect

#### 2. Video Metadata Display

- Show filename, duration (formatted as mm:ss), and file size (if available)

#### 3. Static Preview Frame

- Before playback starts, show a static thumbnail or placeholder

#### 4. Persistent State

- Use **AsyncStorage** to persist the selected video URI
- Reload the previously selected video on app launch

#### 5. Title & Description Submission

- Show input fields for title and description after video selection
- On “Submit,” save `{ videoURI, title, description }` to AsyncStorage

#### 6. Permissions Handling

- If media permissions are denied, show a custom screen explaining how to enable them in settings

#### 7. File Size Limit

- Reject videos over **50MB**
- Show a clean, user-friendly error message if limit is exceeded

---

## 📄 Additional Requirements

### 8. Documentation

Include a `NOTES.md` or inline comments that explain:

- App structure and rationale
- Any assumptions made
- What you'd improve or expand on with more time

### 9. Unit Test

- Write a small utility function (e.g., convert seconds to mm:ss)
- Add a unit test using **Jest** or similar test runner

---

## 📦 Submission Instructions

- Submit your code via a **GitHub repository**
- Include a `README.md` with:
  - A short description of the app
  - Setup instructions (`npm install && npx expo start`)
  - How long you spent on the challenge
