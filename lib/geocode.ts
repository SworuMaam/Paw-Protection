export interface GeoLocation {
  address: string;
  latitude: number;
  longitude: number;
}

export async function geocodeAddressNominatim(address: string) {
  try {
    const encoded = encodeURIComponent(address);
const url = `https://nominatim.openstreetmap.org/search?q=${encoded}&format=json&limit=1&countrycodes=NP`;

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'PetAdoptApp/1.0 (your.email@example.com)'
      }
    });

    if (!response.ok) {
      console.error('Nominatim API error:', response.status);
      return null;
    }

    const data = await response.json();

    if (data && data.length > 0) {
      return {
        address: data[0].display_name,
        latitude: parseFloat(data[0].lat),
        longitude: parseFloat(data[0].lon),
      };
    } else {
      return null;
    }
  } catch (err) {
    console.error('Geocode error:', err);
    return null;
  }
}

