Phase 1: The Backend Foundation (Laravel)
Goal: A working API that serves JSON data from SQLite.

Task 1.1: Project Initialization

Prompt: "Initialize a new Laravel 11 project named tinysteps-backend. Configure it to use SQLite. Remove default migrations (create_users...) and create a fresh database/database.sqlite file. Serve the app and verify the default welcome page loads at localhost:8000."

Verification: Visit http://127.0.0.1:8000. You should see the Laravel landing page.

Task 1.2: Authentication API

Prompt: "Install Laravel Sanctum for API token authentication. Create a User model and migration with name, email, password. Create an AuthController with a register method and a login method that returns a plain text token. Set up the api/register and api/login routes."

Verification: Use Postman/Curl to POST to /api/register and receive a token back.

Task 1.3: Baby Resource (The "Netflix" Data)

Prompt: "Create a Baby model and migration. Fields: id, user_id (FK), name, gender (string), birth_date (date), theme_color (string: hex code), avatar_url (nullable string). Create a BabyController with index (list all babies for auth user) and store methods. Protect routes with Sanctum."

Verification: Create a baby via API. Check the database.sqlite file (using a DB viewer) to see the row exists.

Task 1.4: Growth Data Points

Prompt: "Create a GrowthRecord model and migration. Fields: id, baby_id (FK), weight (decimal 5,2), height (decimal 5,2), recorded_at (date). Create a Controller with store and index methods (index should filter by baby_id)."

Verification: POST a weight record for a specific baby ID.

Phase 2: Frontend Skeleton (React Native)
Goal: A compile-able mobile app with navigation installed.

Task 2.1: Expo Setup

Prompt: "Initialize a new Expo app using TypeScript named TinyStepsMobile. Use the default blank template. Verify it runs on the Android Emulator."

Verification: App opens on emulator displaying "Open up App.tsx...".

Task 2.2: Styling Engine (NativeWind)

Prompt: "Install and configure NativeWind (Tailwind CSS) for Expo SDK 50+. Create a tailwind.config.js including the app, components, and features directories. Add a simple <Text className='text-red-500 text-3xl'>Test</Text> to App.tsx to verify configuration."

Verification: Text is red and large.

Task 2.3: Navigation Structure

Prompt: "Install React Navigation (Native Stack). Create a navigation folder. Create AuthNavigator (Login, Register) and AppNavigator (Dashboard). In App.tsx, render a placeholder text for now to ensure libraries are installed correctly."

Verification: No crashes on load.

Phase 3: Connecting & Auth
Goal: User can log in and store their session.

Task 3.1: API Service Layer

Prompt: "Create services/api.ts. Setup an Axios instance with a baseURL pointing to the Laravel backend (use 10.0.2.2 for Android emulator loopback). Add an interceptor to inject the Bearer token from AsyncStorage if it exists."

Verification: No visual change, but code file exists and compiles.

Task 3.2: Auth Context & Login Screen

Prompt: "Create context/AuthContext.tsx to manage user state and tokens. Then, build a simple features/auth/LoginScreen.tsx with Email/Password inputs styled with NativeWind. Connect the login button to the API. On success, save token and switch state to 'Authenticated'."

Verification: Login with the user created in Task 1.2. App should transition to the next screen (or placeholder).

Phase 4: The "Netflix" Feature (Profile Selector)
Goal: The impressive UI hook for the teacher.

Task 4.1: Profile Service & Context

Prompt: "Create context/BabyContext.tsx to store the currentBaby object. Add a function to fetch babies from api/babies."

Verification: Context wraps the app in App.tsx.

Task 4.2: Profile Selector UI (Static)

Prompt: "Create features/profiles/ProfileSelectorScreen.tsx. Build a UI with a dark background and a horizontal list of circular avatars. Use dummy data for now. Style it to look like the Netflix 'Who's watching?' screen."

Verification: Screen renders with static circles.

Task 4.3: Profile Logic Connection

Prompt: "Connect ProfileSelectorScreen to the API. Fetch the real babies. When a user taps a baby, set it in BabyContext and navigate to the Dashboard."

Verification: Login -> See your babies -> Tap one -> Go to Dashboard placeholder.

Phase 5: The Dashboard & Features
Goal: Displaying data and growth.

Task 5.1: Dashboard Layout

Prompt: "Create features/dashboard/DashboardScreen.tsx. Display the baby's name from Context. Create a utility function calculateAge(birthDate) and display the precise age (e.g., '3 months, 2 days') prominently."

Verification: Dashboard shows "Hello [Name], you are X months old."

Task 5.2: Growth Chart UI

Prompt: "Install react-native-gifted-charts. In features/growth/GrowthScreen.tsx, create a line chart component. Fetch data from api/babies/{id}/growth. Map the data to the chart format."

Verification: A chart renders (even if empty initially).

Task 5.3: Add Record Modal

Prompt: "Create a floating action button on the Dashboard. When clicked, open a modal to input 'Weight' and 'Date'. Submit this to the API and refresh the local data."

Verification: Add weight -> Dashboard updates -> Chart updates.

Phase 6: Final Polish
Goal: Making it look "Senior Level".

Task 6.1: The Animations

Prompt: "Using react-native-reanimated, add a scaling entry animation to the avatars in ProfileSelectorScreen. Add a fade-in effect to the Dashboard cards."

Verification: Smooth transitions when opening the app