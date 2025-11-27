import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { router, Stack } from 'expo-router';

export default function NotFound() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        <View style={styles.header}>
          <Image source={require('./logo-apex.jpg')} style={styles.logo} />
        </View>

        <View style={styles.content}>
          <Text style={styles.code}>404</Text>
          <Text style={styles.message}>Página não encontrada</Text>
          <TouchableOpacity style={styles.button} onPress={() => router.push('/')}>
            <Text style={styles.buttonText}>Voltar para início</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
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
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    marginTop: -80,
  },
  code: {
    fontSize: 72,
    fontWeight: '700',
    color: '#3EBDD9',
    marginBottom: 8,
  },
  message: {
    fontSize: 18,
    color: '#FFFFFF',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#171C20',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
});
