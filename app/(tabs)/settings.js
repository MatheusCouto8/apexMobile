import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput, Modal, Alert, Animated, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect, useRef } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

export default function SettingsScreen() {
  const router = useRouter();
  const [cities, setCities] = useState([]);

  // Carregar cidades do AsyncStorage
  useEffect(() => {
    loadCities();
  }, []);

  const loadCities = async () => {
    try {
      const savedCities = await AsyncStorage.getItem('cities');
      if (savedCities) {
        setCities(JSON.parse(savedCities));
      } else {
        // Cidades padrão
        const defaultCities = [
          { id: 1, name: 'Valinhos', lat: -22.97, lon: -46.99 },
          { id: 2, name: 'Campinas', lat: -22.91, lon: -47.06 },
          { id: 3, name: 'São Paulo', lat: -23.55, lon: -46.63 },
          { id: 4, name: 'Brasília', lat: -15.79, lon: -47.89 }
        ];
        setCities(defaultCities);
        await AsyncStorage.setItem('cities', JSON.stringify(defaultCities));
      }
    } catch (error) {
      console.error('Erro ao carregar cidades:', error);
    }
  };

  const [modalVisible, setModalVisible] = useState(false);
  const [newCityName, setNewCityName] = useState('');
  const [loading, setLoading] = useState(false);
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const listFadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (modalVisible) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      scaleAnim.setValue(0);
      fadeAnim.setValue(0);
    }
  }, [modalVisible]);

  const handleAddCity = async () => {
    if (!newCityName) {
      Alert.alert('Erro', 'Digite o nome da cidade');
      return;
    }

    setLoading(true);

    try {
      // Buscar coordenadas usando a API de geocoding do Open-Meteo
      const geocodeResponse = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(newCityName)}&count=1&language=pt&format=json`
      );
      const geocodeData = await geocodeResponse.json();

      if (!geocodeData.results || geocodeData.results.length === 0) {
        Alert.alert('Erro', 'Cidade não encontrada. Tente outro nome.');
        setLoading(false);
        return;
      }

      const cityData = geocodeData.results[0];

      const newCity = {
        id: Date.now(),
        name: cityData.name,
        lat: cityData.latitude,
        lon: cityData.longitude
      };

      const updatedCities = [...cities, newCity];
      setCities(updatedCities);
      await AsyncStorage.setItem('cities', JSON.stringify(updatedCities));
      setModalVisible(false);
      setNewCityName('');
      setLoading(false);
      Alert.alert('Sucesso', `${cityData.name} adicionada com sucesso!`);
    } catch (error) {
      console.error('Erro ao buscar coordenadas:', error);
      Alert.alert('Erro', 'Não foi possível adicionar a cidade. Tente novamente.');
      setLoading(false);
    }
  };

  const handleRemoveCity = async (cityId) => {
    try {
      const updatedCities = cities.filter(city => city.id !== cityId);
      setCities(updatedCities);
      await AsyncStorage.setItem('cities', JSON.stringify(updatedCities));
    } catch (error) {
      console.error('Erro ao remover cidade:', error);
    }
  };

  const handleCityPress = async (city) => {
    try {
      // Buscar dados do clima da cidade
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&current_weather=true`
      );
      const data = await response.json();
      
      router.push({
        pathname: '/details',
        params: {
          cityName: city.name,
          temperature: Math.round(data.current_weather.temperature),
          weatherCode: data.current_weather.weathercode,
          lat: city.lat,
          lon: city.lon
        }
      });
    } catch (error) {
      console.error('Erro ao buscar clima:', error);
      Alert.alert('Erro', 'Não foi possível carregar os detalhes da cidade');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F1113" />
      
      {/* Header Premium com Logo */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Image source={require('../logo-apex.jpg')} style={styles.logo} />
        </View>
      </View>

      {/* Conteúdo Principal */}
      <View style={styles.topSection}>
        <Text style={styles.title}>Minhas Cidades</Text>
        <Text style={styles.subtitle}>{cities.length} {cities.length !== 1 ? 'cidades' : 'cidade'}</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Lista de Cidades */}
        <View style={styles.citiesSection}>
          {cities.map((city) => (
            <TouchableOpacity 
              key={city.id} 
              style={styles.cityCard}
              onPress={() => handleCityPress(city)}
              activeOpacity={0.7}
            >
              <View style={styles.cityCardContent}>
                <View style={styles.cityCardLeft}>
                  <View style={styles.iconCircle}>
                    <Ionicons name="location" size={18} color="#60D7E9" />
                  </View>
                  <Text style={styles.cityName}>{city.name}</Text>
                </View>
                <View style={styles.cityCardRight}>
                  <TouchableOpacity 
                    onPress={(e) => {
                      e.stopPropagation();
                      handleRemoveCity(city.id);
                    }}
                    style={styles.deleteButton}
                  >
                    <Ionicons name="close" size={20} color="#6B7280" />
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Botão Flutuante no canto inferior direito */}
      <TouchableOpacity 
        onPress={() => setModalVisible(true)}
        activeOpacity={0.8}
        style={styles.floatingButton}
      >
        <LinearGradient
          colors={["#60D7E9", "#2A91D4"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.floatingButtonGradient}
        >
          <Ionicons name="add" size={28} color="#FFFFFF" />
        </LinearGradient>
      </TouchableOpacity>

      {/* Modal para adicionar cidade */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <Animated.View style={[styles.modalOverlay, { opacity: fadeAnim }]}>
          <Animated.View style={[
            styles.modalContent,
            {
              transform: [{ scale: scaleAnim }],
              opacity: fadeAnim
            }
          ]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Nova Cidade</Text>
              <TouchableOpacity 
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={28} color="#666" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <TextInput
                style={styles.input}
                placeholder="Digite o nome da cidade"
                placeholderTextColor="#AAAAAA"
                value={newCityName}
                onChangeText={setNewCityName}
                autoFocus={true}
              />

              <TouchableOpacity 
                style={[styles.saveButton, loading && styles.saveButtonDisabled]} 
                onPress={handleAddCity}
                disabled={loading}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={loading ? ["#B0B0B0", "#808080"] : ["#60D7E9", "#2A91D4"]}
                  style={styles.saveButtonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={styles.saveButtonText}>
                    {loading ? 'Buscando...' : 'Adicionar'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </Animated.View>
      </Modal>
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
  scrollContent: {
    paddingBottom: 120,
  },
  topSection: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#F3F4F6',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  floatingButton: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    zIndex: 1000,
  },
  floatingButtonGradient: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  citiesSection: {
    gap: 10,
    paddingTop: 8,
  },
  cityCard: {
    backgroundColor: '#1A1E23',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2A2F35',
  },
  cityCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  cityCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(96, 215, 233, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cityName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F3F4F6',
    letterSpacing: 0.2,
  },
  cityCardRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deleteButton: {
    padding: 8,
    marginRight: -8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#1E2528',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#2A3135',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#2A3135',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  closeButton: {
    padding: 4,
  },
  modalBody: {
    padding: 20,
  },
  input: {
    backgroundColor: '#0E1214',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#2A3135',
    marginBottom: 20,
  },
  saveButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  saveButtonGradient: {
    padding: 16,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});