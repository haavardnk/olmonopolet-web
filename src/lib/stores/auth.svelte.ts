import { browser } from '$app/environment';
import { invalidateAll } from '$app/navigation';
import {
	signInWithEmailAndPassword,
	createUserWithEmailAndPassword,
	sendPasswordResetEmail,
	sendEmailVerification,
	signOut as firebaseSignOut,
	onAuthStateChanged,
	GoogleAuthProvider,
	OAuthProvider,
	signInWithPopup,
	reauthenticateWithPopup,
	deleteUser,
	type User
} from 'firebase/auth';
import { auth } from '$lib/firebase/client';
import { listsStore } from '$lib/stores/lists.svelte';
import { tastedStore } from '$lib/stores/tasted.svelte';
import { fetchAndSetLists } from '$lib/utils/lists';

export interface AuthUser {
	uid: string;
	email: string | null;
	emailVerified: boolean;
	displayName: string | null;
	photoURL: string | null;
	providers: string[];
}

const AUTH_HINT_KEY = 'auth_hint';

function getAuthHint(): AuthUser | null {
	if (!browser) return null;
	try {
		const hint = localStorage.getItem(AUTH_HINT_KEY);
		return hint ? JSON.parse(hint) : null;
	} catch {
		return null;
	}
}

function setAuthHint(user: AuthUser | null) {
	if (!browser) return;
	try {
		if (user) {
			localStorage.setItem(AUTH_HINT_KEY, JSON.stringify(user));
		} else {
			localStorage.removeItem(AUTH_HINT_KEY);
		}
	} catch {}
}

function toAuthUser(firebaseUser: User): AuthUser {
	return {
		uid: firebaseUser.uid,
		email: firebaseUser.email,
		emailVerified: firebaseUser.emailVerified,
		displayName: firebaseUser.displayName,
		photoURL: firebaseUser.photoURL,
		providers: firebaseUser.providerData.map((p) => p.providerId)
	};
}

