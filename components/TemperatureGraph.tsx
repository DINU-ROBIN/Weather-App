import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface TemperatureGraphProps {
  minTemp: number;
  maxTemp: number;
  currentTemp?: number;
  tempUnit?: string;
}

const TemperatureGraph: React.FC<TemperatureGraphProps> = ({
  minTemp,
  maxTemp,
  currentTemp,
  tempUnit = '°C',
}) => {
  // Validate props
  if (typeof minTemp !== 'number' || typeof maxTemp !== 'number' || (currentTemp !== undefined && typeof currentTemp !== 'number')) {
    console.warn('Invalid props:', { minTemp, maxTemp, currentTemp });
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Error: Invalid temperature data</Text>
      </View>
    );
  }

  // Prevent division by zero
  const tempRange = maxTemp !== minTemp ? maxTemp - minTemp : 1;
  const graphHeight = 120;

  // Calculate positions for the graph
  const minTempHeight = 20;
  const maxTempHeight = graphHeight - 20;

  // Calculate current temperature position if provided
  const currentTempHeight =
    currentTemp !== undefined && !isNaN(currentTemp)
      ? minTempHeight + ((currentTemp - minTemp) / tempRange) * (maxTempHeight - minTempHeight)
      : null;

  // Create temperature scale marks
  const scaleMarks = [];
  const numMarks = 5;
  for (let i = 0; i < numMarks; i++) {
    const temp = minTemp + (tempRange * i) / (numMarks - 1);
    const height = minTempHeight + (i / (numMarks - 1)) * (maxTempHeight - minTempHeight);
    scaleMarks.push({ temp: Math.round(temp), height });
  }

  // Debug scale marks
  console.log('Scale Marks:', scaleMarks);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Temperature Range</Text>
        <Text style={styles.subtitle}>
          {`${Math.round(minTemp)}${tempUnit} - ${Math.round(maxTemp)}${tempUnit}`}
        </Text>
      </View>

      <View style={styles.graphContainer}>
        {/* Y-axis scale */}
        <View style={styles.yAxis}>
          {scaleMarks.map((mark, index) => (
            <View key={index} style={[styles.scaleMark, { bottom: mark.height - 10 }]}>
              <Text style={styles.scaleText}>{`${mark.temp}${tempUnit}`}</Text>
            </View>
          ))}
        </View>

        {/* Graph area */}
        <View style={styles.graphArea}>
          {scaleMarks.map((mark, index) => (
            <View key={index} style={[styles.gridLine, { bottom: mark.height }]} />
          ))}

          {/* Temperature bar */}
          <View style={styles.temperatureBar}>
            <View
              style={[
                styles.tempBarFill,
                {
                  bottom: minTempHeight,
                  height: maxTempHeight - minTempHeight,
                },
              ]}
            />

            {/* Min temperature marker */}
            <View style={[styles.tempMarker, { bottom: minTempHeight - 8 }]}>
              <View style={[styles.tempMarkerDot, { backgroundColor: '#999999' }]} />
              <View style={styles.tempMarkerLabel}>
                <Ionicons name="thermometer-outline" size={12} color="#999999" />
                <Text style={styles.tempMarkerText}>Min</Text>
              </View>
            </View>

            {/* Max temperature marker */}
            <View style={[styles.tempMarker, { bottom: maxTempHeight - 8 }]}>
              <View style={[styles.tempMarkerDot, { backgroundColor: '#FF0000' }]} />
              <View style={styles.tempMarkerLabel}>
                <Ionicons name="thermometer" size={12} color="#FF0000" />
                <Text style={styles.tempMarkerText}>Max</Text>
              </View>
            </View>

            {/* Current temperature marker */}
            {currentTemp !== undefined && !isNaN(currentTempHeight) && (
              <View style={[styles.tempMarker, { bottom: currentTempHeight! - 8 }]}>
                <View style={[styles.tempMarkerDot, { backgroundColor: '#FFFFFF', borderColor: '#FF0000' }]} />
                <View style={styles.tempMarkerLabel}>
                  <Text style={[styles.tempMarkerText, { color: '#FFFFFF' }]}>Now</Text>
                </View>
              </View>
            )}
          </View>
        </View>
      </View>

      {/* Temperature info */}
      <View style={styles.infoContainer}>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Range</Text>
          <Text style={styles.infoValue}>{`${Math.round(tempRange)}${tempUnit}`}</Text>
        </View>
        {currentTemp !== undefined && (
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Current</Text>
            <Text style={styles.infoValue}>{`${Math.round(currentTemp)}${tempUnit}`}</Text>
          </View>
        )}
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Average</Text>
          <Text style={styles.infoValue}>{`${Math.round((minTemp + maxTemp) / 2)}${tempUnit}`}</Text>
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
  subtitle: {
    fontSize: 12,
    color: '#CCCCCC',
    fontStyle: 'italic',
  },
  graphContainer: {
    flexDirection: 'row',
    height: 120,
    marginBottom: 16,
  },
  yAxis: {
    width: 50,
    position: 'relative',
  },
  scaleMark: {
    position: 'absolute',
    right: 8,
    alignItems: 'flex-end',
  },
  scaleText: {
    fontSize: 9,
    color: '#999999',
    fontWeight: '500',
  },
  graphArea: {
    flex: 1,
    position: 'relative',
    marginLeft: 8,
  },
  gridLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: '#333333',
    opacity: 0.5,
  },
  temperatureBar: {
    position: 'absolute',
    left: '40%',
    right: '40%',
    top: 0,
    bottom: 0,
  },
  tempBarFill: {
    position: 'absolute',
    left: 0,
    right: 0,
    backgroundColor: '#FF0000',
    opacity: 0.2,
    borderRadius: 4,
  },
  tempMarker: {
    position: 'absolute',
    left: -20,
    right: -20,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tempMarkerDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  tempMarkerLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#000000',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#333333',
  },
  tempMarkerText: {
    fontSize: 8,
    color: '#CCCCCC',
    marginLeft: 2,
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

export default TemperatureGraph;