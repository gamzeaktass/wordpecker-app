import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function WordList({ list }) {
  return (
    <TouchableOpacity style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{list.name}</Text>
        <MaterialCommunityIcons name="chevron-right" size={24} color="#888" />
      </View>
      <Text style={styles.description}>{list.description}</Text>
      
      <View style={styles.infoContainer}>
        <View style={styles.contextTag}>
          <Text style={styles.contextText}>{list.context}</Text>
        </View>
        <Text style={styles.wordCount}>{list.wordCount} words</Text>
      </View>

      <View style={styles.progressContainer}>
        <View style={[styles.progressBar, { width: `${list.progress}%` }]} />
        <Text style={styles.progressText}>{list.progress}% Mastered</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2A2A2A',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  contextTag: {
    backgroundColor: '#E8F0FE',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 10,
  },
  contextText: {
    color: '#4A90E2',
    fontSize: 12,
    fontWeight: '500',
  },
  wordCount: {
    color: '#888',
    fontSize: 12,
  },
  progressContainer: {
    marginTop: 15,
    height: 4,
    backgroundColor: '#F0F0F0',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#4A90E2',
  },
  progressText: {
    position: 'absolute',
    right: 0,
    top: 8,
    fontSize: 12,
    color: '#666',
  },
});