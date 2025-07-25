import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SavedCitiesContextType {
  savedCities: string[];
  addCity: (city: string) => void;
  removeCity: (city: string) => void;
}

const SavedCitiesContext = createContext<any>(null);

export const SavedCitiesProvider = ({ children }: { children: React.ReactNode }) => {
  const [savedCities, setSavedCities] = useState<string[]>([]);

  // Load from storage on mount
  useEffect(() => {
    (async () => {
      const stored = await AsyncStorage.getItem('SAVED_CITIES');
      if (stored) setSavedCities(JSON.parse(stored));
    })();
  }, []);

  // Save to storage whenever savedCities changes
  useEffect(() => {
    AsyncStorage.setItem('SAVED_CITIES', JSON.stringify(savedCities));
  }, [savedCities]);

  const addCity = (city: string) => {
    setSavedCities(prev => prev.includes(city) ? prev : [...prev, city]);
  };

  const removeCity = (city: string) => {
    setSavedCities(prev => prev.filter(c => c !== city));
  };

  return (
    <SavedCitiesContext.Provider value={{ savedCities, addCity, removeCity }}>
      {children}
    </SavedCitiesContext.Provider>
  );
};

export const useSavedCities = () => useContext(SavedCitiesContext); 