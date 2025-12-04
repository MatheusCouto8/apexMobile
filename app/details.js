import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, StatusBar } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState, useEffect } from 'react';

export default function DetailsScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const [weatherDetails, setWeatherDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  // Coordenadas das cidades
  const cityCoordinates = {
    'Valinhos': { lat: -22.97, lon: -46.99 },
    'Campinas': { lat: -22.91, lon: -47.06 },
    'São Paulo': { lat: -23.55, lon: -46.63 },
    'Brasília': { lat: -15.79, lon: -47.89 }
  };

  useEffect(() => {
    if (params.cityName) {
      fetchWeatherDetails();
    }
  }, [params.cityName]);

  const fetchWeatherDetails = async () => {
    try {
      // Tentar usar coordenadas dos parâmetros primeiro, senão usar do dicionário
      let coords;
      if (params.lat && params.lon) {
        coords = { lat: parseFloat(params.lat), lon: parseFloat(params.lon) };
      } else {
        coords = cityCoordinates[params.cityName];
      }
      
      if (!coords) return;

      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current_weather=true&hourly=temperature_2m,weathercode&timezone=America/Sao_Paulo&forecast_days=1`
      );
      const data = await response.json();
      
      // Pegar apenas as próximas 7 horas a partir da hora atual
      const currentHour = new Date().getHours();
      const hourlyData = data.hourly.time.slice(currentHour, currentHour + 7).map((time, index) => ({
        time: new Date(time).getHours(),
        temperature: Math.round(data.hourly.temperature_2m[currentHour + index]),
        weatherCode: data.hourly.weathercode[currentHour + index]
      }));

      setWeatherDetails({
        current: {
          temperature: Math.round(data.current_weather.temperature),
          weatherCode: data.current_weather.weathercode,
          windSpeed: data.current_weather.windspeed
        },
        hourly: hourlyData,
        daily: {
          maxTemp: Math.round(Math.max(...data.hourly.temperature_2m)),
          minTemp: Math.round(Math.min(...data.hourly.temperature_2m))
        }
      });
      setLoading(false);
    } catch (error) {
      console.error('Erro ao buscar detalhes do clima:', error);
      setLoading(false);
    }
  };

  const getWeatherIcon = (weatherCode) => {
    if (weatherCode === 0) return 'sunny-outline';
    if (weatherCode >= 1 && weatherCode <= 3) return 'partly-sunny-outline';
    if (weatherCode >= 45 && weatherCode <= 48) return 'cloud-outline';
    if (weatherCode >= 51 && weatherCode <= 67) return 'rainy-outline';
    if (weatherCode >= 71 && weatherCode <= 77) return 'snow-outline';
    if (weatherCode >= 80 && weatherCode <= 82) return 'rainy-outline';
    if (weatherCode >= 95 && weatherCode <= 99) return 'thunderstorm-outline';
    return 'cloud-outline';
  };

  const getWeatherDescription = (weatherCode) => {
    if (weatherCode === 0) return 'Ensolarado';
    if (weatherCode >= 1 && weatherCode <= 3) return 'Parcialmente Nublado';
    if (weatherCode >= 45 && weatherCode <= 48) return 'Com Neblina';
    if (weatherCode >= 51 && weatherCode <= 67) return 'Chuvoso';
    if (weatherCode >= 71 && weatherCode <= 77) return 'Com Neve';
    if (weatherCode >= 80 && weatherCode <= 82) return 'Com Chuvas';
    if (weatherCode >= 95 && weatherCode <= 99) return 'Com Tempestade';
    return 'Nublado';
  };

  if (loading || !weatherDetails) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#0F1113" />
        <LinearGradient
          colors={['#0F1113', '#1A1E23']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.loadingContainer}
        >
          <Ionicons name="hourglass" size={50} color="#60D7E9" />
          <Text style={styles.loadingText}>Carregando detalhes...</Text>
        </LinearGradient>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <StatusBar barStyle="light-content" backgroundColor="#0F1113" />
      
      {/* Header Premium */}
      <LinearGradient
        colors={['#0F1113', '#1A1E23']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <TouchableOpacity 
          onPress={() => router.back()} 
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#60D7E9" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.cityName}>{params.cityName}</Text>
            <Text style={styles.headerSubtitle}>Detalhes do clima</Text>
          </View>
        </View>
        <View style={{ width: 24 }} />
      </LinearGradient>

      {/* CARD PRINCIPAL */}
      <View style={styles.contentPadding}>
      <LinearGradient
        colors={["#60D7E9", "#2A91D4"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.mainCard}
      >
        <View>
          <Text style={styles.city}>{params.cityName}</Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={styles.temperature}>{weatherDetails.current.temperature}°</Text>
            <Text style={styles.weatherDesc}>{getWeatherDescription(weatherDetails.current.weatherCode)}</Text>
          </View>
        </View>

        <Ionicons 
          name={getWeatherIcon(weatherDetails.current.weatherCode)} 
          size={50} 
          color="#fff" 
          style={{ marginTop: 10 }} 
        />

        <Text style={styles.minmax}>
          Máx: {weatherDetails.daily.maxTemp}°  Min: {weatherDetails.daily.minTemp}°
        </Text>
      </LinearGradient>

      {/* CARD HORA EM HORA */}
      <LinearGradient
        colors={["#60D7E9", "#2A91D4"]}
        style={styles.hourCard}
      >
        <Text style={styles.alertText}>
          Previsão de condições quentes por volta das 14:00. As rajadas de vento
          estão a {Math.round(weatherDetails.current.windSpeed)} km/h.
        </Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginTop: 15 }}
        >
          {weatherDetails.hourly.map((item, index) => (
            <View key={index} style={styles.hourItem}>
              <Ionicons
                name={getWeatherIcon(item.weatherCode)}
                size={26}
                color="#fff"
                style={{ marginBottom: 4 }}
              />
              <Text style={styles.hour}>{index === 0 ? 'Agora' : item.time}</Text>
              <Text style={styles.temp}>{item.temperature}°</Text>
            </View>
          ))}
        </ScrollView>
      </LinearGradient>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F1113",
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(96, 215, 233, 0.1)',
  },
  backButton: {
    padding: 8,
  },
  headerContent: {
    flex: 1,
    marginLeft: 12,
  },
  cityName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#F3F4F6',
    letterSpacing: 0.3,
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
  },
  contentPadding: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    color: '#D1D5DB',
    fontSize: 16,
    fontWeight: '500',
    letterSpacing: 0.3,
  },

  mainCard: {
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#60D7E9',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  city: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  temperature: {
    fontSize: 56,
    color: "#fff",
    fontWeight: "700",
    letterSpacing: 2,
  },
  weatherDesc: {
    color: "#fff",
    marginLeft: 16,
    fontSize: 14,
    fontWeight: '600',
  },
  minmax: {
    marginTop: 16,
    color: "#fff",
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.3,
  },

  hourCard: {
    width: "90%",
    alignSelf: "center",
    borderRadius: 18,
    padding: 15,
    marginBottom: 30,
  },

  alertText: {
    color: "#fff",
    fontSize: 13,
  },

  hourItem: {
    width: 55,
    alignItems: "center",
    marginRight: 15,
  },

  hour: {
    color: "#fff",
    fontSize: 13,
  },

  temp: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});