import React, { useEffect, useRef } from 'react';
import { View, Animated, Dimensions, StyleSheet } from 'react-native';

interface WeatherEffectsProps {
  weatherCondition: string;
  weatherMain: string;
}

const { width, height } = Dimensions.get('window');

const WeatherEffects: React.FC<WeatherEffectsProps> = ({ weatherCondition, weatherMain }) => {
  const rainDrops = useRef(Array.from({ length: 25 }, () => new Animated.Value(0))).current;
  const sunRays = useRef(Array.from({ length: 8 }, () => new Animated.Value(0))).current;
  const clouds = useRef(Array.from({ length: 3 }, () => new Animated.Value(0))).current;
  const snowFlakes = useRef(Array.from({ length: 40 }, () => new Animated.Value(0))).current;
  const shineEffect = useRef(new Animated.Value(0)).current;
  const mistParticles = useRef(Array.from({ length: 15 }, () => new Animated.Value(0))).current;
  const lightningFlash = useRef(new Animated.Value(0)).current;
  const windyElements = useRef(Array.from({ length: 12 }, () => new Animated.Value(0))).current;

  // Enhanced sun shine effect - full screen white overlay
  const createSunShineEffect = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shineEffect, {
          toValue: 0.15,
          duration: 2000,
          useNativeDriver: false,
        }),
        Animated.timing(shineEffect, {
          toValue: 0.05,
          duration: 1500,
          useNativeDriver: false,
        }),
        Animated.timing(shineEffect, {
          toValue: 0.2,
          duration: 1200,
          useNativeDriver: false,
        }),
        Animated.timing(shineEffect, {
          toValue: 0,
          duration: 1800,
          useNativeDriver: false,
        }),
      ])
    ).start();
  };

  // Rain effect
  const createRainEffect = () => {
    const animations = rainDrops.map((drop, index) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(Math.random() * 1000),
          Animated.timing(drop, {
            toValue: height + 100,
            duration: 800 + Math.random() * 800,
            useNativeDriver: true,
          }),
          Animated.timing(drop, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ])
      );
    });
    Animated.stagger(80, animations).start();
  };

  // Sun shine effect only - no rays
  const createSunEffect = () => {
    createSunShineEffect();
  };

  // Cloud movement effect
  const createCloudEffect = () => {
    const animations = clouds.map((cloud) => {
      return Animated.loop(
        Animated.timing(cloud, {
          toValue: width + 150,
          duration: 12000 + Math.random() * 6000,
          useNativeDriver: true,
        })
      );
    });
    Animated.stagger(3000, animations).start();
  };

  // Enhanced snow effect with varying sizes
  const createSnowEffect = () => {
    const animations = snowFlakes.map((flake) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(Math.random() * 3000),
          Animated.timing(flake, {
            toValue: height + 100,
            duration: 4000 + Math.random() * 3000,
            useNativeDriver: true,
          }),
          Animated.timing(flake, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ])
      );
    });
    Animated.stagger(150, animations).start();
  };

  // Mist/Fog effect
  const createMistEffect = () => {
    const animations = mistParticles.map((particle) => {
      return Animated.loop(
        Animated.sequence([
          Animated.timing(particle, {
            toValue: width + 200,
            duration: 15000 + Math.random() * 10000,
            useNativeDriver: true,
          }),
          Animated.timing(particle, {
            toValue: -200,
            duration: 0,
            useNativeDriver: true,
          }),
        ])
      );
    });
    Animated.stagger(1000, animations).start();
  };

  // Lightning effect for thunderstorms
  const createLightningEffect = () => {
    const flashSequence = () => {
      Animated.sequence([
        Animated.timing(lightningFlash, {
          toValue: 0.8,
          duration: 100,
          useNativeDriver: false,
        }),
        Animated.timing(lightningFlash, {
          toValue: 0,
          duration: 200,
          useNativeDriver: false,
        }),
        Animated.timing(lightningFlash, {
          toValue: 0.6,
          duration: 150,
          useNativeDriver: false,
        }),
        Animated.timing(lightningFlash, {
          toValue: 0,
          duration: 100,
          useNativeDriver: false,
        }),
        Animated.delay(3000 + Math.random() * 7000),
      ]).start(() => flashSequence());
    };
    flashSequence();
  };

  // Windy effect
  const createWindyEffect = () => {
    const animations = windyElements.map((element) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(Math.random() * 2000),
          Animated.timing(element, {
            toValue: width + 50,
            duration: 1500 + Math.random() * 1000,
            useNativeDriver: true,
          }),
          Animated.timing(element, {
            toValue: -50,
            duration: 0,
            useNativeDriver: true,
          }),
        ])
      );
    });
    Animated.stagger(300, animations).start();
  };

  useEffect(() => {
    // Reset all animations
    rainDrops.forEach(drop => drop.setValue(0));
    sunRays.forEach(ray => ray.setValue(0.4));
    clouds.forEach(cloud => cloud.setValue(-150));
    snowFlakes.forEach(flake => flake.setValue(0));
    mistParticles.forEach(particle => particle.setValue(-200));
    windyElements.forEach(element => element.setValue(-50));
    shineEffect.setValue(0);
    lightningFlash.setValue(0);

    // Start appropriate effect based on weather condition
    const condition = weatherMain.toLowerCase();
    const description = weatherCondition.toLowerCase();

    if (condition.includes('rain') || description.includes('rain') || description.includes('drizzle')) {
      createRainEffect();
      if (description.includes('thunder') || description.includes('storm')) {
        createLightningEffect();
      }
    } else if (condition.includes('clear') || description.includes('clear') || description.includes('sunny')) {
      createSunEffect();
    } else if (condition.includes('clouds') || description.includes('cloud') || description.includes('overcast')) {
      createCloudEffect();
    } else if (condition.includes('snow') || description.includes('snow')) {
      createSnowEffect();
    } else if (condition.includes('mist') || condition.includes('fog') || description.includes('mist') || description.includes('fog')) {
      createMistEffect();
    } else if (condition.includes('wind') || description.includes('wind') || description.includes('breezy')) {
      createWindyEffect();
    }
  }, [weatherCondition, weatherMain]);

  const getBackgroundColor = () => {
    const condition = weatherMain.toLowerCase();
    const description = weatherCondition.toLowerCase();

    if (condition.includes('rain') || description.includes('rain')) {
      return 'rgba(74, 85, 104, 0.4)';
    } else if (condition.includes('clear') || description.includes('clear')) {
      return 'rgba(135, 206, 235, 0.2)';
    } else if (condition.includes('clouds') || description.includes('cloud')) {
      return 'rgba(156, 163, 175, 0.3)';
    } else if (condition.includes('snow') || description.includes('snow')) {
      return 'rgba(229, 231, 235, 0.4)';
    } else if (condition.includes('mist') || condition.includes('fog')) {
      return 'rgba(209, 213, 219, 0.5)';
    } else if (condition.includes('wind') || description.includes('wind')) {
      return 'rgba(243, 244, 246, 0.2)';
    }
    return 'rgba(243, 244, 246, 0.3)';
  };

  const renderRainDrops = () => {
    const condition = weatherMain.toLowerCase();
    const description = weatherCondition.toLowerCase();
    
    if (!condition.includes('rain') && !description.includes('rain') && !description.includes('drizzle')) {
      return null;
    }

    return rainDrops.map((drop, index) => (
      <Animated.View
        key={`rain-${index}`}
        style={[
          styles.rainDrop,
          {
            left: Math.random() * width,
            transform: [{ translateY: drop }],
            opacity: 0.7,
          },
        ]}
      />
    ));
  };

  const renderSunRays = () => {
    // Sun rays removed - only using shine effect now
    return null;
  };

  const renderClouds = () => {
    const condition = weatherMain.toLowerCase();
    const description = weatherCondition.toLowerCase();
    
    if (!condition.includes('clouds') && !description.includes('cloud') && !description.includes('overcast')) {
      return null;
    }

    return clouds.map((cloud, index) => (
      <Animated.View
        key={`cloud-${index}`}
        style={[
          styles.cloud,
          {
            top: 30 + index * 70,
            transform: [{ translateX: cloud }],
          },
        ]}
      >
        <View style={[styles.cloudPart, { width: 70, height: 70 }]} />
        <View style={[styles.cloudPart, { width: 90, height: 90, marginLeft: -25 }]} />
        <View style={[styles.cloudPart, { width: 70, height: 70, marginLeft: -25 }]} />
      </Animated.View>
    ));
  };

  const renderSnowFlakes = () => {
    const condition = weatherMain.toLowerCase();
    const description = weatherCondition.toLowerCase();
    
    if (!condition.includes('snow') && !description.includes('snow')) {
      return null;
    }

    return snowFlakes.map((flake, index) => {
      const size = 6 + Math.random() * 6; // Varying sizes between 6-12
      return (
        <Animated.View
          key={`snow-${index}`}
          style={[
            styles.snowFlake,
            {
              left: Math.random() * width,
              width: size,
              height: size,
              borderRadius: size / 2,
              transform: [{ translateY: flake }],
            },
          ]}
        />
      );
    });
  };

  const renderMist = () => {
    const condition = weatherMain.toLowerCase();
    const description = weatherCondition.toLowerCase();
    
    if (!condition.includes('mist') && !condition.includes('fog') && !description.includes('mist') && !description.includes('fog')) {
      return null;
    }

    return mistParticles.map((particle, index) => (
      <Animated.View
        key={`mist-${index}`}
        style={[
          styles.mistParticle,
          {
            top: 100 + Math.random() * (height - 200),
            transform: [{ translateX: particle }],
          },
        ]}
      />
    ));
  };

  const renderWindyElements = () => {
    const condition = weatherMain.toLowerCase();
    const description = weatherCondition.toLowerCase();
    
    if (!condition.includes('wind') && !description.includes('wind') && !description.includes('breezy')) {
      return null;
    }

    return windyElements.map((element, index) => (
      <Animated.View
        key={`wind-${index}`}
        style={[
          styles.windElement,
          {
            top: 50 + Math.random() * (height - 100),
            transform: [{ translateX: element }],
          },
        ]}
      />
    ));
  };

  return (
    <View style={styles.container}>
      <View style={[styles.backgroundGradient, { backgroundColor: getBackgroundColor() }]} />
      
      {/* Enhanced sun shine overlay - full screen white fade */}
      <Animated.View
        style={[
          styles.fullScreenShine,
          {
            opacity: shineEffect,
          }
        ]}
      />

      {/* Lightning flash overlay */}
      <Animated.View
        style={[
          styles.lightningOverlay,
          {
            opacity: lightningFlash,
          }
        ]}
      />

      {renderRainDrops()}
      {renderSunRays()}
      {renderClouds()}
      {renderSnowFlakes()}
      {renderMist()}
      {renderWindyElements()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
    pointerEvents: 'none',
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.4,
  },
  fullScreenShine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 1)',
    zIndex: 3,
  },
  lightningOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 1)',
    zIndex: 4,
  },
  rainDrop: {
    position: 'absolute',
    width: 2,
    height: 25,
    backgroundColor: '#4A90E2',
    borderRadius: 1,
  },
  sunRay: {
    position: 'absolute',
    top: 80,
    left: width / 2 - 3,
    width: 6,
    height: 120,
    backgroundColor: '#FFD700',
    borderRadius: 3,
    transformOrigin: '50% 0%',
  },
  cloud: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  cloudPart: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 50,
  },
  snowFlake: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
    opacity: 0.9,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  mistParticle: {
    position: 'absolute',
    width: 120 + Math.random() * 80,
    height: 60 + Math.random() * 40,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 50,
    opacity: 0.6,
  },
  windElement: {
    position: 'absolute',
    width: 40 + Math.random() * 30,
    height: 2,
    backgroundColor: 'rgba(156, 163, 175, 0.5)',
    borderRadius: 1,
  },
});

export default WeatherEffects;