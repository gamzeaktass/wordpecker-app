import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function Logo({ size = 100, style = {} }) {
  return (
    <View style={[styles.container, style]}>
      <View style={[styles.logoWrapper, { width: size, height: size }]}>
        <MaterialCommunityIcons 
          name="book-open-page-variant" 
          size={size * 0.6} 
          color="#4A90E2" 
        />
        <Text style={[styles.text, { fontSize: size * 0.2 }]}>WordNest</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  text: {
    color: '#4A90E2',
    fontWeight: 'bold',
    marginTop: 5,
  }
});
