import React, { useState } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';

export default function App() {
  const [message, setMessage] = useState('');

  const handlePress = () => {
    setMessage('Hello, React Native!');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to React Native</Text>
      <Button title="Press me" onPress={handlePress} />
      {message !== '' && <Text style={styles.message}>{message}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
  },
  message: {
    marginTop: 20,
    fontSize: 18,
    color: 'blue',
  },
});
