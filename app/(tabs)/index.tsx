import Loading from "../../components/Loading";
import { useSavedCities } from "@/components/SavedCitiesContext";
import SunriseSunsetVisualization from "@/components/SunriseSunsetVisualization";
import TemperatureGraph from "@/components/TemperatureGraph";
import { fetchCurrentWeather, fetchForecast } from "@/components/weatherApi";
import WeatherEffects from "@/components/WeatherEffects";
import WeatherMapView from "@/components/WeatherMapView";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated, Dimensions,
  FlatList,
  Image,
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

export default function WeatherScreen() {
  const [search, setSearch] = useState("");
  const [weather, setWeather] = useState<any>(null);
  const [forecast, setForecast] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const { savedCities, addCity, removeCity } = useSavedCities();
  const [addCitySearch, setAddCitySearch] = useState("");
  const [addCityError, setAddCityError] = useState("");
  const [addCityLoading, setAddCityLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [cityWeather, setCityWeather] = useState<any[]>([]);
  const [dotAnimations, setDotAnimations] = useState<Animated.Value[]>([]);
  const { width, height } = Dimensions.get("window");

  // Initialize dot animations when cityWeather changes
  useEffect(() => {
    setDotAnimations(
      cityWeather
        .filter((item) => item !== null)
        .map(() => new Animated.Value(0))
    );
  }, [cityWeather]);

  // Animate pagination dots when selectedIndex changes
  useEffect(() => {
    dotAnimations.forEach((animation, idx) => {
      Animated.spring(animation, {
        toValue: selectedIndex === idx ? 1 : 0,
        friction: 4,
        tension: 50,
        useNativeDriver: false,
      }).start();
    });
  }, [selectedIndex, dotAnimations]);

  // Fetch weather data for saved cities
  useEffect(() => {
    const fetchAllWeather = async () => {
      setLoading(true);
      setError("");
      try {
        const weatherData = await Promise.all(
          savedCities.map(async (city: string) => {
            try {
              return await fetchCurrentWeather(city);
            } catch {
              return null;
            }
          })
        );
        const validWeatherData = weatherData.filter((item) => item !== null);
        const failedCities = savedCities.filter(
          (city: string, idx: number) => weatherData[idx] === null
        );
        if (failedCities.length > 0) {
          setError(`Failed to fetch weather for: ${failedCities.join(", ")}`);
        }
        setCityWeather(validWeatherData);
      } catch (err: any) {
        setError("Error fetching weather for saved cities");
      } finally {
        setLoading(false);
      }
    };
    if (savedCities.length > 0) {
      fetchAllWeather();
    } else {
      setCityWeather([]);
    }
  }, [savedCities]);

  const handleRemoveCity = (city: string) => {
    Alert.alert("Remove City", `Remove ${city} from saved cities?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: () => {
          removeCity(city);
          if (selectedIndex >= savedCities.length - 1 && selectedIndex > 0) {
            setSelectedIndex(selectedIndex - 1);
          }
        },
      },
    ]);
  };

  const WeatherDataItem = ({
    icon,
    title,
    value,
    unit = "",
  }: {
    icon: string;
    title: string;
    value: string | number;
    unit?: string;
  }) => (
    <View style={styles.dataItem}>
      <Ionicons
        name={icon as any}
        size={20}
        color="#FFFFFF"
        style={styles.dataIcon}
      />
      <Text style={styles.dataTitle}>{title}</Text>
      <Text style={styles.dataValue}>
        {value}
        {unit}
      </Text>
    </View>
  );

  const renderWeatherItem = ({ item }: { item: any }) => {
    if (!item) {
      return (
        <View
          style={{
            width,
            height,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={styles.errorText}>City not found</Text>
        </View>
      );
    }

    return (
      <ScrollView
        style={{ width, height }}
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
        <View style={[styles.currentWeather, { minHeight: height }]}>
          <WeatherEffects
            weatherCondition={item.weather[0].description}
            weatherMain={item.weather[0].main}
          />
          <View style={styles.headerSection}>
            <Text style={styles.cityName}>{item.name}</Text>
            <Text style={styles.countryName}>{item.sys.country}</Text>
            <View style={styles.mainTempSection}>
              <Image
                source={{ uri: getIconUrl(item.weather[0].icon) }}
                style={styles.mainIcon}
              />
              <Text style={styles.mainTemp}>
                {Math.round(item.main.temp)}°C
              </Text>
            </View>
            <Text style={styles.feelsLike}>
              Feels like {Math.round(item.main.feels_like)}°C
            </Text>
            <Text style={styles.description}>
              {item.weather[0].description}
            </Text>
          </View>

          <View style={styles.dataGrid}>
            <View style={styles.fullWidthContainer}>
              <SunriseSunsetVisualization
                sunrise={item.sys.sunrise}
                sunset={item.sys.sunset}
                currentTime={Date.now() / 1000}
              />
            </View>
            <View style={styles.fullWidthContainer}>
              <TemperatureGraph
                minTemp={item.main.temp_min}
                maxTemp={item.main.temp_max}
                currentTemp={item.main.temp}
                tempUnit="°C"
              />
            </View>
            <WeatherDataItem
              icon="water-outline"
              title="Humidity"
              value={item.main.humidity}
              unit="%"
            />
            <WeatherDataItem
              icon="speedometer-outline"
              title="Pressure"
              value={item.main.pressure}
              unit=" hPa"
            />
            <WeatherDataItem
              icon="leaf-outline"
              title="Wind Speed"
              value={item.wind.speed}
              unit=" m/s"
            />
            <WeatherDataItem
              icon="navigate-outline"
              title="Wind Direction"
              value={item.wind.deg}
              unit="°"
            />
            <WeatherDataItem
              icon="cloud-outline"
              title="Cloudiness"
              value={item.clouds.all}
              unit="%"
            />
            <WeatherDataItem
              icon="eye-outline"
              title="Visibility"
              value={
                item.visibility ? `${(item.visibility / 1000).toFixed(1)}` : "-"
              }
              unit={item.visibility ? " km" : ""}
            />
            <View style={styles.fullWidthContainer}>
              <WeatherMapView
                latitude={item.coord.lat}
                longitude={item.coord.lon}
                cityName={item.name}
                temperature={Math.round(item.main.temp)}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    );
  };

  const handleSearch = async () => {
    if (!search) return;
    setLoading(true);
    setError("");
    setWeather(null);
    setForecast(null);
    Keyboard.dismiss();
    try {
      const weatherData = await fetchCurrentWeather(search);
      const forecastData = await fetchForecast(search);
      setWeather(weatherData);
      setForecast(forecastData);
    } catch (err: any) {
      setError(err.message || "Error fetching weather");
    } finally {
      setLoading(false);
    }
  };

  const handleAddCity = async () => {
    if (!addCitySearch) return;
    setAddCityLoading(true);
    setAddCityError("");
    try {
      await fetchCurrentWeather(addCitySearch);
      if (!savedCities.includes(addCitySearch)) {
        addCity(addCitySearch);
      }
      setAddCitySearch("");
      setModalVisible(false);
    } catch (err: any) {
      setAddCityError("City not found");
    } finally {
      setAddCityLoading(false);
    }
  };

  const getIconUrl = (icon: string) =>
    `https://openweathermap.org/img/wn/${icon}@2x.png`;

  const getDailyForecast = () => {
    if (!forecast) return [];
    const days: { [date: string]: any[] } = {};
    forecast.list.forEach((item: any) => {
      const date = item.dt_txt.split(" ")[0];
      if (!days[date]) days[date] = [];
      days[date].push(item);
    });
    return Object.keys(days).map((date) => {
      const noon = days[date].find((item) => item.dt_txt.includes("12:00:00"));
      return noon || days[date][0];
    });
  };

  const router = useRouter();
  const flatListRef = useRef<FlatList>(null);

  if (savedCities.length === 0) {
    return (
      <View style={styles.emptyStateContainer}>
        <LottieView
          source={require("@/components/Empty box by partho.json")}
          autoPlay
          loop
          style={styles.lottieAnimation}
        />
        <Text style={styles.emptyStateTitle}>No Cities Added</Text>
        <Text style={styles.emptyStateSubtitle}>
          Add a city to see weather information
        </Text>
        <TouchableOpacity
          style={styles.fab}
          onPress={() => router.push("/(tabs)/add")}
          activeOpacity={0.7}
        >
          <Ionicons name="add" size={32} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.container}>
        <FlatList
          ref={flatListRef}
          data={cityWeather.filter((item) => item !== null)}
          keyExtractor={(item, idx) => `${item?.name || "city"}-${idx}`}
          renderItem={renderWeatherItem}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
          onScroll={(e) => {
            const index = Math.round(e.nativeEvent.contentOffset.x / width);
            setSelectedIndex(index);
          }}
          scrollEventThrottle={16}
          style={{ flex: 1 }}
        />
        <View style={styles.paginationContainer}>
          {cityWeather
            .filter((item) => item !== null)
            .map((item, idx) => {
              const scale = dotAnimations[idx]?.interpolate({
                inputRange: [0, 1],
                outputRange: [0.8, 1.2],
              });
              const opacity = dotAnimations[idx]?.interpolate({
                inputRange: [0, 1],
                outputRange: [0.6, 1],
              });
              const backgroundColor = dotAnimations[idx]?.interpolate({
                inputRange: [0, 1],
                outputRange: ["#D1D5DB", "#FF0000"],
              });

              return (
                <Animated.View
                  key={`${item?.name || "city"}-${idx}`}
                  style={[
                    styles.paginationDot,
                    {
                      transform: scale ? [{ scale }] : [],
                      opacity: opacity || 1,
                      backgroundColor: backgroundColor || "#D1D5DB",
                    },
                  ]}
                />
              );
            })}
        </View>
      </View>

      {loading && <Loading />}

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push("/(tabs)/add")}
        activeOpacity={0.7}
      >
        <Ionicons name="add" size={32} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  currentWeather: {
    backgroundColor: "#E5E4E2",
    borderRadius: 16,
    padding: 24,
    marginTop: 32,
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    zIndex: 2,
    position: "relative",
  },
  headerSection: {
    alignItems: "center",
    marginBottom: 24,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  cityName: {
    fontSize: 30,
    fontWeight: "700",
    color: "#000000",
    marginBottom: 4,
    textAlign: "center",
  },
  countryName: {
    fontSize: 16,
    color: "#6B7280",
    marginBottom: 16,
    fontWeight: "500",
  },
  mainTempSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  mainIcon: {
    width: 80,
    height: 80,
    marginRight: 12,
  },
  mainTemp: {
    fontSize: 48,
    fontWeight: "700",
    color: "#FF0000",
  },
  feelsLike: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
    textAlign: "center",
    marginBottom: 8,
  },
  description: {
    fontSize: 18,
    textTransform: "capitalize",
    color: "#6B7280",
    fontWeight: "500",
    textAlign: "center",
  },
  dataGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },
  fullWidthContainer: {
    width: "100%",
    marginBottom: 12,
  },
  dataItem: {
    width: "48%",
    backgroundColor: "#000000",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FFFFFF",
  },
  dataIcon: {
    marginBottom: 8,
  },
  dataTitle: {
    fontSize: 12,
    color: "#D1D5DB",
    marginBottom: 4,
    textAlign: "center",
    fontWeight: "600",
  },
  dataValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
    textAlign: "center",
  },
  errorContainer: {
    padding: 12,
    backgroundColor: "#FEE2E2",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#FECACA",
    marginHorizontal: 16,
    marginTop: 16,
  },
  errorText: {
    fontSize: 18,
    color: "#FF0000",
    textAlign: "center",
    fontWeight: "500",
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 24,
    backgroundColor: "#FF0000",
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#B91C1C",
    zIndex: 10,
    elevation: 8,
  },
  paginationContainer: {
    position: "absolute",
    bottom: 8,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
    paddingVertical: 8,
    zIndex: 5,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: "#D1D5DB",
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 32,
  },
  lottieAnimation: {
    width: 240,
    height: 240,
    marginBottom: 24,
  },
  emptyStateTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#000000",
    marginBottom: 12,
    textAlign: "center",
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 32,
  },
});