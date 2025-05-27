# 🌱 HabiLoop – Build Good Habits, Break Bad Ones!

**HabiLoop** is a beautifully designed and practical mobile app built with *React Native*, focused on helping users build positive habits,stay away from negetive habits and stay consistent with daily and weekly routines. It’s fast, simple, and works offline — no Firebase, just local storage.

---

## 🚀 Features

### ✅ Core Features

- **User Authentication**
  - Register, Login, and Logout functionality
  - Simple local session management with AsyncStorage

- **Habit Management**
  - Add new habits with:
    - Habit name
    - Description
    - Habit ID (auto-generated)
    - Habit behavior (Good / Bad)
    - Repeat type: Daily or Weekly  
    - Select days for weekly habits  
    - Time of day: Morning, Afternoon, Evening, Night
  - Edit existing habits
  - Delete habits anytime
  - Mark habits as done manually

- **Habit Tracking**
  - Filter habits by daily or weekly
  - Sort habit list by time of day (morning to night)
  - Track completion per habit
  - View upcoming and completed habits by day/week

- **Progress Overview**
  - View daily and weekly progress
  - See how much you’ve completed each day
  - Color-coded progress indicators for completion percentage

- **Calendar View**
  - Visualize habit streaks
  - Identify completion levels with color coding
  - Navigate through a 7-day view of past and upcoming habits

---

### 🌟 Bonus Features

- **Animations**
  - Smooth animations for:
    - Adding habits
    - Completing habits
    - Transitions between views

- **Dark & Light Mode**
  - Theme toggling based on user preference

- **User Profile**
  - View profile details
  - Theme and session preferences stored locally

---

## 🛠 Tech Stack

| Tool             | Purpose                          |
|------------------|----------------------------------|
| React Native     | Mobile app development           |
| TypeScript       | Static type checking             |
| AsyncStorage     | Local data storage               |
| Zustand          | State management                 |
| React Navigation | Navigation (stack + tabs)        |
| Custom Hooks     | Business logic separation        |

---

## 📂 Project Structure

```bash
/habiLoop
├── /assets              # Icons, animations, images
├── /components          # Reusable UI elements (e.g., HabitCard, ProgressBar)
├── /screens             # App screens (Login, Home, Profile, etc.)
├── /hooks               # Custom hooks (e.g., useHabits, useAuth)
├── /store               # Zustand stores for state
├── /navigation          # Stack & tab navigators
├── /styles              # Theme and style  
├── /types               # TypeScript types (e.g., HabitType)
├── /Themes
└── App.tsx              # Entry point of the app


-**📲 Installation & Setup**

📦 Prerequisites
Node.js & npm/yarn

Android Studio (for Android)

Xcode (for iOS on macOS)

React Native CLI

 Setup Instructions

bash
Copy code
# 1. Clone the repo
git clone https://github.com/your-username/habiLoop.git
cd habiLoop

# 2. Install dependencies
npm install

# 3. iOS only - install pods
cd ios
pod install
cd ..

# 4. Run the app
npx react-native run-android   # For Android
npx react-native run-ios       # For iOS (macOS only)

-**💡 Feel free to contribute or fork this project to customize your own version of HabiLoop!**

vbnet
Copy code

Let me know if you'd like help with badges, screenshots, a license section, or cont

Demo video: