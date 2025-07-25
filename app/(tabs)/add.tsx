import { useSavedCities } from "@/components/SavedCitiesContext";
import {
  fetchCitySuggestions,
  fetchCurrentWeather,
} from "@/components/weatherApi";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function AddCityScreen() {
  const router = useRouter();
  const { savedCities, addCity, removeCity } = useSavedCities();
  const [addCitySearch, setAddCitySearch] = useState("");
  const [addCityError, setAddCityError] = useState("");
  const [addCityLoading, setAddCityLoading] = useState(false);
  const [citySuggestions, setCitySuggestions] = useState<any[]>([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const [cityTemps, setCityTemps] = useState<{ [city: string]: number | null }>(
    {}
  );
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleAddCity = async () => {
    if (!addCitySearch) return;
    setAddCityLoading(true);
    setAddCityError("");
    try {
      await fetchCurrentWeather(addCitySearch);
      addCity(addCitySearch);
      setAddCitySearch("");
      setCitySuggestions([]);
      router.back();
    } catch {
      setAddCityError("City not found");
    } finally {
      setAddCityLoading(false);
    }
  };

  const handleRemoveCity = (city: string) => {
    Alert.alert("Remove City", `Remove ${city} from saved cities?`, [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Remove",
        style: "destructive",
        onPress: () => removeCity(city),
      },
    ]);
  };

  const handleCityInputChange = (text: string) => {
    setAddCitySearch(text);
    setAddCityError("");
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    if (text.length < 2) {
      setCitySuggestions([]);
      return;
    }
    setSuggestionsLoading(true);
    debounceTimeout.current = setTimeout(async () => {
      try {
        const suggestions = await fetchCitySuggestions(text);
        setCitySuggestions(suggestions);
      } catch {
        setCitySuggestions([]);
      } finally {
        setSuggestionsLoading(false);
      }
    }, 400) as unknown as NodeJS.Timeout;
  };

  const handleSuggestionPress = (item: any) => {
    setAddCitySearch(item.name);
    setCitySuggestions([]);
  };

  useEffect(() => {
    async function fetchTemps() {
      const temps: { [city: string]: number | null } = {};
      
      try {
        await Promise.all(
          savedCities.map(async (city: string) => {
            try {
              const data = await fetchCurrentWeather(city);
              temps[city] = data.main?.temp ?? null;
            } catch (error) {
              console.warn(`Failed to fetch temperature for ${city}:`, error);
              temps[city] = null;
            }
          })
        );
      } catch (error) {
        console.error('Failed to fetch temperatures:', error);
      }
      
      setCityTemps(temps);
    }

    if (savedCities.length > 0) fetchTemps();
  }, [savedCities]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backBtn}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={28} color="#FF0000" />
        </TouchableOpacity>
        <Text style={styles.title}>Add New City</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.searchSection}>
          <View style={styles.inputContainer}>
            <Ionicons
              name="search"
              size={20}
              color="#666"
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Search for a city..."
              placeholderTextColor="#999"
              value={addCitySearch}
              onChangeText={handleCityInputChange}
              onSubmitEditing={handleAddCity}
              returnKeyType="search"
              autoFocus
            />
            {addCitySearch.length > 0 && (
              <TouchableOpacity
                onPress={() => setAddCitySearch("")}
                style={styles.clearBtn}
              >
                <Ionicons name="close-circle" size={20} color="#999" />
              </TouchableOpacity>
            )}
          </View>

          {suggestionsLoading && (
            <ActivityIndicator
              size="small"
              color="#FF0000"
              style={styles.loadingIndicator}
            />
          )}

          {citySuggestions.length > 0 && (
            <View style={styles.suggestionList}>
              <FlatList
                data={citySuggestions}
                keyExtractor={(item, idx) => `${item.name}-${item.country}-${idx}`}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => handleSuggestionPress(item)}
                    style={styles.suggestionItem}
                    activeOpacity={0.6}
                  >
                    <Text style={styles.suggestionText}>
                      {item.name}
                      {item.state ? `, ${item.state}` : ""}, {item.country}
                    </Text>
                    <Ionicons name="chevron-forward" size={18} color="#999" />
                  </TouchableOpacity>
                )}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
              />
            </View>
          )}

          <TouchableOpacity
            onPress={handleAddCity}
            style={styles.addButton}
            disabled={addCityLoading || !addCitySearch}
            activeOpacity={0.7}
          >
            {addCityLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.addButtonText}>Add City</Text>
            )}
          </TouchableOpacity>

          {addCityError && (
            <View style={styles.errorContainer}>
              <Ionicons name="warning" size={18} color="#FF0000" />
              <Text style={styles.errorText}>{addCityError}</Text>
            </View>
          )}
        </View>

        <View style={styles.savedCitiesSection}>
          <Text style={styles.sectionTitle}>Your Saved Cities</Text>

          {savedCities.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="location-outline" size={40} color="#ccc" />
              <Text style={styles.emptyStateText}>No cities saved yet</Text>
            </View>
          ) : (
            <FlatList
              data={savedCities}
              keyExtractor={(city) => city}
              renderItem={({ item: city }) => {
                const tempValue = cityTemps[city];
                
                return (
                  <TouchableOpacity
                    style={styles.cityItem}
                    onLongPress={() => handleRemoveCity(city)}
                    activeOpacity={0.7}
                  >
                    <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
                      <Ionicons name="location" size={20} color="#000" />
                      <Text style={styles.cityName}>{city}</Text>
                    </View>

                    <View style={{ marginLeft: 8 }}>
                      {tempValue === undefined ? (
                        <ActivityIndicator size="small" color="#FF0000" />
                      ) : (
                        <Text style={styles.tempText}>
                          {tempValue === null ? "N/A" : `${Math.round(tempValue)}°C`}
                        </Text>
                      )}
                    </View>
                  </TouchableOpacity>
                );
              }}
            />
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    paddingTop: 50,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  backBtn: {
    marginRight: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    color: "#333",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  searchSection: {
    marginBottom: 24,
  },
  inputContainer: {
    marginTop: 16,
    marginLeft: 16,
    marginRight: 16,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 52,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: "100%",
    fontSize: 16,
    color: "#333",
  },
  clearBtn: {
    padding: 4,
  },
  loadingIndicator: {
    marginTop: 8,
  },
  suggestionList: {
    marginLeft: 16,
    marginRight: 16,
    marginTop: 8,
    backgroundColor: "#fff",
    borderRadius: 12,
    maxHeight: 200,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  suggestionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  suggestionText: {
    fontSize: 16,
    color: "#333",
  },
  separator: {
    height: 1,
    backgroundColor: "#f0f0f0",
    marginHorizontal: 16,
  },
  addButton: {
    marginLeft: 16,
    marginRight: 16,
    marginTop: 16,
    backgroundColor: "#000000",
    borderRadius: 25,
    height: 52,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#FF0000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    padding: 12,
    backgroundColor: "#FFEBEE",
    borderRadius: 8,
  },
  errorText: {
    color: "#FF0000",
    marginLeft: 8,
    fontSize: 14,
  },
  savedCitiesSection: {
    marginTop: 16,
    marginLeft: 16,
    marginRight: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 16,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
  },
  emptyStateText: {
    marginTop: 8,
    color: "#999",
    fontSize: 16,
  },
  cityItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  cityName: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: "#333",
  },
  tempText: {
    marginLeft: 8,
    color: "#FF0000",
    fontWeight: "700",
  },
});