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
      
      {/* Header Premium com Logo */}
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
          <Image source={require('./logo-apex.jpg')} style={styles.logo} />
        </View>
        <View style={{ width: 24 }} />
      </LinearGradient>

      <View style={styles.contentPadding}>
        
        {/* CARD PRINCIPAL - Temperatura Atual */}
        <LinearGradient
          colors={["#60D7E9", "#2A91D4"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.mainCard}
        >
          <View style={styles.mainCardContent}>
            <View style={styles.tempSection}>
              <Ionicons 
                name={getWeatherIcon(weatherDetails.current.weatherCode)} 
                size={80} 
                color="#fff" 
              />
              <View style={styles.tempInfo}>
                <Text style={styles.temperature}>{weatherDetails.current.temperature}°</Text>
                <Text style={styles.weatherDesc}>{getWeatherDescription(weatherDetails.current.weatherCode)}</Text>
              </View>
            </View>
            
            <View style={styles.tempRangeContainer}>
              <View style={styles.tempRangeItem}>
                <Ionicons name="arrow-up" size={18} color="#fff" />
                <Text style={styles.tempRangeLabel}>Máx</Text>
                <Text style={styles.tempRangeValue}>{weatherDetails.daily.maxTemp}°</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.tempRangeItem}>
                <Ionicons name="arrow-down" size={18} color="#fff" />
                <Text style={styles.tempRangeLabel}>Mín</Text>
                <Text style={styles.tempRangeValue}>{weatherDetails.daily.minTemp}°</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.tempRangeItem}>
                <Ionicons name="speedometer-outline" size={18} color="#fff" />
                <Text style={styles.tempRangeLabel}>Vento</Text>
                <Text style={styles.tempRangeValue}>{Math.round(weatherDetails.current.windSpeed)} km/h</Text>
              </View>
            </View>
          </View>
        </LinearGradient>

        {/* CARD PREVISÃO HORÁRIA */}
        <View style={styles.sectionHeader}>
          <Ionicons name="time-outline" size={20} color="#60D7E9" />
          <Text style={styles.sectionTitle}>Previsão por Hora</Text>
        </View>

        <LinearGradient
          colors={["#60D7E9", "#2A91D4"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hourCard}
        >
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.hourlyScroll}
          >
            {weatherDetails.hourly.map((item, index) => (
              <View key={index} style={[styles.hourItem, index === 0 && styles.hourItemActive]}>
                <Text style={styles.hourLabel}>{index === 0 ? 'Agora' : `${item.time}h`}</Text>
                <Ionicons
                  name={getWeatherIcon(item.weatherCode)}
                  size={32}
                  color="#fff"
                  style={styles.hourIcon}
                />
                <Text style={styles.hourTemp}>{item.temperature}°</Text>
              </View>
            ))}
          </ScrollView>
        </LinearGradient>

        {/* INFORMAÇÕES ADICIONAIS */}
        <View style={styles.sectionHeader}>
          <Ionicons name="information-circle-outline" size={20} color="#60D7E9" />
          <Text style={styles.sectionTitle}>Informações Adicionais</Text>
        </View>

        <View style={styles.infoGrid}>
          <LinearGradient
            colors={["#1E2328", "#252B31"]}
            style={styles.infoCard}
          >
            <View style={styles.infoIconContainer}>
              <Ionicons name="water-outline" size={24} color="#60D7E9" />
            </View>
            <Text style={styles.infoLabel}>Sensação Térmica</Text>
            <Text style={styles.infoValue}>{weatherDetails.current.temperature}°</Text>
          </LinearGradient>

          <LinearGradient
            colors={["#1E2328", "#252B31"]}
            style={styles.infoCard}
          >
            <View style={styles.infoIconContainer}>
              <Ionicons name="eye-outline" size={24} color="#60D7E9" />
            </View>
            <Text style={styles.infoLabel}>Visibilidade</Text>
            <Text style={styles.infoValue}>10 km</Text>
          </LinearGradient>

          <LinearGradient
            colors={["#1E2328", "#252B31"]}
            style={styles.infoCard}
          >
            <View style={styles.infoIconContainer}>
              <Ionicons name="compass-outline" size={24} color="#60D7E9" />
            </View>
            <Text style={styles.infoLabel}>Pressão</Text>
            <Text style={styles.infoValue}>1013 hPa</Text>
          </LinearGradient>

          <LinearGradient
            colors={["#1E2328", "#252B31"]}
            style={styles.infoCard}
          >
            <View style={styles.infoIconContainer}>
              <Ionicons name="rainy-outline" size={24} color="#60D7E9" />
            </View>
            <Text style={styles.infoLabel}>Umidade</Text>
            <Text style={styles.infoValue}>65%</Text>
          </LinearGradient>
        </View>

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
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  contentPadding: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 30,
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

  // Card Principal
  mainCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#60D7E9',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  mainCardContent: {
    gap: 20,
  },
  tempSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  tempInfo: {
    flex: 1,
  },
  temperature: {
    fontSize: 64,
    color: "#fff",
    fontWeight: "700",
    letterSpacing: -2,
    lineHeight: 68,
  },
  weatherDesc: {
    color: "#fff",
    fontSize: 16,
    fontWeight: '600',
    marginTop: 4,
    letterSpacing: 0.3,
  },
  tempRangeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  tempRangeItem: {
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  tempRangeLabel: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  tempRangeValue: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  divider: {
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginVertical: 4,
  },

  // Seção
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#F3F4F6',
    letterSpacing: 0.3,
  },

  // Card Horário
  hourCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#60D7E9',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  hourlyScroll: {
    paddingVertical: 4,
    gap: 12,
  },
  hourItem: {
    alignItems: "center",
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    minWidth: 70,
    gap: 8,
  },
  hourItemActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  hourLabel: {
    color: "#fff",
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  hourIcon: {
    marginVertical: 4,
  },
  hourTemp: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },

  // Grid de Informações
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  infoCard: {
    flex: 1,
    minWidth: '47%',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(96, 215, 233, 0.2)',
  },
  infoIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(96, 215, 233, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoLabel: {
    color: '#9CA3AF',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  infoValue: {
    color: '#F3F4F6',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});