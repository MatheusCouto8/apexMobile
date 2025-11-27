import { View, Text, StyleSheet, ScrollView, StatusBar, Image, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

// Componente para card com gradiente
const SolidCard = ({ children, style }) => (
  <View style={[styles.cardWrapper, style]}>
    <LinearGradient
      colors={["#60D7E9", "#2A91D4"]}
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

  // Coordenadas das cidades
  const cities = [
    { name: 'Valinhos', lat: -22.97, lon: -46.99 },
    { name: 'Campinas', lat: -22.91, lon: -47.06 },
    { name: 'São Paulo', lat: -23.55, lon: -46.63 },
    { name: 'Brasília', lat: -15.79, lon: -47.89 }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetchWeatherData();
  }, []);

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
          windSpeed: data.current_weather.windspeed
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
      <StatusBar barStyle="light-content" backgroundColor="#2C3E50" />
      
      {/* Header com logo */}
      <View style={styles.header}>
        <Image source={require('../logo-apex.jpg')} style={styles.logo} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Saudação */}
        <View style={styles.greetingSection}>
          <Text style={styles.greeting}>{getGreeting()}!</Text>
          <Text style={styles.subGreeting}>
            {todayWeather 
              ? `Hoje o dia será ${getWeatherDescription(todayWeather.weatherCode)}`
              : 'Carregando informações do clima...'
            }
          </Text>
        </View>

        {/* Cards de clima - Carrossel */}
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
                <SolidCard key={index} style={styles.weatherCard}>
                  <Text style={styles.cityName}>{item.name}</Text>
                  <View style={styles.weatherInfoBottom}>
                    <Ionicons name="hourglass" size={32} color="#FFFFFF" />
                    <Text style={styles.temperature}>--°</Text>
                  </View>
                </SolidCard>
              ) : (
                <TouchableOpacity
                  key={index}
                  onPress={() => router.push({
                    pathname: '/details',
                    params: {
                      cityName: item.name,
                      temperature: item.temperature,
                      weatherCode: item.weatherCode
                    }
                  })}
                  activeOpacity={0.8}
                >
                  <SolidCard style={styles.weatherCard}>
                    <Text style={styles.cityName}>{item.name}</Text>
                    <View style={styles.weatherInfoBottom}>
                      <Ionicons 
                        name={getWeatherIcon(item.weatherCode)} 
                        size={32} 
                        color="#FFFFFF" 
                      />
                      <Text style={styles.temperature}>{item.temperature}°</Text>
                    </View>
                  </SolidCard>
                </TouchableOpacity>
              )
            )}
          />
        </View>

        {/* Relógio central */}
        <View style={styles.clockSection}>
          <Text style={styles.time}>{getCurrentTime()}</Text>
          <Text style={styles.date}>{getCurrentDate()}</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(23, 28, 32, 1)',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    alignItems: 'center',
  },
  logo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3498DB',
    letterSpacing: 2,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  greetingSection: {
    marginBottom: 30,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  subGreeting: {
    fontSize: 16,
    color: '#BDC3C7',
  },
  carouselWrapper: {
    marginBottom: 40,
    marginLeft: -20,
    marginRight: -20,
  },
  weatherCarousel: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  weatherCard: {
    width: 180,
    height: 140,
    marginRight: 15,
  },
  cardWrapper: {
    // Sombra removida
  },
  cardContainer: {
    borderRadius: 20,
    height: '100%',
    overflow: 'hidden',
  },
  cardContent: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 15,
  },
  cityName: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '700',
    letterSpacing: 0.8,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 3,
    alignSelf: 'flex-start',
  },
  weatherInfo: {
    alignItems: 'center',
    gap: 12,
  },
  weatherInfoBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    width: '100%',
  },
  temperature: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.25)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 5,
    letterSpacing: 1.5,
  },
  clockSection: {
    alignItems: 'center',
    marginTop: 30,
  },
  time: {
    fontSize: 48,
    fontWeight: '300',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  date: {
    fontSize: 16,
    color: '#BDC3C7',
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
});