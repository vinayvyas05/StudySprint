<div align="center">
  <img src="https://img.icons8.com/color/96/000000/hourglass.png" alt="StudySprint Logo" width="80"/>
  <h1>StudySprint</h1>
  <p><strong>Gamified Productivity & Social Focus Engine</strong></p>

  <p>
    <img src="https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React Native" />
    <img src="https://img.shields.io/badge/Expo-1B1F23?style=for-the-badge&logo=expo&logoColor=white" alt="Expo" />
    <img src="https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=white" alt="Firebase" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  </p>
</div>

<br />

StudySprint is a high-performance, cross-platform productivity application designed to cure modern distraction. It combines rigorous time-blocking techniques with a deep **RPG Progression Engine** and **Real-Time Multiplayer Battles** to make deep work highly addictive. 

Built with React Native, Expo, and Firebase, featuring a premium glassmorphic "Deep Galaxy" monochrome aesthetic.

## ✨ Core Features

### ⏱️ Dual-Core Productivity Timer
- **Pomodoro Sprint Mode:** A strict 4-cycle focus system featuring short breaks and an automatically scheduled long break. Built using custom `react-native-reanimated` SVG circular timers for 60fps native performance.
- **Open-Ended Focus Mode:** For unstructured deep work sessions that run indefinitely until paused.

### ⚔️ Live Multiplayer Focus Battles
- Search for friends and send asynchronous **Focus Challenges** (e.g., "First to 120 minutes").
- The backend automatically tracks concurrent study sessions and syncs progress to both users in real-time.
- Victors receive massive XP bonuses and rank up their "Competitiveness" attribute.

### 🛡️ RPG Progression & Stats Engine
- **Dynamic Leveling:** Focus minutes are instantly converted into XP. Level up through dynamically calculated thresholds (e.g., Novice, Scholar, Master).
- **Attribute Matrix:** Tracks distinct productivity styles mapping to Endurance (max session length), Consistency (streaks), Competitiveness (battles won), and Volume (total time).
- **Anti-Cheat Streak System:** Integrates directly with secure, external time APIs (`worldtimeapi.org`) to prevent users from spoofing their device's local clock to maintain streaks.

### 🏛️ Community Focus Halls
- Join or create global study groups.
- Firestore listeners stream live presence data to show exactly how many members are actively "focusing now" across the globe.

## 🏗️ Architecture & Tech Stack

StudySprint is built for scalability and maintainability, adhering to strict separation of concerns:

- **Frontend Framework:** React Native / Expo (File-based routing with Expo Router)
- **Styling:** NativeWind (Tailwind CSS v4) for utility-first, responsive, and consistent design.
- **State Management:** Zustand for lightweight, boilerplate-free global client state (Auth, UI preferences).
- **Database / Backend:** Firebase Firestore (NoSQL) heavily utilizing `onSnapshot` for reactive UI updates and `increment()` for atomic transactions.
- **Animations:** `react-native-reanimated` for smooth, non-blocking UI interactions (celebration modals, timer progress, screen transitions).

### Folder Structure
```text
src/
├── components/   # Reusable UI components segmented by feature (battles, community, sprint)
├── config/       # Firebase initialization and core config
├── hooks/        # Complex business logic isolated into custom React hooks
├── services/     # Pure Firebase data layer (CRUD, real-time listeners)
├── store/        # Zustand state stores
├── types/        # Strict TypeScript interfaces for all database payloads
└── utils/        # Pure functions for XP math, date manipulation, etc.
app/              # Expo Router file-based navigation (protected/auth routes)
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- Expo CLI
- A Firebase Project (Firestore enabled)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/studysprint.git
   cd studysprint
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Firebase**
   Create a `.env` file in the root directory and add your Firebase credentials:
   ```env
   EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
   EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
   EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
   EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

4. **Run the app**
   ```bash
   npx expo start
   ```

## 🔐 Security & Data Integrity

- **Strict Payload Typing:** All Firestore mutation layers are strictly guarded by mapped TypeScript interfaces (e.g., `Partial<UserProfile> & Record<string, any>` replaced by secure `FieldValue` mapped types).
- **Atomic Operations:** Critical operations like XP gains and Battle Progress utilize Firestore's atomic `increment()` arrays to prevent race conditions during concurrent user sessions.
- **Server-Side Timestamp Validation:** Eliminates client-side spoofing for daily streaks and time logs.

---
*Designed and engineered with a focus on production-ready code quality, scalable architecture, and premium user experience.*
