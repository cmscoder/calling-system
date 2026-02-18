# TicketPRO - Customer Support System

TicketPRO is a web-based application designed to streamline customer support ticket management. It allows support agents to register, log in, and manage support tickets for various clients. The system provides a clear dashboard to view ticket status, create new tickets, and update existing ones, all powered by a real-time backend.

## ✨ Features

- **User Authentication:** Secure sign-up, sign-in, and logout functionality using Firebase Authentication.
- **Dashboard:** A central hub to view all support tickets, sorted by creation date, with pagination to handle large volumes of data.
- **Ticket Management:**
  - Create new support tickets with details like client, topic, status, and a description.
  - Edit existing tickets to update their status or information.
  - View detailed information about a specific ticket in a modal window.
- **Customer Management:** A dedicated section to manage client information (feature suggested by the navigation links).
- **Profile Page:** Users can update their profile information, including their name and avatar image.
- **Real-time Backend:** Utilizes Firebase for a seamless, real-time data synchronization experience.
- **User-Friendly Interface:** Clean and responsive UI with toast notifications for immediate user feedback on actions.

## 🚀 Technologies Used

This project is a single-page application built with a modern JavaScript stack:

- **Frontend:**
  - [React.js](https://reactjs.org/) (v18)
  - [React Router](https://reactrouter.com/) (v6) for client-side routing.
  - [React Context API](https://reactjs.org/docs/context.html) for state management.
- **Backend (BaaS):**
  - [Firebase](https://firebase.google.com/)
    - **Authentication:** For user sign-up and sign-in.
    - **Firestore:** As the NoSQL database for storing tickets, users, and customer data.
    - **Storage:** For hosting user profile images.
- **Styling:**
  - Plain CSS with a modular approach per component/page.
- **UI/UX:**
  - [React Toastify](https://fkhadra.github.io/react-toastify/) for user notifications.
  - [React Icons](https://react-icons.github.io/react-icons/) for iconography.
- **Utilities:**
  - [date-fns](https://date-fns.org/) for easy and consistent date formatting.

## 🔧 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

You need to have [Node.js](https://nodejs.org/) (version 14 or newer) and a package manager like [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/) installed.

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/calling-system.git
    cd calling-system
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

    or

    ```bash
    yarn install
    ```

3.  **Set up Firebase:**
    - Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project.
    - In your project's dashboard, create a new **Web App**.
    - Copy the Firebase configuration object provided.
    - Create a new file `firebaseConnection.js` inside the `src/services/` directory.
    - Paste your Firebase configuration into this file. It should look like this:

    ```javascript
    // src/services/firebaseConnection.js
    import { initializeApp } from "firebase/app";
    import { getFirestore } from "firebase/firestore";
    import { getAuth } from "firebase/auth";
    import { getStorage } from "firebase/storage";

    const firebaseConfig = {
      apiKey: "YOUR_API_KEY",
      authDomain: "YOUR_AUTH_DOMAIN",
      projectId: "YOUR_PROJECT_ID",
      storageBucket: "YOUR_STORAGE_BUCKET",
      messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
      appId: "YOUR_APP_ID",
    };

    const firebaseApp = initializeApp(firebaseConfig);

    const db = getFirestore(firebaseApp);
    const auth = getAuth(firebaseApp);
    const storage = getStorage(firebaseApp);

    export { db, auth, storage };
    ```

    - In the Firebase console, navigate to the **Build** section:
      - Enable **Authentication** and add the "Email/Password" sign-in provider.
      - Enable **Firestore Database** and create a database in test mode to start.
      - Enable **Storage**.

4.  **Run the application:**
    ```bash
    npm start
    ```
    This will run the app in development mode. Open http://localhost:3000 to view it in your browser.

## 📂 Project Structure

The project follows a standard Create React App structure with some logical separation for clarity:

```
src
├── assets/         # Images and other static assets
├── components/     # Reusable components (Header, Title, Modal)
├── contexts/       # React Context providers (e.g., AuthContext)
├── pages/          # Main pages of the application (Dashboard, Profile, etc.)
├── routes/         # Route definitions and private route logic
└── services/       # Firebase connection and other external services
```

---

This project was created as a learning exercise and can be extended with more features. Feel free to fork and improve it!