function createAuthStore() {
	const initialHint = getAuthHint();
	let user = $state<AuthUser | null>(initialHint);
	let loading = $state(!initialHint);
	let error = $state<string | null>(null);
	let syncedUid: string | null = null;

	async function syncSession(firebaseUser: User): Promise<void> {
		const newUser = toAuthUser(firebaseUser);
		user = newUser;
		setAuthHint(newUser);
		const idToken = await firebaseUser.getIdToken();
		await fetch('/api/auth/session', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ idToken })
		});
		syncedUid = firebaseUser.uid;
		fetchAndSetLists(true).catch((e) => console.error('Failed to load lists:', e));
	}

	if (browser && auth) {
		setTimeout(() => {
			onAuthStateChanged(auth, async (firebaseUser: User | null) => {
				if (firebaseUser) {
					if (syncedUid !== firebaseUser.uid) {
						try {
							await syncSession(firebaseUser);
						} catch (e) {
							console.error('Failed to sync session:', e);
						}
					} else {
						user = toAuthUser(firebaseUser);
						setAuthHint(user);
					}
				} else {
					const wasSignedIn = syncedUid !== null;
					user = null;
					setAuthHint(null);
					listsStore.clear();
					tastedStore.clear();
					syncedUid = null;
					if (wasSignedIn) await invalidateAll();
				}
				loading = false;
			});
		}, 0);
	} else {
		loading = false;
	}

	async function signIn(email: string, password: string) {
		if (!auth) throw new Error('Auth not initialized');

		loading = true;
		error = null;

		try {
			const result = await signInWithEmailAndPassword(auth, email, password);
			await syncSession(result.user);
			return result.user;
		} catch (e) {
			error = getErrorMessage(e);
			throw e;
		} finally {
			loading = false;
		}
	}

	async function signUp(email: string, password: string) {
		if (!auth) throw new Error('Auth not initialized');

		loading = true;
		error = null;

		try {
			const result = await createUserWithEmailAndPassword(auth, email, password);
			await sendEmailVerification(result.user);
			await syncSession(result.user);
			return result.user;
		} catch (e) {
			error = getErrorMessage(e);
			throw e;
		} finally {
			loading = false;
		}
	}

	async function resendVerificationEmail() {
		if (!auth?.currentUser) throw new Error('No user signed in');

		loading = true;
		error = null;

		try {
			await sendEmailVerification(auth.currentUser);
		} catch (e) {
			error = getErrorMessage(e);
			throw e;
		} finally {
			loading = false;
		}
	}

	async function reloadUser() {
		if (!auth?.currentUser) return;

		try {
			await auth.currentUser.reload();
			user = {
				uid: auth.currentUser.uid,
				email: auth.currentUser.email,
				emailVerified: auth.currentUser.emailVerified,
				displayName: auth.currentUser.displayName,
				photoURL: auth.currentUser.photoURL,
				providers: auth.currentUser.providerData.map((p) => p.providerId)
			};
		} catch (e) {
			console.error('Failed to reload user:', e);
		}
	}

	async function resetPassword(email: string) {
		if (!auth) throw new Error('Auth not initialized');

		loading = true;
		error = null;

		try {
			await sendPasswordResetEmail(auth, email);
		} catch (e) {
			error = getErrorMessage(e);
			throw e;
		} finally {
			loading = false;
		}
	}

	async function signOut() {
		if (!auth) throw new Error('Auth not initialized');

		try {
			await firebaseSignOut(auth);
			await fetch('/api/auth/logout', { method: 'POST' });
			user = null;
			listsStore.clear();
			tastedStore.clear();
		} catch (e) {
			error = getErrorMessage(e);
			throw e;
		}
	}

	async function getIdToken(): Promise<string | null> {
		if (!browser || !auth?.currentUser) return null;

		try {
			return await auth.currentUser.getIdToken();
		} catch {
			return null;
		}
	}

	function clearError() {
		error = null;
	}

	async function signInWithGoogle() {
		if (!auth) throw new Error('Auth not initialized');

		loading = true;
		error = null;

		try {
			const provider = new GoogleAuthProvider();
			const result = await signInWithPopup(auth, provider);
			await syncSession(result.user);
		} catch (e) {
			error = getErrorMessage(e);
			throw e;
		} finally {
			loading = false;
		}
	}

	async function signInWithApple() {
		if (!auth) throw new Error('Auth not initialized');

		loading = true;
		error = null;

		try {
			const provider = new OAuthProvider('apple.com');
			provider.addScope('email');
			provider.addScope('name');
			const result = await signInWithPopup(auth, provider);
			await syncSession(result.user);
		} catch (e) {
			error = getErrorMessage(e);
			throw e;
		} finally {
			loading = false;
		}
	}

	async function reauthWithGoogle() {
		if (!auth?.currentUser) throw new Error('No user signed in');
		const provider = new GoogleAuthProvider();
		await reauthenticateWithPopup(auth.currentUser, provider);
	}

	async function reauthWithApple() {
		if (!auth?.currentUser) throw new Error('No user signed in');
		const provider = new OAuthProvider('apple.com');
		await reauthenticateWithPopup(auth.currentUser, provider);
	}

	async function deleteAccount() {
		if (!auth?.currentUser) throw new Error('No user signed in');

		await deleteUser(auth.currentUser);
		await fetch('/api/auth/logout', { method: 'POST' });
		user = null;
		setAuthHint(null);
		listsStore.clear();
		tastedStore.clear();
	}

	return {
		get user() {
			return user;
		},
		get loading() {
			return loading;
		},
		get error() {
			return error;
		},
		get isAuthenticated() {
			return !!user;
		},
		get displayName(): string {
			return user?.displayName || user?.email?.split('@')[0] || '';
		},
		get photoURL(): string | null {
			return user?.photoURL ?? null;
		},
		get hasGoogleProvider(): boolean {
			return user?.providers.includes('google.com') ?? false;
		},
		get hasAppleProvider(): boolean {
			return user?.providers.includes('apple.com') ?? false;
		},
		get hasEmailProvider(): boolean {
			return user?.providers.includes('password') ?? false;
		},
		signIn,
		signUp,
		signInWithGoogle,
		signInWithApple,
		resetPassword,
		resendVerificationEmail,
		reloadUser,
		signOut,
		getIdToken,
		clearError,
		deleteAccount,
		reauthWithGoogle,
		reauthWithApple,
		setUser(newUser: AuthUser | null) {
			user = newUser;
			loading = false;
		}
	};
}

function getErrorMessage(e: unknown): string {
	if (e && typeof e === 'object' && 'code' in e) {
		const code = (e as { code: string }).code;
		switch (code) {
			case 'auth/invalid-email':
				return 'Ugyldig e-postadresse';
			case 'auth/user-disabled':
				return 'Denne brukeren er deaktivert';
			case 'auth/user-not-found':
				return 'Ingen bruker funnet med denne e-postadressen';
			case 'auth/wrong-password':
				return 'Feil passord';
			case 'auth/invalid-credential':
				return 'Ugyldig e-post eller passord';
			case 'auth/email-already-in-use':
				return 'E-postadressen er allerede i bruk';
			case 'auth/weak-password':
				return 'Passordet må være minst 6 tegn';
			case 'auth/too-many-requests':
				return 'For mange forsøk. Prøv igjen senere';
			case 'auth/popup-closed-by-user':
			case 'auth/cancelled-popup-request':
				return 'Innlogging ble avbrutt';
			case 'auth/account-exists-with-different-credential':
				return 'En konto eksisterer allerede med en annen innloggingsmetode';
			case 'auth/popup-blocked':
				return 'Popup ble blokkert av nettleseren. Tillat popups og prøv igjen';
			case 'auth/unauthorized-domain':
				return 'Dette domenet er ikke autorisert for innlogging';
			case 'auth/operation-not-allowed':
				return 'Denne innloggingsmetoden er ikke aktivert';
			case 'auth/internal-error':
				return 'En intern feil oppstod. Prøv igjen';
			default:
				return 'En feil oppstod. Prøv igjen';
		}
	}
	return 'En feil oppstod. Prøv igjen';
}

export const authStore = createAuthStore();
