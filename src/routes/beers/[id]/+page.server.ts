import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { API_URL } from '$env/static/private';
import type { Product, Store } from '$lib/types';
import { normalizeAssortmentName, normalizeCharacteristic } from '$lib/utils';
import logo from '$lib/assets/logo.png';

export const load: PageServerLoad = async ({ params, fetch }) => {
    const { id } = params;

    try {
        const apiUrl = `${API_URL}/beers/?beers=${id}&all_stock=true`;
        const response = await fetch(apiUrl);

        if (!response.ok) {
            if (response.status === 404) {
                throw error(404, { message: 'Øl ikke funnet' });
            }
            throw error(response.status, {
                message: `API returnerte ${response.status}: ${response.statusText}`
            });
        }

        const data = await response.json();
        const apiData = data.results?.[0];

        if (!apiData) {
            throw error(404, { message: 'Øl ikke funnet' });
        }

        const product: Product = {
            id: apiData.vmp_id,
            name: apiData.vmp_name,
            image: (apiData.label_hd_url && !apiData.label_hd_url.includes('badge-beer-default'))
                ? apiData.label_hd_url
                : logo,
            price: apiData.price,
            volume: apiData.volume,
            pricePerLiter: apiData.price_per_volume,
            style: apiData.style || apiData.sub_category || apiData.main_category,
            rating: apiData.rating,
            checkins: apiData.checkins,
            strength: apiData.abv,
            ibu: apiData.ibu,
            alcoholUnits: apiData.alcohol_units,
            freshness: normalizeCharacteristic(apiData.freshness),
            fullness: normalizeCharacteristic(apiData.fullness),
            bitterness: normalizeCharacteristic(apiData.bitterness),
            sweetness: normalizeCharacteristic(apiData.sweetness),
            description: apiData.description,
            taste: apiData.taste,
            aroma: apiData.aroma,
            color: apiData.color,
            pairing: apiData.food_pairing,
            ingredients: apiData.raw_materials,
            method: apiData.method,
            allergens: apiData.allergens,
            brewery: apiData.brewery,
            country: apiData.country,
            assortment: normalizeAssortmentName(apiData.product_selection),
            vmpUrl: apiData.vmp_url,
            untappdUrl: apiData.untpd_url,
            stores: (apiData.all_stock)
                .map((s: { store_name: string; quantity: number }) => ({
                    name: s.store_name,
                    stock: s.quantity
                }))
                .sort((a: Store, b: Store) => a.name.localeCompare(b.name, 'no'))
        };

        return { product };
    } catch (err) {
        if (err && typeof err === 'object' && 'status' in err) {
            throw err;
        }
        throw error(500, { message: 'Kunne ikke hente øldata' });
    }
};
