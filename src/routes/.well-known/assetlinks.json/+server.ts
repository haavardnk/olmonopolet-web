import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async () => {
	return json([
		{
			relation: ['delegate_permission/common.handle_all_urls'],
			target: {
				namespace: 'android_app',
				package_name: 'com.beermonopoly.olmonopolet.android',
				sha256_cert_fingerprints: [
					'E5:06:40:46:00:E6:6E:07:6E:43:D1:75:53:3A:DD:C1:EE:8B:D0:E0:30:73:BB:9E:66:7E:6D:F1:F1:85:01:A3'
				]
			}
		}
	]);
};
