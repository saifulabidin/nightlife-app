const FOURSQUARE_API_KEY = 'fsq3AK4c3etdgwv7EQxTrkG5H+GyVv1zry/P5jcrCjnWTGQ=';

class VenueAPI {
  static async searchBars(location) {
    try {
      const response = await fetch(
        `https://api.foursquare.com/v3/places/search?query=bar&near=${location}&limit=10`,
        {
          headers: {
            'Accept': 'application/json',
            'Authorization': FOURSQUARE_API_KEY
          }
        }
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch venues');
      }
      
      const data = await response.json();
      return data.results;
    } catch (error) {
      console.error('Error fetching venues:', error);
      throw error;
    }
  }
}

// Export for use in other files
window.VenueAPI = VenueAPI;
