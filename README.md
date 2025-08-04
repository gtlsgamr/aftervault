# AfterVault

AfterVault is a secure vault for storing important information that will be shared with your trusted contacts if something happens to you.

## Features

- User authentication with Firebase
- Onboarding flow
- Secure storage of sensitive information
- Automatic release of information to trusted contacts

## Firebase Setup

This app uses Firebase for authentication. Follow these steps to set up Firebase:

1. Create a Firebase project at [https://console.firebase.google.com/](https://console.firebase.google.com/)
2. Add an Android app and an iOS app to your Firebase project
3. Install the required Firebase packages:

```bash
# Core Firebase packages
npm install @react-native-firebase/app @react-native-firebase/auth

# Google Sign-In
npm install @react-native-google-signin/google-signin

# Apple Sign-In (iOS only)
npm install @invertase/react-native-apple-authentication

# or using yarn
yarn add @react-native-firebase/app @react-native-firebase/auth
yarn add @react-native-google-signin/google-signin
yarn add @invertase/react-native-apple-authentication
```

4. Configure Firebase for Android:
   - Download the `google-services.json` file from the Firebase console
   - Place it in the `android/app` directory
   - Enable Google Sign-In in the Firebase console (Authentication > Sign-in method)
   - Configure your app for Google Sign-In:
     - In the Firebase console, go to Project settings > Your apps > Android app
     - Add your SHA-1 and SHA-256 fingerprints (required for Google Sign-In)

5. Configure Firebase for iOS:
   - Download the `GoogleService-Info.plist` file from the Firebase console
   - Place it in the `ios/AfterVault` directory
   - Open your iOS project in Xcode and add the file to your project
   - Enable Google Sign-In in the Firebase console (Authentication > Sign-in method)
   - Enable Apple Sign-In in the Firebase console (Authentication > Sign-in method)
   - Configure your app for Apple Sign-In:
     - In Xcode, go to your project settings > Signing & Capabilities
     - Add the "Sign in with Apple" capability
     - Update your `Info.plist` to include the required entries for Google Sign-In

6. Configure Phone Authentication:
   - Enable Phone authentication in the Firebase console (Authentication > Sign-in method)
   - For Android, add your app's SHA-1 fingerprint to the Firebase project
   - For iOS, enable push notifications in your app capabilities

7. Update the Firebase service implementation:
   - Replace the simulated Firebase service in `src/services/firebase.ts` with the actual Firebase implementation (commented code at the bottom of the file)

## Project Structure

- `src/components`: Reusable UI components
- `src/context`: Context providers (e.g., AuthContext)
- `src/screens`: App screens organized by feature
- `src/services`: Service implementations (e.g., Firebase)
- `src/theme`: App theme configuration

## Authentication Flow

1. Onboarding screens introduce the app to new users
2. Login/Signup screen allows users to authenticate
3. After successful authentication, users are taken to the home screen
4. Users can sign out from the home screen

# Getting Started

> **Note**: Make sure you have completed the [Set Up Your Environment](https://reactnative.dev/docs/set-up-your-environment) guide before proceeding.

## Step 1: Start Metro

First, you will need to run **Metro**, the JavaScript build tool for React Native.

To start the Metro dev server, run the following command from the root of your React Native project:

```sh
# Using npm
npm start

# OR using Yarn
yarn start
```

## Step 2: Build and run your app

With Metro running, open a new terminal window/pane from the root of your React Native project, and use one of the following commands to build and run your Android or iOS app:

### Android

```sh
# Using npm
npm run android

# OR using Yarn
yarn android
```

### iOS

For iOS, remember to install CocoaPods dependencies (this only needs to be run on first clone or after updating native deps).

The first time you create a new project, run the Ruby bundler to install CocoaPods itself:

```sh
bundle install
```

Then, and every time you update your native dependencies, run:

```sh
bundle exec pod install
```

For more information, please visit [CocoaPods Getting Started guide](https://guides.cocoapods.org/using/getting-started.html).

```sh
# Using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up correctly, you should see your new app running in the Android Emulator, iOS Simulator, or your connected device.

This is one way to run your app — you can also build it directly from Android Studio or Xcode.

## Step 3: Modify your app

Now that you have successfully run the app, let's make changes!

Open `App.tsx` in your text editor of choice and make some changes. When you save, your app will automatically update and reflect these changes — this is powered by [Fast Refresh](https://reactnative.dev/docs/fast-refresh).

When you want to forcefully reload, for example to reset the state of your app, you can perform a full reload:

- **Android**: Press the <kbd>R</kbd> key twice or select **"Reload"** from the **Dev Menu**, accessed via <kbd>Ctrl</kbd> + <kbd>M</kbd> (Windows/Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (macOS).
- **iOS**: Press <kbd>R</kbd> in iOS Simulator.

## Congratulations! :tada:

You've successfully run and modified your React Native App. :partying_face:

### Now what?

- If you want to add this new React Native code to an existing application, check out the [Integration guide](https://reactnative.dev/docs/integration-with-existing-apps).
- If you're curious to learn more about React Native, check out the [docs](https://reactnative.dev/docs/getting-started).

# Troubleshooting

If you're having issues getting the above steps to work, see the [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.

# Learn More

To learn more about React Native, take a look at the following resources:

- [React Native Website](https://reactnative.dev) - learn more about React Native.
- [Getting Started](https://reactnative.dev/docs/environment-setup) - an **overview** of React Native and how setup your environment.
- [Learn the Basics](https://reactnative.dev/docs/getting-started) - a **guided tour** of the React Native **basics**.
- [Blog](https://reactnative.dev/blog) - read the latest official React Native **Blog** posts.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - the Open Source; GitHub **repository** for React Native.
