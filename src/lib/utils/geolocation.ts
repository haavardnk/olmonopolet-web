import { browser } from '$app/environment';
import type { UserLocation } from '$lib/types';

export function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
	const R = 6371;
	const dLat = ((lat2 - lat1) * Math.PI) / 180;
	const dLng = ((lng2 - lng1) * Math.PI) / 180;
	const a =
		Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		Math.cos((lat1 * Math.PI) / 180) *
			Math.cos((lat2 * Math.PI) / 180) *
			Math.sin(dLng / 2) *
			Math.sin(dLng / 2);
	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	return R * c;
}

export function formatDistance(distance: number): string {
	if (distance < 1) {
		return `${Math.round(distance * 1000)} m`;
	}
	return `${distance.toFixed(1)} km`;
}

export function requestUserLocation(
	onSuccess: (location: UserLocation) => void,
	onError?: (error: GeolocationPositionError) => void
): void {
	if (!browser || !navigator.geolocation) {
		return;
	}

	navigator.geolocation.getCurrentPosition(
		(position) => {
			onSuccess({
				lat: position.coords.latitude,
				lng: position.coords.longitude
			});
		},
		(error) => {
			if (onError) {
				onError(error);
			}
		}
	);
}
