import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { withObservables } from '@nozbe/watermelondb/withObservables';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { database } from '../db';

const FoodLogItem = ({ log }) => (
  <View style={styles.logItem}>
    <View style={styles.logMain}>
      <Text style={styles.mealType}>{log.meal_type.toUpperCase()}</Text>
      <Text style={styles.description}>{log.description}</Text>
    </View>
    <View style={styles.logMeta}>
      <Text style={[styles.protein, { color: log.protein_est === 'high' ? '#34C759' : '#FF9500' }]}>
        {log.protein_est} protein
      </Text>
      {log.skipped && <Text style={styles.skipped}>SKIPPED</Text>}
    </View>
  </View>
);

const FoodScreen = ({ logs }) => {
  return (
    <View style={styles.container}>
      <View style={styles.summary}>
        <Text style={styles.summaryText}>Todays Protein Intake</Text>
        <Text style={styles.summaryValue}>Medium</Text>
      </View>

      <FlatList
        data={logs}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <FoodLogItem log={item} />}
        contentContainerStyle={styles.list}
        ListHeaderComponent={<Text style={styles.sectionTitle}>Daily Logs</Text>}
        ListEmptyComponent={<Text style={styles.emptyText}>No food logs for today.</Text>}
      />

      <TouchableOpacity style={styles.fab}>
        <MaterialCommunityIcons name="food" size={30} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  summary: {
    padding: 20,
    backgroundColor: '#1C1C1E',
    alignItems: 'center',
    marginBottom: 10,
  },
  summaryText: {
    color: '#8E8E93',
    fontSize: 14,
  },
  summaryValue: {
    color: '#34C759',
    fontSize: 28,
    fontWeight: 'bold',
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 15,
  },
  list: {
    paddingHorizontal: 15,
  },
  logItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#1C1C1E',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },
  logMain: {
    flex: 1,
  },
  mealType: {
    color: '#007AFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  description: {
    color: '#FFFFFF',
    fontSize: 16,
    marginTop: 4,
  },
  logMeta: {
    alignItems: 'flex-end',
  },
  protein: {
    fontSize: 12,
  },
  skipped: {
    color: '#FF3B30',
    fontSize: 10,
    fontWeight: 'bold',
    marginTop: 5,
  },
  emptyText: {
    color: '#8E8E93',
    textAlign: 'center',
    marginTop: 50,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#FF9500',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

const enhance = withObservables([], () => ({
  logs: database.get('food_logs').query()
}));

export default enhance(FoodScreen);
