import React from 'react';
import { SavedCitiesProvider } from './components/SavedCitiesContext';
import App from './app';

export default function Main() {
  return (
    <SavedCitiesProvider>
      <App />
    </SavedCitiesProvider>
  );
} 