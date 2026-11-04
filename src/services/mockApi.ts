import type { Propellant } from '../types/propellant';
import { INITIAL_MOCK_PROPELLANTS } from '../data/mockPropellants';

export async function fetchMockPropellants(): Promise<Propellant[]> {
  try {
    const response = await fetch('/api/propellants.json', {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      console.warn(`Fetch returned status ${response.status}, using bundled fallback`);
      return INITIAL_MOCK_PROPELLANTS;
    }

    const data: Propellant[] = await response.json();
    return data;
  } catch (err) {
    console.warn('Network request failed, using bundled mock collection:', err);
    return INITIAL_MOCK_PROPELLANTS;
  }
}
