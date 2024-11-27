# Form Builder App

This is a **Form Builder** app that allows users to create and manage forms with ease. The app integrates with **Firebase** for authentication, file storage, and real-time updates, and it uses **GROQ API** for querying form data.

## Features

- **Form Creation**: Easily create forms with different input types (text, number, date, etc.).
- **User Authentication**: Users can sign up, log in, and manage their accounts using Firebase Authentication.
- **Real-time Data**: Forms and responses are stored in Firebase Firestore and can be accessed in real-time.
- **File Uploading**: Users can upload files to Firebase Storage through the form builder.
- **Form Submission**: Allows users to submit responses to the forms created, with real-time data synchronization.
- **Export to Excel**: Export form responses to Excel files using SheetJS.

## Technologies Used

- **Next.js**: React-based framework for building the application.
- **Firebase**: Used for Authentication, Firestore (database), and Firebase Storage (file uploads).
- **GROQ**: Query language for interacting with form data.
- **SheetJS**: For exporting form data to Excel files.

## Installation

Follow these steps to get the app up and running locally:

### 1. Clone the repository

First, clone the repository to your local machine:

```bash
git clone https://github.com/your-username/form-builder-app.git
cd form-builder-app
```

### 2.Install dependencies

Run the following command to install all necessary dependencies:

```
npm install
```

### 3.Set up environment variables

Create a .env.local file in the root directory of the project and add the following environment variables:

```
NEXT_PUBLIC_FIREBASE_API_KEY="your-api-key"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-auth-domain"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-storage-bucket"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="your-messaging-sender-id"
NEXT_PUBLIC_FIREBASE_APP_ID="your-app-id"
NODE_ENV="development"
NEXT_PUBLIC_GROQ_API_KEY="your-groq-api-key"

```

### 4.Run the app locally

After configuring the environment variables, you can run the app locally:
```
npm run dev

```
The app will be available at http://localhost:3000/signin.

## Firebase Setup

This app requires a Firebase project for authentication, Firestore, and storage. If you haven't already set up Firebase, follow these steps:

- Go to the Firebase Console.
- Create a new project and configure Firebase Authentication, Firestore, and Firebase Storage.
- Add the Firebase credentials to the .env.local file as shown above.

### Firebase Authentication
- Enable Email/Password Authentication or any other method you prefer in the Firebase Console.

### Firestore
- Create a Firestore database in your Firebase project to store form data and user responses.

## Contibuting
If you'd like to contribute to the project, feel free to fork the repository, create a new branch, and submit a pull request with your changes.

Here are some ways you can help:

- Improve the UI/UX.
- Add new form input types.
- Fix bugs or enhance features.
- Improve documentation.

## License
This project is licensed under the MIT License - see the [LICENSE.md](./LICENSE.md) file for details.