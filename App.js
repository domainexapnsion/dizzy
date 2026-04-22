import React from 'react';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { DatabaseProvider } from '@nozbe/watermelondb/DatabaseProvider';

import { database } from './db';
import HomeScreen from './screens/HomeScreen';
import StudyScreen from './screens/StudyScreen';
import GymScreen from './screens/GymScreen';
import FoodScreen from './screens/FoodScreen';
import FinanceScreen from './screens/FinanceScreen';
import KnowledgeScreen from './screens/KnowledgeScreen';
import MindDumpScreen from './screens/MindDumpScreen';

const Tab = createBottomTabNavigator();

const BodyTabs = () => (
  <Tab.Navigator screenOptions={{ headerShown: false }}>
    <Tab.Screen 
      name="Gym" 
      component={GymScreen} 
      options={{ tabBarIcon: ({ color }) => <MaterialCommunityIcons name="weight-lifter" size={24} color={color} /> }}
    />
    <Tab.Screen 
      name="Food" 
      component={FoodScreen} 
      options={{ tabBarIcon: ({ color }) => <MaterialCommunityIcons name="food" size={24} color={color} /> }}
    />
  </Tab.Navigator>
);

export default function App() {
  return (
    <DatabaseProvider database={database}>
      <NavigationContainer theme={DarkTheme}>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ color, size }) => {
              let iconName;
              if (route.name === 'Kenny') iconName = 'robot';
              else if (route.name === 'Study') iconName = 'book-open-variant';
              else if (route.name === 'Body') iconName = 'arm-flex';
              else if (route.name === 'Finance') iconName = 'currency-inr';
              else if (route.name === 'Knowledge') iconName = 'brain';
              else if (route.name === 'MindDump') iconName = 'lightbulb-on';
              
              return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: '#007AFF',
            tabBarInactiveTintColor: '#8E8E93',
            tabBarStyle: { backgroundColor: '#1C1C1E' },
            headerStyle: { backgroundColor: '#1C1C1E' },
            headerTintColor: '#FFFFFF',
          })}
        >
          <Tab.Screen name="Kenny" component={HomeScreen} options={{ title: 'Kenny OS' }} />
          <Tab.Screen name="Study" component={StudyScreen} />
          <Tab.Screen name="Body" component={BodyTabs} />
          <Tab.Screen name="Finance" component={FinanceScreen} />
          <Tab.Screen name="Knowledge" component={KnowledgeScreen} />
          <Tab.Screen name="MindDump" component={MindDumpScreen} options={{ title: 'Mind Dump' }} />
        </Tab.Navigator>
      </NavigationContainer>
    </DatabaseProvider>
  );
}
