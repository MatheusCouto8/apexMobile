import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput, Modal, Alert, Animated, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect, useRef } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SettingsScreen() {
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

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F1113" />
      
      {/* Header Premium com Logo */}
      <LinearGradient
        colors={['#0F1113', '#1A1E23']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Image source={require('../logo-apex.jpg')} style={styles.logo} />
        </View>
      </LinearGradient>

      {/* Conteúdo Principal */}
      <View style={styles.topSection}>
        <View style={styles.titleSection}>
          <View style={styles.titleHeader}>
            <Ionicons name="location-outline" size={24} color="#60D7E9" />
            <Text style={styles.title}>Minhas Cidades</Text>
          </View>
          <Text style={styles.subtitle}>{cities.length} cidade{cities.length !== 1 ? 's' : ''} salva{cities.length !== 1 ? 's' : ''}</Text>
        </View>

        <TouchableOpacity 
          onPress={() => setModalVisible(true)}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={["#60D7E9", "#2A91D4"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.addButton}
          >
            <Ionicons name="add" size={24} color="#FFFFFF" />
            <Text style={styles.addButtonText}>Nova Cidade</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Lista de Cidades */}
        <View style={styles.citiesSection}>
          {cities.map((city) => (
            <View key={city.id} style={styles.cityCard}>
              <View style={styles.cityCardLeft}>
                <Ionicons name="location-outline" size={24} color="#60D7E9" />
                <View style={styles.cityDetails}>
                  <Text style={styles.cityName}>{city.name}</Text>
                  <Text style={styles.cityCoords}>
                    {city.lat.toFixed(2)}°, {city.lon.toFixed(2)}°
                  </Text>
                </View>
              </View>
              <TouchableOpacity 
                onPress={() => handleRemoveCity(city.id)}
                style={styles.deleteButton}
              >
                <Ionicons name="close-circle" size={24} color="#FF6B6B" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>

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
    paddingTop: 20,
    paddingBottom: 24,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(96, 215, 233, 0.1)',
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  topSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(96, 215, 233, 0.1)',
  },
  titleSection: {
    flex: 1,
  },
  titleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#F3F4F6',
    letterSpacing: 0.3,
  },
  subtitle: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 8,
    shadowColor: '#60D7E9',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  citiesSection: {
    gap: 12,
    paddingTop: 12,
  },
  cityCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(96, 215, 233, 0.08)',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(96, 215, 233, 0.15)',
  },
  cityCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  cityDetails: {
    flex: 1,
  },
  cityName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
    letterSpacing: 0.2,
  },
  cityCoords: {
    fontSize: 11,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  deleteButton: {
    padding: 8,
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