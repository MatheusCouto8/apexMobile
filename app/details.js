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
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F1113" />
      
      {/* Header com botão de voltar e logo */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => router.back()} 
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color="#60D7E9" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <TouchableOpacity onPress={() => router.push('/(tabs)/home')} activeOpacity={0.7}>
            <Image source={require('./logo-apex.jpg')} style={styles.logo} />
          </TouchableOpacity>
        </View>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>

      <View style={styles.contentPadding}>
        
        {/* Informação da cidade */}
        <View style={styles.cityHeader}>
          <Text style={styles.cityName}>{params.cityName}</Text>
          <View style={styles.weatherBadge}>
            <Ionicons 
              name={getWeatherIcon(weatherDetails.current.weatherCode)} 
              size={16} 
              color="#60D7E9" 
            />
            <Text style={styles.weatherBadgeText}>{getWeatherDescription(weatherDetails.current.weatherCode)}</Text>
          </View>
        </View>

        {/* CARD PRINCIPAL - Temperatura Atual */}
        <View style={styles.mainCard}>
          <Text style={styles.temperature}>{weatherDetails.current.temperature}°</Text>
          <Text style={styles.tempLabel}>Temperatura atual</Text>
          
          <View style={styles.tempStats}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{weatherDetails.daily.maxTemp}°</Text>
              <Text style={styles.statLabel}>Máxima</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{weatherDetails.daily.minTemp}°</Text>
              <Text style={styles.statLabel}>Mínima</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{Math.round(weatherDetails.current.windSpeed)}</Text>
              <Text style={styles.statLabel}>Vento km/h</Text>
            </View>
          </View>
        </View>

        {/* PREVISÃO HORÁRIA */}
        <Text style={styles.sectionTitle}>Próximas Horas</Text>

        <View style={styles.hourCard}>
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
        </View>

      </View>

    </ScrollView>
    </View>
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
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 20,
    backgroundColor: '#0F1113',
  },
  backButton: {
    padding: 8,
    width: 40,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  logo: {
    width: 65,
    height: 65,
    borderRadius: 32.5,
  },
  scrollContent: {
    flex: 1,
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

  // Header da Cidade
  cityHeader: {
    marginBottom: 24,
  },
  cityName: {
    fontSize: 32,
    fontWeight: '700',
    color: '#F3F4F6',
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  weatherBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(96, 215, 233, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(96, 215, 233, 0.2)',
  },
  weatherBadgeText: {
    fontSize: 13,
    color: '#60D7E9',
    fontWeight: '600',
  },

  // Card Principal
  mainCard: {
    backgroundColor: '#1A1E23',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#2A2F35',
    alignItems: 'center',
  },
  temperature: {
    fontSize: 72,
    color: "#F3F4F6",
    fontWeight: "700",
    letterSpacing: -2,
  },
  tempLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
    marginTop: 4,
    marginBottom: 20,
  },
  tempStats: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#2A2F35',
  },
  statItem: {
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    fontSize: 20,
    color: '#F3F4F6',
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '500',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#2A2F35',
  },

  // Seção
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#F3F4F6',
    letterSpacing: 0.3,
    marginBottom: 16,
  },

  // Card Horário
  hourCard: {
    backgroundColor: '#1A1E23',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#2A2F35',
  },
  hourlyScroll: {
    paddingVertical: 4,
    gap: 10,
  },
  hourItem: {
    alignItems: "center",
    backgroundColor: 'rgba(96, 215, 233, 0.05)',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 12,
    minWidth: 65,
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(96, 215, 233, 0.1)',
  },
  hourItemActive: {
    backgroundColor: 'rgba(96, 215, 233, 0.15)',
    borderColor: 'rgba(96, 215, 233, 0.3)',
  },
  hourLabel: {
    color: "#9CA3AF",
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  hourIcon: {
    marginVertical: 2,
  },
  hourTemp: {
    color: "#F3F4F6",
    fontSize: 16,
    fontWeight: "700",
  },
});