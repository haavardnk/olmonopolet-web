import { browser } from '$app/environment';
import {
	signInWithEmailAndPassword,
	createUserWithEmailAndPassword,
	sendPasswordResetEmail,
	sendEmailVerification,
	signOut as firebaseSignOut,
	onAuthStateChanged,
	type User
} from 'firebase/auth';
import { auth } from '$lib/firebase/client';
import { listsStore } from '$lib/stores/lists.svelte';
import { tastedStore } from '$lib/stores/tasted.svelte';

export interface AuthUser {
	uid: string;
	email: string | null;
	emailVerified: boolean;
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

function createAuthStore() {
	const initialHint = getAuthHint();
	let user = $state<AuthUser | null>(initialHint);
	let loading = $state(!initialHint);
	let error = $state<string | null>(null);

	if (browser && auth) {
		setTimeout(() => {
			onAuthStateChanged(auth, async (firebaseUser: User | null) => {
				if (firebaseUser) {
					const newUser = {
						uid: firebaseUser.uid,
						email: firebaseUser.email,
						emailVerified: firebaseUser.emailVerified
					};
					user = newUser;
					setAuthHint(newUser);

					try {
						const idToken = await firebaseUser.getIdToken();
						await fetch('/api/auth/session', {
							method: 'POST',
							headers: { 'Content-Type': 'application/json' },
							body: JSON.stringify({ idToken })
						});
					} catch (e) {
						console.error('Failed to sync session:', e);
					}
				} else {
					user = null;
					setAuthHint(null);
					listsStore.clear();
					tastedStore.clear();
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
				emailVerified: auth.currentUser.emailVerified
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
		signIn,
		signUp,
		resetPassword,
		resendVerificationEmail,
		reloadUser,
		signOut,
		getIdToken,
		clearError,
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
			default:
				return 'En feil oppstod. Prøv igjen';
		}
	}
	return 'En feil oppstod. Prøv igjen';
}

export const authStore = createAuthStore();
