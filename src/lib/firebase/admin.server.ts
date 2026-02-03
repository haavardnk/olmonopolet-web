import { initializeApp, getApps, cert, type App } from 'firebase-admin/app';
import { getAuth, type Auth } from 'firebase-admin/auth';
import {
	FIREBASE_PROJECT_ID,
	FIREBASE_CLIENT_EMAIL,
	FIREBASE_PRIVATE_KEY
} from '$env/static/private';

let app: App;
let adminAuth: Auth;

const projectId = FIREBASE_PROJECT_ID;
const clientEmail = FIREBASE_CLIENT_EMAIL;
const privateKey = FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

if (projectId && clientEmail && privateKey) {
	if (getApps().length === 0) {
		app = initializeApp({
			credential: cert({
				projectId,
				clientEmail,
				privateKey
			})
		});
	} else {
		app = getApps()[0];
	}

	adminAuth = getAuth(app);
}

export { adminAuth };

export async function verifyIdToken(idToken: string) {
	try {
		const decodedToken = await adminAuth.verifyIdToken(idToken);
		return decodedToken;
	} catch {
		return null;
	}
}

export async function createSessionCookie(
	idToken: string,
	expiresIn: number = 60 * 60 * 24 * 5 * 1000
) {
	try {
		const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });
		return sessionCookie;
	} catch {
		return null;
	}
}

export async function verifySessionCookie(sessionCookie: string) {
	try {
		const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true);
		return decodedClaims;
	} catch {
		return null;
	}
}
