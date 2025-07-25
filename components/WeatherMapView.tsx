import React from 'react';
import { View, Text, StyleSheet, Dimensions, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';

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
  const { width } = Dimensions.get('window');

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Ionicons name="location" size={20} color="#FF0000" />
        <Text style={styles.headerText}>Location Map</Text>
      </View>
      
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude,
            longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          scrollEnabled={true}
          zoomEnabled={true}
          rotateEnabled={true}
        >
          <Marker
            coordinate={{ latitude, longitude }}
            title={cityName}
            description={`Temperature: ${temperature}°C`}
          >
            <View style={styles.marker}>
              <Ionicons name="location" size={24} color="#FF0000" />
            </View>
          </Marker>
        </MapView>
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
    borderColor: '#E5E7EB',
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
    height: 200,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#000000', // Changed to black
    marginBottom: 12,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  marker: {
    padding: 5,
    backgroundColor: 'white',
    borderRadius: 20,
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
});

export default WeatherMapView;