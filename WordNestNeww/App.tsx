import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Toaster } from 'sonner-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import HomeScreen from './screens/HomeScreen';
import QuizScreen from './screens/QuizScreen';
import AuthScreen from './screens/AuthScreen';
import LearnScreen from './screens/LearnScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: 'white',
          borderTopWidth: 1,
          borderTopColor: '#E0E0E0',
        },
        tabBarActiveTintColor: '#4A90E2',
        tabBarInactiveTintColor: '#888',
      }}
    >
      <Tab.Screen
        name="Nests"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Learn"
        component={LearnScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="book-open-variant" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Quiz"
        component={QuizScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="pencil" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <NavigationContainer>
          <Stack.Navigator 
            initialRouteName="Auth"
            screenOptions={{
              headerShown: false,
              animation: 'fade'
            }}
          >
            <Stack.Screen 
              name="Auth" 
              component={AuthScreen}
              options={{
                gestureEnabled: false,
              }}
            />
            <Stack.Screen 
              name="MainTabs" 
              component={MainTabs}
              options={{
                gestureEnabled: false,
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
        <Toaster />
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
});