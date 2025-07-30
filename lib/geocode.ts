import { normalizeDistrictFromAddress } from './data/normalizeDistrictFromAddress';

// import { normalizeDistrictFromAddress } from './normalizeDistrict';

export interface GeoLocation {
  address: string;
  latitude: number;
  longitude: number;
  district: string;
}

export async function geocodeAddressNominatim(address: string): Promise<GeoLocation | null> {
  try {
    const encoded = encodeURIComponent(address);
    const url = `https://nominatim.openstreetmap.org/search?q=${encoded}&format=json&limit=1&countrycodes=NP`;

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'PetAdoptApp/1.0 (your.email@example.com)',
      },
    });

    if (!response.ok) {
      console.error('Nominatim API error:', response.status);
      return null;
    }

    const data = await response.json();
    if (data.length > 0) {
      const address = data[0].display_name;
      const district = normalizeDistrictFromAddress(address);

      return {
        address,
        latitude: parseFloat(data[0].lat),
        longitude: parseFloat(data[0].lon),
        district,
      };
    }

    return null;
  } catch (err) {
    console.error('Geocode error:', err);
    return null;
  }
}
