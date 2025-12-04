import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar, Image, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

// Componente premium para card com gradiente
const PremiumCard = ({ children, style }) => (
  <View style={[styles.cardWrapper, style]}>
    <LinearGradient
      colors={["#60D7E9", "#2A91D4"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.cardContainer}
    >
      <View style={styles.cardContent}>
        {children}
      </View>
    </LinearGradient>
  </View>
);

export default function HomeScreen() {
  const router = useRouter();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [weatherData, setWeatherData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [todayWeather, setTodayWeather] = useState(null);
  const [cities, setCities] = useState([]);

  // Carregar cidades do AsyncStorage quando a tela ganha foco
  useFocusEffect(
    React.useCallback(() => {
      loadCities();
    }, [])
  );

  const loadCities = async () => {
    try {
      const savedCities = await AsyncStorage.getItem('cities');
      if (savedCities) {
        const parsedCities = JSON.parse(savedCities);
        setCities(parsedCities);
      }
    } catch (error) {
      console.error('Erro ao carregar cidades:', error);
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (cities.length > 0) {
      fetchWeatherData();
    }
  }, [cities]);

  const fetchWeatherData = async () => {
    try {
      // Buscar clima da primeira cidade (Valinhos) para exibir na mensagem principal
      const mainWeatherResponse = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=-22.97&longitude=-46.99&current_weather=true`
      );
      const mainWeatherData = await mainWeatherResponse.json();
      setTodayWeather({
        weatherCode: mainWeatherData.current_weather.weathercode
      });

      // Buscar clima de todas as cidades para o carrossel
      const weatherPromises = cities.map(async (city) => {
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&current_weather=true`
        );
        const data = await response.json();
        return {
          name: city.name,
          temperature: Math.round(data.current_weather.temperature),
          weatherCode: data.current_weather.weathercode,
          windSpeed: data.current_weather.windspeed,
          lat: city.lat,
          lon: city.lon
        };
      });

      const results = await Promise.all(weatherPromises);
      setWeatherData(results);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao buscar dados do clima:', error);
      setLoading(false);
    }
  };

  const getCurrentDate = () => {
    return currentTime.toLocaleDateString('pt-BR');
  };

  const getCurrentTime = () => {
    return currentTime.toLocaleTimeString('pt-BR');
  };

  const getWeatherIcon = (weatherCode) => {
    // Códigos do Open Meteo para diferentes condições climáticas
    if (weatherCode === 0) return 'sunny'; // Clear sky
    if (weatherCode >= 1 && weatherCode <= 3) return 'partly-sunny'; // Partly cloudy
    if (weatherCode >= 45 && weatherCode <= 48) return 'cloudy'; // Fog
    if (weatherCode >= 51 && weatherCode <= 67) return 'rainy'; // Rain
    if (weatherCode >= 71 && weatherCode <= 77) return 'snow'; // Snow
    if (weatherCode >= 80 && weatherCode <= 82) return 'rainy'; // Rain showers
    if (weatherCode >= 95 && weatherCode <= 99) return 'thunderstorm'; // Thunderstorm
    return 'cloudy'; // Default
  };

  const getWeatherDescription = (weatherCode) => {
    if (weatherCode === 0) return 'ensolarado';
    if (weatherCode >= 1 && weatherCode <= 3) return 'parcialmente nublado';
    if (weatherCode >= 45 && weatherCode <= 48) return 'com neblina';
    if (weatherCode >= 51 && weatherCode <= 67) return 'chuvoso';
    if (weatherCode >= 71 && weatherCode <= 77) return 'com neve';
    if (weatherCode >= 80 && weatherCode <= 82) return 'com chuvas';
    if (weatherCode >= 95 && weatherCode <= 99) return 'com tempestade';
    return 'nublado';
  };

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour >= 5 && hour < 12) return 'Bom dia';
    if (hour >= 12 && hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F1113" />
      
      {/* Header Premium */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Image source={require('../logo-apex.jpg')} style={styles.logo} />
        </View>
      </View>

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Saudação Elegante */}
        <View style={styles.greetingSection}>
          <Text style={styles.greeting}>{getGreeting()}! 👋</Text>
          <View style={styles.weatherDescriptionBox}>
            <Ionicons 
              name={todayWeather ? getWeatherIcon(todayWeather.weatherCode) : 'cloudy'} 
              size={20} 
              color="#60D7E9" 
            />
            <Text style={styles.subGreeting}>
              {todayWeather 
                ? `Hoje será ${getWeatherDescription(todayWeather.weatherCode)}`
                : 'Carregando informações do clima...'
              }
            </Text>
          </View>
        </View>

        {/* Seção de Relógio Digital Premium */}
        <LinearGradient
          colors={['rgba(96, 215, 233, 0.1)', 'rgba(42, 145, 212, 0.1)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.clockContainer}
        >
          <View style={styles.clockContent}>
            <Text style={styles.time}>{getCurrentTime()}</Text>
            <View style={styles.dateWrapper}>
              <Ionicons name="calendar-outline" size={14} color="#60D7E9" />
              <Text style={styles.date}>{getCurrentDate()}</Text>
            </View>
          </View>
          <View style={styles.clockDecoration} />
        </LinearGradient>

        {/* Título do Carrossel */}
        <View style={styles.carouselHeaderSection}>
          <View style={styles.carouselHeader}>
            <Ionicons name="location" size={20} color="#60D7E9" />
            <Text style={styles.carouselTitle}>Cidades</Text>
          </View>
          <Text style={styles.carouselSubtitle}>Deslize para mais informações</Text>
        </View>

        {/* Cards de clima - Carrossel Elegante */}
        <View style={styles.carouselWrapper}>
          <FlatList
            data={loading ? cities : weatherData}
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={235}
            snapToAlignment="center"
            decelerationRate="fast"
            contentContainerStyle={styles.weatherCarousel}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => (
              loading ? (
                <PremiumCard key={index} style={styles.weatherCard}>
                  <Text style={styles.cityName}>{item.name}</Text>
                  <View style={styles.weatherInfoBottom}>
                    <Ionicons name="hourglass" size={32} color="#FFFFFF" />
                    <Text style={styles.temperature}>--°</Text>
                  </View>
                </PremiumCard>
              ) : (
                <TouchableOpacity
                  key={index}
                  onPress={() => router.push({
                    pathname: '/details',
                    params: {
                      cityName: item.name,
                      temperature: item.temperature,
                      weatherCode: item.weatherCode,
                      lat: item.lat,
                      lon: item.lon
                    }
                  })}
                  activeOpacity={0.8}
                  style={styles.cardTouchable}
                >
                  <PremiumCard style={styles.weatherCard}>
                    <Text style={styles.cityName}>{item.name}</Text>
                    <View style={styles.weatherInfoBottom}>
                      <Ionicons 
                        name={getWeatherIcon(item.weatherCode)} 
                        size={32} 
                        color="#FFFFFF" 
                      />
                      <Text style={styles.temperature}>{item.temperature}°</Text>
                    </View>
                  </PremiumCard>
                </TouchableOpacity>
              )
            )}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F1113',
  },
  header: {
    paddingTop: 85,
    paddingBottom: 24,
    paddingHorizontal: 20,
    backgroundColor: '#0F1113',
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 65,
    height: 65,
    borderRadius: 32.5,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  greetingSection: {
    marginTop: 28,
    marginBottom: 28,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '700',
    color: '#F3F4F6',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  weatherDescriptionBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: 'rgba(96, 215, 233, 0.08)',
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#60D7E9',
  },
  subGreeting: {
    fontSize: 14,
    color: '#D1D5DB',
    fontWeight: '500',
  },
  clockContainer: {
    marginBottom: 32,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(96, 215, 233, 0.2)',
    overflow: 'hidden',
    shadowColor: '#60D7E9',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  clockContent: {
    paddingVertical: 24,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  time: {
    fontSize: 54,
    fontWeight: '200',
    color: '#F3F4F6',
    letterSpacing: 2,
    marginBottom: 12,
  },
  dateWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(96, 215, 233, 0.12)',
    borderRadius: 8,
  },
  date: {
    fontSize: 13,
    color: '#D1D5DB',
    fontWeight: '500',
    letterSpacing: 0.3,
  },
  clockDecoration: {
    height: 2,
    backgroundColor: 'rgba(96, 215, 233, 0.3)',
  },
  carouselHeaderSection: {
    marginBottom: 20,
  },
  carouselHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 6,
  },
  carouselTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#F3F4F6',
    letterSpacing: 0.3,
  },
  carouselSubtitle: {
    fontSize: 12,
    color: '#9CA3AF',
    marginLeft: 30,
    letterSpacing: 0.2,
  },
  carouselWrapper: {
    marginBottom: 32,
    marginLeft: -20,
    marginRight: -20,
  },
  weatherCarousel: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  cardTouchable: {
    marginRight: 15,
  },
  weatherCard: {
    width: 200,
    height: 160,
    borderRadius: 18,
    overflow: 'hidden',
    shadowColor: '#60D7E9',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  cardWrapper: {
    borderRadius: 18,
    overflow: 'hidden',
  },
  cardContainer: {
    borderRadius: 18,
    height: '100%',
    overflow: 'hidden',
  },
  cardContent: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  cityName: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '700',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  weatherInfoBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    width: '100%',
  },
  temperature: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
    letterSpacing: 1,
  },
  footerTip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: 'rgba(96, 215, 233, 0.08)',
    borderRadius: 10,
    marginTop: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(96, 215, 233, 0.15)',
  },
  tipText: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
    letterSpacing: 0.2,
  },
});