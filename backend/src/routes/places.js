import express from 'express';
import axios from 'axios';

const router = express.Router();

const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY;

// Search places using Google Places API (Text Search)
router.get('/search', async (req, res) => {
  try {
    const { query, location, radius = 5000, type, nextPageToken } = req.query;

    if (!query && !nextPageToken) {
      return res.status(400).json({ error: 'Query parameter is required' });
    }

    if (!GOOGLE_PLACES_API_KEY) {
      return res.status(500).json({ error: 'Google Places API key not configured' });
    }

    const params = {
      key: GOOGLE_PLACES_API_KEY,
      fields: 'place_id,name,formatted_address,geometry,rating,price_level,types,photos,opening_hours,website,formatted_phone_number,business_status'
    };

    if (nextPageToken) {
      params.pagetoken = nextPageToken;
    } else {
      params.query = query;
      if (location) {
        params.location = location;
        params.radius = radius;
      }
      if (type) {
        params.type = type;
      }
    }

    const response = await axios.get('https://maps.googleapis.com/maps/api/place/textsearch/json', {
      params
    });

    if (response.data.status !== 'OK') {
      return res.status(400).json({ 
        error: 'Google Places API error', 
        details: response.data.error_message 
      });
    }

    // Transform the response to match our needs
    const places = response.data.results.map(place => ({
      placeId: place.place_id,
      name: place.name,
      address: place.formatted_address,
      coordinates: {
        lat: place.geometry.location.lat,
        lng: place.geometry.location.lng
      },
      rating: place.rating,
      priceLevel: place.price_level,
      types: place.types,
      businessStatus: place.business_status,
      photos: place.photos?.map(photo => ({
        photoReference: photo.photo_reference,
        height: photo.height,
        width: photo.width
      })),
      openingHours: place.opening_hours,
      website: place.website,
      phoneNumber: place.formatted_phone_number
    }));

    res.json({
      places,
      nextPageToken: response.data.next_page_token
    });
  } catch (error) {
    console.error('Search places error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Search places using Google Places API (Nearby Search)
router.get('/nearby', async (req, res) => {
  try {
    const { location, radius = 5000, type, keyword } = req.query;

    if (!location) {
      return res.status(400).json({ error: 'Location parameter is required (lat,lng)' });
    }

    if (!GOOGLE_PLACES_API_KEY) {
      return res.status(500).json({ error: 'Google Places API key not configured' });
    }

    const params = {
      key: GOOGLE_PLACES_API_KEY,
      location: location,
      radius: radius,
      fields: 'place_id,name,formatted_address,geometry,rating,price_level,types,photos,opening_hours,website,formatted_phone_number,business_status'
    };

    if (type) {
      params.type = type;
    }
    if (keyword) {
      params.keyword = keyword;
    }

    const response = await axios.get('https://maps.googleapis.com/maps/api/place/nearbysearch/json', {
      params
    });

    if (response.data.status !== 'OK') {
      return res.status(400).json({ 
        error: 'Google Places API error', 
        details: response.data.error_message 
      });
    }

    // Transform the response to match our needs
    const places = response.data.results.map(place => ({
      placeId: place.place_id,
      name: place.name,
      address: place.vicinity || place.formatted_address,
      coordinates: {
        lat: place.geometry.location.lat,
        lng: place.geometry.location.lng
      },
      rating: place.rating,
      priceLevel: place.price_level,
      types: place.types,
      businessStatus: place.business_status,
      photos: place.photos?.map(photo => ({
        photoReference: photo.photo_reference,
        height: photo.height,
        width: photo.width
      })),
      openingHours: place.opening_hours
    }));

    res.json({
      places,
      nextPageToken: response.data.next_page_token
    });
  } catch (error) {
    console.error('Nearby search error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Autocomplete search for places
router.get('/autocomplete', async (req, res) => {
  try {
    const { input, location, radius = 5000, types } = req.query;

    if (!input) {
      return res.status(400).json({ error: 'Input parameter is required' });
    }

    if (!GOOGLE_PLACES_API_KEY) {
      return res.status(500).json({ error: 'Google Places API key not configured' });
    }

    const params = {
      key: GOOGLE_PLACES_API_KEY,
      input: input,
      fields: 'place_id,description,structured_formatting'
    };

    if (location) {
      params.location = location;
      params.radius = radius;
    }

    if (types) {
      params.types = types;
    }

    const response = await axios.get('https://maps.googleapis.com/maps/api/place/autocomplete/json', {
      params
    });

    if (response.data.status !== 'OK') {
      return res.status(400).json({ 
        error: 'Google Places API error', 
        details: response.data.error_message 
      });
    }

    // Transform the response
    const predictions = response.data.predictions.map(prediction => ({
      placeId: prediction.place_id,
      description: prediction.description,
      structuredFormatting: prediction.structured_formatting
    }));

    res.json({
      predictions
    });
  } catch (error) {
    console.error('Autocomplete search error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get place details
router.get('/:placeId/details', async (req, res) => {
  try {
    const { placeId } = req.params;
    const { fields = 'place_id,name,formatted_address,geometry,rating,price_level,types,photos,opening_hours,website,formatted_phone_number,reviews' } = req.query;

    if (!GOOGLE_PLACES_API_KEY) {
      return res.status(500).json({ error: 'Google Places API key not configured' });
    }

    const response = await axios.get('https://maps.googleapis.com/maps/api/place/details/json', {
      params: {
        key: GOOGLE_PLACES_API_KEY,
        place_id: placeId,
        fields: fields
      }
    });

    if (response.data.status !== 'OK') {
      return res.status(400).json({ 
        error: 'Google Places API error', 
        details: response.data.error_message 
      });
    }

    const place = response.data.result;

    // Transform the response
    const placeDetails = {
      placeId: place.place_id,
      name: place.name,
      address: place.formatted_address,
      coordinates: {
        lat: place.geometry.location.lat,
        lng: place.geometry.location.lng
      },
      rating: place.rating,
      userRatingsTotal: place.user_ratings_total,
      priceLevel: place.price_level,
      types: place.types,
      photos: place.photos?.map(photo => ({
        photoReference: photo.photo_reference,
        height: photo.height,
        width: photo.width
      })),
      openingHours: place.opening_hours,
      website: place.website,
      phoneNumber: place.formatted_phone_number,
      reviews: place.reviews?.map(review => ({
        authorName: review.author_name,
        rating: review.rating,
        text: review.text,
        time: review.time
      }))
    };

    res.json(placeDetails);
  } catch (error) {
    console.error('Get place details error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get place photo
router.get('/:placeId/photo/:photoReference', async (req, res) => {
  try {
    const { placeId, photoReference } = req.params;
    const { maxwidth = 400, maxheight = 400 } = req.query;

    if (!GOOGLE_PLACES_API_KEY) {
      return res.status(500).json({ error: 'Google Places API key not configured' });
    }

    const photoUrl = `https://maps.googleapis.com/maps/api/place/photo?key=${GOOGLE_PLACES_API_KEY}&photo_reference=${photoReference}&maxwidth=${maxwidth}&maxheight=${maxheight}`;

    res.redirect(photoUrl);
  } catch (error) {
    console.error('Get place photo error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get place by coordinates (reverse geocoding)
router.get('/reverse-geocode', async (req, res) => {
  try {
    const { lat, lng } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ error: 'Latitude and longitude are required' });
    }

    if (!GOOGLE_PLACES_API_KEY) {
      return res.status(500).json({ error: 'Google Places API key not configured' });
    }

    const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
      params: {
        key: GOOGLE_PLACES_API_KEY,
        latlng: `${lat},${lng}`,
        result_type: 'establishment|point_of_interest'
      }
    });

    if (response.data.status !== 'OK') {
      return res.status(400).json({ 
        error: 'Google Geocoding API error', 
        details: response.data.error_message 
      });
    }

    const results = response.data.results.map(result => ({
      placeId: result.place_id,
      formattedAddress: result.formatted_address,
      addressComponents: result.address_components,
      geometry: result.geometry,
      types: result.types
    }));

    res.json({
      results
    });
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get place types for filtering
router.get('/types', async (req, res) => {
  try {
    const placeTypes = [
      { value: 'restaurant', label: 'Restaurant' },
      { value: 'tourist_attraction', label: 'Tourist Attraction' },
      { value: 'lodging', label: 'Hotel' },
      { value: 'shopping_mall', label: 'Shopping Mall' },
      { value: 'museum', label: 'Museum' },
      { value: 'park', label: 'Park' },
      { value: 'church', label: 'Church' },
      { value: 'hospital', label: 'Hospital' },
      { value: 'school', label: 'School' },
      { value: 'bank', label: 'Bank' },
      { value: 'gas_station', label: 'Gas Station' },
      { value: 'atm', label: 'ATM' },
      { value: 'pharmacy', label: 'Pharmacy' },
      { value: 'gym', label: 'Gym' },
      { value: 'cafe', label: 'Cafe' },
      { value: 'bar', label: 'Bar' },
      { value: 'night_club', label: 'Night Club' },
      { value: 'movie_theater', label: 'Movie Theater' },
      { value: 'zoo', label: 'Zoo' },
      { value: 'aquarium', label: 'Aquarium' }
    ];

    res.json({ types: placeTypes });
  } catch (error) {
    console.error('Get place types error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
