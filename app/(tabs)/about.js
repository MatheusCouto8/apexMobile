import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar, Image, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AboutScreen() {
  const router = useRouter();
  const [userName, setUserName] = useState('');
  const [editNameModalVisible, setEditNameModalVisible] = useState(false);
  const [inputUserName, setInputUserName] = useState('');

  useEffect(() => {
    loadUserName();
  }, []);

  const loadUserName = async () => {
    try {
      const savedUserName = await AsyncStorage.getItem('userName');
      if (savedUserName) {
        setUserName(savedUserName);
      }
    } catch (error) {
      console.error('Erro ao carregar nome do usuário:', error);
    }
  };

  const handleEditName = () => {
    setInputUserName(userName);
    setEditNameModalVisible(true);
  };

  const handleSaveUserName = async () => {
    if (!inputUserName.trim()) {
      Alert.alert('Erro', 'Por favor, digite seu nome');
      return;
    }

    try {
      await AsyncStorage.setItem('userName', inputUserName.trim());
      setUserName(inputUserName.trim());
      setEditNameModalVisible(false);
      setInputUserName('');
      Alert.alert('Sucesso', 'Nome alterado com sucesso!', [
        {
          text: 'OK',
          onPress: () => router.push('/(tabs)/home')
        }
      ]);
    } catch (error) {
      console.error('Erro ao salvar nome do usuário:', error);
      Alert.alert('Erro', 'Não foi possível salvar o nome');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F1113" />
      
      {/* Header Premium com Logo - igual ao da home */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => router.push('/(tabs)/home')}>
            <Image source={require('../logo-apex.jpg')} style={styles.logo} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 150 }}
      >
        <View style={styles.section}>
          <Ionicons name="information-circle" size={60} color="#60D7E9" />
          <Text style={styles.title}>Sobre o Apex</Text>
          <Text style={styles.description}>
            Apex é seu aplicativo completo de clima e relógio inteligente, 
            oferecendo informações precisas e em tempo real sobre as condições 
            climáticas.
          </Text>
        </View>

        <View style={styles.featuresContainer}>
          <View style={styles.featureCard}>
            <Ionicons name="partly-sunny" size={32} color="#60D7E9" />
            <Text style={styles.featureTitle}>Clima em Tempo Real</Text>
            <Text style={styles.featureText}>
              Informações atualizadas de temperatura e condições climáticas
            </Text>
          </View>

          <View style={styles.featureCard}>
            <Ionicons name="time" size={32} color="#60D7E9" />
            <Text style={styles.featureTitle}>Relógio Inteligente</Text>
            <Text style={styles.featureText}>
              Hora e data sempre precisas e visíveis
            </Text>
          </View>

          <View style={styles.featureCard}>
            <Ionicons name="location" size={32} color="#60D7E9" />
            <Text style={styles.featureTitle}>Múltiplas Cidades</Text>
            <Text style={styles.featureText}>
              Acompanhe o clima em várias localidades
            </Text>
          </View>
        </View>

        {/* Seção para alterar nome */}
        <View style={styles.userSection}>
          <View style={styles.userCard}>
            <View style={styles.userInfo}>
              <Ionicons name="person-circle" size={40} color="#60D7E9" />
              <View style={styles.userDetails}>
                <Text style={styles.userLabel}>Seu nome</Text>
                <Text style={styles.userName}>{userName || 'Não definido'}</Text>
              </View>
            </View>
            <TouchableOpacity 
              style={styles.editButton}
              onPress={handleEditName}
              activeOpacity={0.7}
            >
              <Ionicons name="create-outline" size={20} color="#FFFFFF" />
              <Text style={styles.editButtonText}>Editar</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Versão 1.0.0</Text>
          <Text style={styles.copyrightText}>© 2025 Apex</Text>
        </View>
      </ScrollView>

      {/* Modal para editar nome */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={editNameModalVisible}
        onRequestClose={() => setEditNameModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Editar Nome</Text>
            <Text style={styles.modalSubtitle}>Digite seu novo nome</Text>
            
            <TextInput
              style={styles.modalInput}
              placeholder="Digite seu nome"
              placeholderTextColor="#AAAAAA"
              value={inputUserName}
              onChangeText={setInputUserName}
              autoFocus={true}
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.modalButtonCancel}
                onPress={() => {
                  setEditNameModalVisible(false);
                  setInputUserName('');
                }}
                activeOpacity={0.8}
              >
                <Text style={styles.modalButtonCancelText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.modalButton}
                onPress={handleSaveUserName}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={["#60D7E9", "#2A91D4"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.modalButtonGradient}
                >
                  <Text style={styles.modalButtonText}>Salvar</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
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
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    paddingTop: 50,
    paddingBottom: 16,
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
    marginTop: 120,
  },
  section: {
    alignItems: 'center',
    padding: 32,
    paddingTop: 48,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#F3F4F6',
    marginTop: 20,
    marginBottom: 16,
    letterSpacing: 0.3,
  },
  description: {
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  featuresContainer: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    gap: 16,
  },
  featureCard: {
    backgroundColor: '#1A1E23',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(96, 215, 233, 0.2)',
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#F3F4F6',
    marginTop: 12,
    marginBottom: 8,
  },
  featureText: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 20,
  },
  userSection: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  userCard: {
    backgroundColor: '#1A1E23',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(96, 215, 233, 0.2)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flex: 1,
  },
  userDetails: {
    flex: 1,
  },
  userLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 4,
    fontWeight: '500',
  },
  userName: {
    fontSize: 18,
    color: '#F3F4F6',
    fontWeight: '700',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(96, 215, 233, 0.15)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(96, 215, 233, 0.3)',
  },
  editButtonText: {
    fontSize: 14,
    color: '#60D7E9',
    fontWeight: '600',
  },
  versionContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    gap: 8,
  },
  versionText: {
    fontSize: 14,
    color: '#60D7E9',
    fontWeight: '600',
  },
  copyrightText: {
    fontSize: 12,
    color: '#6B7280',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#1E2528',
    borderRadius: 24,
    padding: 32,
    borderWidth: 1,
    borderColor: 'rgba(96, 215, 233, 0.2)',
  },
  modalTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 12,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#D1D5DB',
    marginBottom: 24,
    textAlign: 'center',
    fontWeight: '500',
  },
  modalInput: {
    backgroundColor: '#0E1214',
    borderRadius: 14,
    padding: 16,
    fontSize: 16,
    color: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#2A3135',
    marginBottom: 20,
    fontWeight: '500',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButtonCancel: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    backgroundColor: '#2A3135',
    borderWidth: 1,
    borderColor: '#3A4145',
  },
  modalButtonCancelText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#9CA3AF',
    letterSpacing: 0.5,
  },
  modalButton: {
    flex: 1,
    borderRadius: 14,
    overflow: 'hidden',
  },
  modalButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
});