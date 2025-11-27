import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router, Stack } from 'expo-router';

export default function NotFound() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        <Text style={styles.code}>404</Text>
        <Text style={styles.message}>Página não encontrada</Text>
        <TouchableOpacity style={styles.button} onPress={() => router.push('/')}>
          <Text style={styles.buttonText}>Voltar para início</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#000000ff',
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
