import { browser } from '$app/environment';
import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import {
	PUBLIC_FIREBASE_API_KEY,
	PUBLIC_FIREBASE_AUTH_DOMAIN,
	PUBLIC_FIREBASE_PROJECT_ID
} from '$env/static/public';

const firebaseConfig = {
	apiKey: PUBLIC_FIREBASE_API_KEY,
	authDomain: PUBLIC_FIREBASE_AUTH_DOMAIN,
	projectId: PUBLIC_FIREBASE_PROJECT_ID
};

let app: FirebaseApp;
let auth: Auth;

if (browser) {
	app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
	auth = getAuth(app);
}

export { app, auth };
