// src/hooks/useLocation.js
import * as Location from 'expo-location';
import { useEffect, useState } from 'react';

export const useLocation = (enabled = false) => {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const requestLocation = async () => {
    try {
      setLoading(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        setError('Permission refusée');
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      setLocation(loc);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (enabled) {
      requestLocation();
    }
  }, [enabled]);

  return { location, loading, error, requestLocation };
};