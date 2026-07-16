import { browser } from '$app/environment';
import { PUBLIC_EXTENSION_IDS } from '$env/static/public';

const DEV_EXTENSION_ID = 'fcffhcjmjfpnpkfjcmijkailmhglnjph';

const EXTENSION_IDS = [
	...new Set(
		[
			...(PUBLIC_EXTENSION_IDS ?? '')
				.split(',')
				.map((id) => id.trim())
				.filter(Boolean),
			DEV_EXTENSION_ID
		].filter(Boolean)
	)
];

interface ChromeRuntime {
	sendMessage: (id: string, message: unknown, callback: (response: unknown) => void) => void;
	lastError?: { message?: string };
}

function getRuntime(): ChromeRuntime | null {
	if (!browser) return null;
	const chrome = (window as unknown as { chrome?: { runtime?: ChromeRuntime } }).chrome;
	return chrome?.runtime ?? null;
}

function send<T>(id: string, message: unknown): Promise<T | null> {
	const runtime = getRuntime();
	if (!runtime) return Promise.resolve(null);
	return new Promise((resolve) => {
		try {
			runtime.sendMessage(id, message, (response) => {
				resolve(runtime.lastError ? null : ((response as T) ?? null));
			});
		} catch {
			resolve(null);
		}
	});
}

async function sendToAny<T>(message: unknown): Promise<T | null> {
	for (const id of EXTENSION_IDS) {
		const res = await send<T>(id, message);
		if (res !== null) return res;
	}
	return null;
}

export interface ExtensionStatus {
	installed: boolean;
	connected: boolean;
}

export async function getExtensionStatus(): Promise<ExtensionStatus> {
	const res = await sendToAny<{ installed?: boolean; connected?: boolean }>({
		type: 'olmono-auth-status'
	});
	if (!res) return { installed: false, connected: false };
	return { installed: !!res.installed, connected: !!res.connected };
}

export async function connectExtension(): Promise<boolean> {
	const status = await getExtensionStatus();
	if (!status.installed) return false;

	try {
		const res = await fetch('/api/auth/extension-token');
		if (!res.ok) return false;
		const { token } = await res.json();
		if (!token) return false;
		const ack = await sendToAny<{ ok?: boolean }>({ type: 'olmono-auth-token', token });
		return !!ack?.ok;
	} catch {
		return false;
	}
}

export async function logoutExtension(): Promise<void> {
	await sendToAny({ type: 'olmono-auth-logout' });
}
