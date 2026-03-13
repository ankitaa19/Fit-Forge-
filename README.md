# FitForge

A full-stack fitness tracking app built with **Flutter** (frontend) and **Node.js / Express / MongoDB** (backend). FitForge helps users set fitness goals, follow structured workout plans, track progress, and receive workout reminders via email.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Flutter (Dart) |
| Backend | Node.js, Express.js |
| Database | MongoDB (Mongoose) |
| Auth | JWT (JSON Web Tokens) |
| Email | Nodemailer (Gmail SMTP) |
| Scheduling | node-cron |

---

## App Workflow

### 1. Sign Up
- User opens the app and taps **Sign up**
- Enters name, email, and password
- Account created and stored in MongoDB (`User` collection)
- Redirected to the **Onboarding** flow

### 2. Onboarding
- **Step 1 — Fitness Goal**: User picks from Weight Loss, Muscle Gain, General Fitness, Core Strength, Endurance, or Flexibility & Mobility
- **Step 2 — Fitness Level**: Beginner / Intermediate / Advanced
- **Step 3 — Schedule**: Days per week and minutes per session
- Preferences saved to `UserProgress` collection
- Redirected to the **Dashboard**

### 3. Login
- Returning user enters email and password
- Backend verifies credentials and returns a JWT token
- Token stored in `SharedPreferences` on device for session persistence

### 4. Forgot Password (OTP Flow)
- User taps **Forgot password?** on the login screen
- **Step 1**: Enters registered email → backend generates a 6-digit OTP (5-min expiry, max 3 requests per 10 min), saves it to the `Otp` collection, and emails it via Gmail SMTP
- **Step 2**: Enters OTP + new password → backend validates OTP (single-use, not expired), updates password, marks OTP as used
- Success modal appears → user signs in with new password

### 5. Dashboard
- Personalised greeting and a summary card for the user's active fitness goal
- Weekly progress rings (workouts completed, calories, minutes)
- Quick-access buttons to Exercises, My Workouts, Progress, and BMI Calculator

### 6. Exercises
- Exercises fetched from the backend based on the user's fitness goal
- Each exercise card shows: title, muscle group, difficulty, calories burned, and an embedded video
- User can **favourite** exercises (saved to their profile)
- Exercises grouped by category tabs for easy browsing

### 7. My Workouts
- Users create **custom workouts** by selecting exercises from the library and naming the workout
- Saved workouts stored in the backend under the user's profile
- Users can delete individual exercises from a workout or delete the entire workout
- Success / error feedback via modal dialogs (consistent app-wide style)

### 8. Progress Tracking
- Users log completed workouts
- Progress recorded per goal category (e.g. weight loss reps, core strength sets)
- Weekly and monthly summaries available on the Dashboard

### 9. BMI Calculator
- User enters weight (kg) and height (cm)
- App calculates BMI and displays the result with a category label (Underweight / Normal / Overweight / Obese) and colour indicator

### 10. Settings
- Edit profile name
- Change fitness goal — updates `UserProgress` in the backend; confirmed with a "Settings Saved" modal
- Change workout schedule (days per week, minutes per session)
- **Workout Reminders toggle**:
  - Turning ON opens a modal to pick days of the week, time, and workout label
  - Saves reminders to the backend (`Reminder` collection)
  - Tapping the row when ON shows all active reminders with day/time; each can be deleted
  - Backend scheduler (node-cron) checks every minute and sends reminder emails at the scheduled time

### 11. Email Notifications
- **OTP emails** — sent during the forgot-password flow (HTML template with OTP code and 5-min expiry warning)
- **Workout reminder emails** — sent automatically by the backend scheduler at the user's chosen day and time
- Both sent FROM `fitforge.noreply@gmail.com` TO the user's registered email address

---

## Project Structure

```
fit_forge/
├── backend/
│   ├── server.js                  # Express app entry point
│   ├── .env                       # Environment variables
│   ├── middleware/
│   │   └── auth.js                # JWT authentication middleware
│   ├── models/
│   │   ├── User.js
│   │   ├── UserProgress.js
│   │   ├── Reminder.js
│   │   ├── Otp.js
│   │   ├── DietPlan.js
│   │   └── [goal-specific models]
│   ├── routes/
│   │   ├── auth.js                # Login, signup, forgot/reset password
│   │   ├── progress.js            # Settings, progress tracking
│   │   ├── reminders.js           # CRUD for workout reminders
│   │   └── [goal-specific routes]
│   └── services/
│       ├── emailService.js        # Gmail SMTP — OTP + reminder emails
│       └── reminderScheduler.js   # node-cron job — fires reminder emails
│
└── frontend/
    └── lib/
        ├── main.dart
        ├── pages/
        │   ├── login_page.dart
        │   ├── signup_page.dart
        │   ├── onboarding_page.dart
        │   ├── dashboard_page.dart
        │   ├── exercises_page.dart
        │   ├── my_workouts_page.dart
        │   ├── settings_page.dart
        │   ├── progress_page.dart
        │   └── bmi_calculator_page.dart
        ├── services/
        │   ├── auth_service.dart
        │   ├── progress_service.dart
        │   └── reminder_service.dart
        └── widgets/
            └── sidebar.dart
```

---

## Running Locally

### Backend

```bash
cd backend
npm install
node server.js
```


### Frontend

```bash
cd frontend
flutter pub get
flutter run
```
