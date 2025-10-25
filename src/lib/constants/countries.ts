export const COUNTRIES = {
	Argentina: 'AR',
	Australia: 'AU',
	Belgia: 'BE',
	Brasil: 'BR',
	Bulgaria: 'BG',
	Canada: 'CA',
	Danmark: 'DK',
	'Den europeiske union': 'EU',
	England: 'GB',
	Estland: 'EE',
	Finland: 'FI',
	Frankrike: 'FR',
	Færøyene: 'FO',
	Georgia: 'GE',
	Hellas: 'GR',
	India: 'IN',
	Irland: 'IE',
	Island: 'IS',
	Italia: 'IT',
	Japan: 'JP',
	Kina: 'CN',
	Kroatia: 'HR',
	Latvia: 'LV',
	Libanon: 'LB',
	Litauen: 'LT',
	Mexico: 'MX',
	Nederland: 'NL',
	'New Zealand': 'NZ',
	'Nord Irland': 'GB',
	Norge: 'NO',
	Palestina: 'PS',
	Peru: 'PE',
	Polen: 'PL',
	Portugal: 'PT',
	Russland: 'RU',
	Romania: 'RO',
	Serbia: 'RS',
	Singapore: 'SG',
	Skottland: 'GB',
	Spania: 'ES',
	Storbritannia: 'GB',
	Sveits: 'CH',
	Sverige: 'SE',
	'Sør-Afrika': 'ZA',
	Thailand: 'TH',
	Tsjekkia: 'CZ',
	Tyrkia: 'TR',
	Tyskland: 'DE',
	USA: 'US',
	Ungarn: 'HU',
	Ukraina: 'UA',
	Wales: 'GB',
	Østerrike: 'AT'
} as const;

export type CountryName = keyof typeof COUNTRIES;
export type CountryCode = (typeof COUNTRIES)[CountryName];

export const COUNTRY_NAMES = Object.keys(COUNTRIES) as CountryName[];
export const COUNTRY_CODES = Object.values(COUNTRIES);

export function getCountryCode(countryName: string): CountryCode | undefined {
	return COUNTRIES[countryName as CountryName];
}
