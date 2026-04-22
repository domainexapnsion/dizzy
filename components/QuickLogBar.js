import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const LOG_OPTIONS = [
  { id: 'task', label: '+Task', icon: 'checkbox-marked-circle-outline' },
  { id: 'gym', label: '+Gym', icon: 'weight-lifter' },
  { id: 'food', label: '+Food', icon: 'food-apple-outline' },
  { id: 'expense', label: '+Expense', icon: 'currency-inr' },
  { id: 'thought', label: '+Thought', icon: 'lightbulb-outline' },
];

const QuickLogBar = ({ onLogPress }) => {
  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false} 
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      {LOG_OPTIONS.map((option) => (
        <TouchableOpacity 
          key={option.id} 
          style={styles.button}
          onPress={() => onLogPress(option.id)}
        >
          <MaterialCommunityIcons name={option.icon} size={20} color="#FFFFFF" />
          <Text style={styles.label}>{option.label}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    maxHeight: 60,
    backgroundColor: '#1C1C1E',
  },
  content: {
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2C2C2E',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 5,
  },
  label: {
    color: '#FFFFFF',
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '600',
  }
});

export default QuickLogBar;
