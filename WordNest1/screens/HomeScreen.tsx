import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Pressable 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import WordList from '../components/WordList';
import AddWordModal from '../components/AddWordModal';

export default function HomeScreen() {
  const [isModalVisible, setModalVisible] = React.useState(false);

  const mockLists = [
    {
      id: '1',
      name: 'Harry Potter Book 1',
      description: 'New words from the Sorcerer\'s Stone',
      context: 'Book',
      wordCount: 10,
      progress: 40,
    },
    {
      id: '2',
      name: 'French Blog Articles',
      description: 'Vocabulary from Le Monde',
      context: 'Articles',
      wordCount: 15,
      progress: 60,
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>WordNest</Text>
        <TouchableOpacity style={styles.profileButton}>
          <MaterialCommunityIcons name="account-circle" size={32} color="#555" />
        </TouchableOpacity>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>24</Text>
          <Text style={styles.statLabel}>Words</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>3</Text>
          <Text style={styles.statLabel}>Lists</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>80%</Text>
          <Text style={styles.statLabel}>Mastered</Text>
        </View>
      </View>      <View style={styles.tabContainer}>
        <Pressable 
          style={[styles.tab, styles.activeTab]}
          onPress={() => navigation.navigate('MainTabs', { screen: 'Nests' })}
        >
          <Text style={[styles.tabText, styles.activeTabText]}>Your Nests</Text>
        </Pressable>
        <Pressable 
          style={styles.tab}
          onPress={() => navigation.navigate('MainTabs', { screen: 'Learn' })}
        >
          <Text style={styles.tabText}>Learn</Text>
        </Pressable>
        <Pressable 
          style={styles.tab}
          onPress={() => navigation.navigate('MainTabs', { screen: 'Quiz' })}
        >
          <Text style={styles.tabText}>Quiz</Text>
        </Pressable>
      </View>

      <ScrollView style={styles.content}>
        {mockLists.map((list) => (
          <WordList key={list.id} list={list} />
        ))}
      </ScrollView>

      <TouchableOpacity 
        style={styles.fab}
        onPress={() => setModalVisible(true)}
      >
        <Feather name="plus" size={24} color="white" />
      </TouchableOpacity>

      <AddWordModal 
        visible={isModalVisible}
        onClose={() => setModalVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2A2A2A',
  },
  profileButton: {
    padding: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    backgroundColor: 'white',
    marginHorizontal: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '600',
    color: '#4A4A4A',
  },
  statLabel: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginRight: 10,
    borderRadius: 20,
  },
  activeTab: {
    backgroundColor: '#4A90E2',
  },
  tabText: {
    color: '#666',
    fontSize: 16,
  },
  activeTabText: {
    color: 'white',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});