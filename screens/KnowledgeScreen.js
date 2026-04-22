import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { withObservables } from '@nozbe/watermelondb/withObservables';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { database } from '../db';

const CaptureItem = ({ capture }) => (
  <View style={styles.captureItem}>
    <View style={styles.captureHeader}>
      <MaterialCommunityIcons 
        name={capture.type === 'url' ? 'link' : 'file-document-outline'} 
        size={16} 
        color="#007AFF" 
      />
      <Text style={styles.captureType}>{capture.type.toUpperCase()}</Text>
    </View>
    <Text style={styles.captureContent} numberOfLines={2}>{capture.content}</Text>
    {capture.summary && <Text style={styles.summary}>{capture.summary}</Text>}
    <View style={styles.captureFooter}>
      <Text style={styles.date}>{new Date(capture.created_at).toLocaleDateString()}</Text>
      {!capture.read && <View style={styles.unreadDot} />}
    </View>
  </View>
);

const KnowledgeScreen = ({ captures }) => {
  return (
    <View style={styles.container}>
      <FlatList
        data={captures}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <CaptureItem capture={item} />}
        contentContainerStyle={styles.list}
        ListHeaderComponent={<Text style={styles.sectionTitle}>Inbox</Text>}
        ListEmptyComponent={<Text style={styles.emptyText}>Your knowledge inbox is empty.</Text>}
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
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    margin: 15,
  },
  list: {
    paddingHorizontal: 15,
  },
  captureItem: {
    backgroundColor: '#1C1C1E',
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
  },
  captureHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  captureType: {
    color: '#007AFF',
    fontSize: 10,
    fontWeight: 'bold',
    marginLeft: 6,
  },
  captureContent: {
    color: '#FFFFFF',
    fontSize: 16,
    lineHeight: 22,
  },
  summary: {
    color: '#8E8E93',
    fontSize: 14,
    marginTop: 8,
    fontStyle: 'italic',
  },
  captureFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  date: {
    color: '#8E8E93',
    fontSize: 12,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#007AFF',
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
    backgroundColor: '#007AFF',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

const enhance = withObservables([], () => ({
  captures: database.get('captures').query()
}));

export default enhance(KnowledgeScreen);
