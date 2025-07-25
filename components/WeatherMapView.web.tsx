import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface WeatherMapViewProps {
  latitude: number;
  longitude: number;
  cityName: string;
  temperature: number;
}

const WeatherMapView: React.FC<WeatherMapViewProps> = ({
  latitude,
  longitude,
  cityName,
  temperature,
}) => {
 

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Ionicons name="location" size={20} color="#FF0000" />
        <Text style={styles.headerText}>Location Map</Text>
      </View>
      
      <View style={[styles.mapContainer, { borderColor: '#000000' }]}>
        <View style={[styles.webMapFallback, { borderColor: '#000000' }]}>
          <View style={styles.webMapHeader}>
            <Ionicons name="map" size={32} color="#FF0000" />
            <Text style={styles.webMapTitle}>{cityName}</Text>
            <Text style={styles.webMapTemp}>{temperature}°C</Text>
          </View>
          <View style={styles.webMapContent}>
            <Text style={styles.webMapText}>Interactive map available on mobile devices</Text>
            <Text style={styles.webMapSubtext}>
              View this location at coordinates: {latitude.toFixed(4)}, {longitude.toFixed(4)}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.coordinatesContainer}>
        <View style={styles.coordinateItem}>
          <Text style={styles.coordinateLabel}>Latitude</Text>
          <Text style={styles.coordinateValue}>{latitude.toFixed(6)}</Text>
        </View>
        <View style={styles.coordinateItem}>
          <Text style={styles.coordinateLabel}>Longitude</Text>
          <Text style={styles.coordinateValue}>{longitude.toFixed(6)}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#000000',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginLeft: 8,
  },
  mapContainer: {
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#000000', // Explicit black
    marginBottom: 12,
  },
  coordinatesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  coordinateItem: {
    flex: 1,
    alignItems: 'center',
  },
  coordinateLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
    marginBottom: 4,
  },
  coordinateValue: {
    fontSize: 14,
    color: '#FF0000',
    fontWeight: '700',
  },
  webMapFallback: {
    height: 200,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#000000', // Explicit black
    borderStyle: 'dashed',
  },
  webMapHeader: {
    alignItems: 'center',
    marginBottom: 12,
  },
  webMapTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
    marginTop: 8,
    marginBottom: 4,
  },
  webMapTemp: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF0000',
  },
  webMapContent: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  webMapText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 8,
  },
  webMapSubtext: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
    fontWeight: '400',
  },
});

export default WeatherMapView;