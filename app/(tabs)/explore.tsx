import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// For now, use local state. For cross-tab sharing, use context or persistent storage.
export default function ExploreScreen() {
  const [savedCities, setSavedCities] = useState<any[]>([]);

  // Placeholder: In a real app, this would come from context or persistent storage
  // For demo, add a dummy city
  React.useEffect(() => {
    setSavedCities([
      { name: 'London', country: 'GB', state: '', lat: 51.5074, lon: -0.1278 },
      { name: 'New York', country: 'US', state: 'NY', lat: 40.7128, lon: -74.0060 },
    ]);
  }, []);

  const handleDeleteCity = (item: any) => {
    setSavedCities(prev => prev.filter(c => !(c.name === item.name && c.country === item.country && c.state === item.state)));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Saved Cities</Text>
      {savedCities.length === 0 ? (
        <Text style={styles.emptyText}>No cities saved yet.</Text>
      ) : (
        <FlatList
          data={savedCities}
          keyExtractor={item => `${item.name}-${item.state}-${item.country}`}
          renderItem={({ item }) => (
            <View style={styles.savedCityRow}>
              <Text style={styles.savedCityText}>{item.name}{item.state ? `, ${item.state}` : ''}, {item.country}</Text>
              <TouchableOpacity onPress={() => handleDeleteCity(item)} style={styles.deleteButton}>
                <Ionicons name="close-circle" size={22} color="#ff3b30" />
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f2f2f2',
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 40,
  },
  savedCityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#e6e6e6',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  savedCityText: {
    fontSize: 16,
  },
  deleteButton: {
    marginLeft: 8,
  },
}); 