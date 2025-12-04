import { View, Text, StyleSheet, ScrollView, StatusBar, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export default function AboutScreen() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F1113" />
      
      {/* Header Premium com Logo */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Image source={require('../logo-apex.jpg')} style={styles.logo} />
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Ionicons name="information-circle" size={60} color="#60D7E9" />
          <Text style={styles.title}>Sobre o ApexMobile</Text>
          <Text style={styles.description}>
            ApexMobile é seu aplicativo completo de clima e relógio inteligente, 
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

        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Versão 1.0.0</Text>
          <Text style={styles.copyrightText}>© 2025 ApexMobile</Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 85,
    paddingBottom: 16,
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
});