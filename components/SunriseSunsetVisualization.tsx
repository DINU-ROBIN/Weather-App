import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SunriseSunsetProps {
  sunrise: number; // Unix timestamp
  sunset: number;  // Unix timestamp
  currentTime?: number; // Unix timestamp, defaults to current time
}

const SunriseSunsetVisualization: React.FC<SunriseSunsetProps> = ({
  sunrise,
  sunset,
  currentTime = Date.now() / 1000
}) => {
  const sunPosition = useRef(new Animated.Value(0)).current;
  const sunOpacity = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // Calculate sun position based on time
    const calculateSunPosition = () => {
      const dayDuration = sunset - sunrise;
      const timeFromSunrise = currentTime - sunrise;
      
      let position = 0;
      let opacity = 0.8;
      
      if (currentTime < sunrise) {
        // Before sunrise - sun is hidden
        position = 0;
        opacity = 0.3;
      } else if (currentTime > sunset) {
        // After sunset - sun is hidden
        position = 1;
        opacity = 0.3;
      } else {
        // During day - calculate position
        position = Math.max(0, Math.min(1, timeFromSunrise / dayDuration));
        opacity = 1;
      }
      
      return { position, opacity };
    };

    const { position, opacity } = calculateSunPosition();
    
    // Animate sun to calculated position
    Animated.parallel([
      Animated.timing(sunPosition, {
        toValue: position,
        duration: 1000,
        useNativeDriver: false,
      }),
      Animated.timing(sunOpacity, {
        toValue: opacity,
        duration: 1000,
        useNativeDriver: false,
      }),
    ]).start();
  }, [sunrise, sunset, currentTime]);

  const formatTime = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getCurrentTimeStatus = () => {
    if (currentTime < sunrise) {
      const timeToSunrise = sunrise - currentTime;
      const hours = Math.floor(timeToSunrise / 3600);
      const minutes = Math.floor((timeToSunrise % 3600) / 60);
      return `Sunrise in ${hours}h ${minutes}m`;
    } else if (currentTime > sunset) {
      const timeToSunrise = (24 * 3600) - (currentTime - sunset) + (sunrise - (Math.floor(sunrise / (24 * 3600)) * 24 * 3600));
      const hours = Math.floor(timeToSunrise / 3600);
      const minutes = Math.floor((timeToSunrise % 3600) / 60);
      return `Next sunrise in ${hours}h ${minutes}m`;
    } else {
      const timeToSunset = sunset - currentTime;
      const hours = Math.floor(timeToSunset / 3600);
      const minutes = Math.floor((timeToSunset % 3600) / 60);
      return `Sunset in ${hours}h ${minutes}m`;
    }
  };

  const isDaytime = currentTime >= sunrise && currentTime <= sunset;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Sun Position</Text>
        <Text style={styles.status}>{getCurrentTimeStatus()}</Text>
      </View>
      
      <View style={styles.sunPathContainer}>
        {/* Horizon line */}
        <View style={styles.horizonLine} />
        
        {/* Sun path arc */}
        <View style={styles.sunPath} />
        
        {/* Animated sun */}
        <Animated.View
          style={[
            styles.sun,
            {
              left: sunPosition.interpolate({
                inputRange: [0, 1],
                outputRange: ['8%', '92%'],
              }),
              bottom: sunPosition.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: [2, 42, 2],
              }),
              opacity: sunOpacity,
            },
          ]}
        >
          <Ionicons
            name="sunny"
            size={28}
            color={isDaytime ? "#FF0000" : "#CC0000"}
          />
        </Animated.View>
        
        {/* Sunrise marker */}
        <View style={[styles.timeMarker, styles.sunriseMarker]}>
          <Ionicons name="sunny-outline" size={16} color="#FF0000" />
          <Text style={styles.timeText}>{formatTime(sunrise)}</Text>
          <Text style={styles.labelText}>Sunrise</Text>
        </View>
        
        {/* Sunset marker */}
        <View style={[styles.timeMarker, styles.sunsetMarker]}>
          <Ionicons name="moon-outline" size={16} color="#999999" />
          <Text style={styles.timeText}>{formatTime(sunset)}</Text>
          <Text style={styles.labelText}>Sunset</Text>
        </View>
        
        {/* Current time indicator */}
        {isDaytime && (
          <Animated.View
            style={[
              styles.currentTimeIndicator,
              {
                left: sunPosition.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['8%', '92%'],
                }),
              },
            ]}
          >
            <View style={styles.currentTimeDot} />
            <Text style={styles.currentTimeText}>
              {new Date(currentTime * 1000).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
          </Animated.View>
        )}
      </View>
      
      <View style={styles.infoContainer}>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Day Length</Text>
          <Text style={styles.infoValue}>
            {Math.floor((sunset - sunrise) / 3600)}h {Math.floor(((sunset - sunrise) % 3600) / 60)}m
          </Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Status</Text>
          <Text style={[styles.infoValue, { color: isDaytime ? '#FF0000' : '#999999' }]}>
            {isDaytime ? 'Daytime' : 'Nighttime'}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000000',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  header: {
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
    marginBottom: 4,
  },
  status: {
    fontSize: 12,
    color: '#CCCCCC',
    fontStyle: 'italic',
  },
  sunPathContainer: {
    height: 80,
    position: 'relative',
    marginBottom: 16,
  },
  horizonLine: {
    position: 'absolute',
    bottom: 2,
    left: '8%',
    right: '8%',
    height: 1,
    backgroundColor: '#CCCCCC',
  },
  sunPath: {
    position: 'absolute',
    bottom: 2,
    left: '8%',
    right: '8%',
    height: 40,
    borderTopLeftRadius: 100,
    borderTopRightRadius: 100,
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: '#999999',
    borderStyle: 'dashed',
  },
  sun: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    width: 32,
    height: 32,
    marginLeft: -16,
  },
  timeMarker: {
    position: 'absolute',
    bottom: -8,
    alignItems: 'center',
    minWidth: 60,
    marginLeft: -30,
  },
  sunriseMarker: {
    left: '8%',
  },
  sunsetMarker: {
    right: '8%',
    left: 'auto',
  },
  timeText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: '600',
    marginTop: 2,
  },
  labelText: {
    fontSize: 8,
    color: '#CCCCCC',
    marginTop: 1,
  },
  currentTimeIndicator: {
    position: 'absolute',
    bottom: -24,
    alignItems: 'center',
    marginLeft: -30,
  },
  currentTimeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FF0000',
    marginBottom: 2,
  },
  currentTimeText: {
    fontSize: 9,
    color: '#FF0000',
    fontWeight: '600',
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#CCCCCC',
    paddingTop: 12,
  },
  infoItem: {
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 10,
    color: '#CCCCCC',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});

export default SunriseSunsetVisualization;