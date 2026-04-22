import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { withObservables } from '@nozbe/watermelondb/withObservables';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { database } from '../db';

const GymLogItem = ({ log }) => (
  <View style={styles.logItem}>
    <View>
      <Text style={styles.exerciseName}>{log.exercise}</Text>
      <Text style={styles.logDetails}>{log.sets} sets x {log.reps} reps @ {log.weight_kg}kg</Text>
    </View>
    <Text style={styles.logDate}>{new Date(log.date).toLocaleDateString()}</Text>
  </View>
);

const GymScreen = ({ logs, goals }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{logs.length}</Text>
          <Text style={styles.statLabel}>Workouts</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>🔥 3</Text>
          <Text style={styles.statLabel}>Day Streak</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Recent Logs</Text>
      <FlatList
        data={logs}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <GymLogItem log={item} />}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No logs yet. Get moving!</Text>
        }
      />

      <TouchableOpacity style={styles.fab}>
        <MaterialCommunityIcons name="plus" size={30} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    padding: 20,
    justifyContent: 'space-around',
    backgroundColor: '#1C1C1E',
  },
  statBox: {
    alignItems: 'center',
  },
  statValue: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  statLabel: {
    color: '#8E8E93',
    fontSize: 12,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    margin: 15,
  },
  list: {
    paddingHorizontal: 15,
  },
  logItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1C1C1E',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },
  exerciseName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  logDetails: {
    color: '#8E8E93',
    fontSize: 14,
  },
  logDate: {
    color: '#007AFF',
    fontSize: 12,
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
    backgroundColor: '#34C759',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

const enhance = withObservables([], () => ({
  logs: database.get('gym_logs').query(),
  goals: database.get('gym_goals').query()
}));

export default enhance(GymScreen);
