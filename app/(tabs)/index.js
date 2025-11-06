import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';

export default function IndexScreen() {
  const handlePress = () => {
    router.push('/home');
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
        <Image
          source={require('../logo-apex.jpg')}
          style={styles.image}
        />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#171C20',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000000',
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
  },
  image: {
    width: 400,
    height: 400,
    marginBottom: 20,
    borderRadius: 100,
  }
});