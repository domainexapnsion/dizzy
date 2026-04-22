import React, { useState } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView 
} from 'react-native';
import { withObservables } from '@nozbe/watermelondb/withObservables';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { database } from '../db';

const SubjectCard = ({ subject, topics }) => {
  const subTopics = topics.filter(t => t.subject_id === subject.id);
  const doneCount = subTopics.filter(t => t.status === 'done').length;
  const progress = subTopics.length > 0 ? (doneCount / subTopics.length) * 100 : 0;

  return (
    <View style={[styles.card, { borderLeftColor: subject.color || '#007AFF' }]}>
      <View style={styles.cardHeader}>
        <Text style={styles.subjectName}>{subject.name}</Text>
        {subject.exam_date && (
          <Text style={styles.examDate}>
            Exam: {new Date(subject.exam_date).toLocaleDateString()}
          </Text>
        )}
      </View>
      <View style={styles.progressBarBg}>
        <View style={[styles.progressBarFill, { width: `${progress}%`, backgroundColor: subject.color || '#007AFF' }]} />
      </View>
      <Text style={styles.progressText}>{doneCount}/{subTopics.length} Topics Done</Text>
    </View>
  );
};

const StudyScreen = ({ subjects, topics }) => {
  const [activeTab, setActiveTab] = useState('subjects');

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'subjects' && styles.activeTab]}
          onPress={() => setActiveTab('subjects')}
        >
          <Text style={[styles.tabText, activeTab === 'subjects' && styles.activeTabText]}>Subjects</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'revision' && styles.activeTab]}
          onPress={() => setActiveTab('revision')}
        >
          <Text style={[styles.tabText, activeTab === 'revision' && styles.activeTabText]}>Revision Due</Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'subjects' ? (
        <FlatList
          data={subjects}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <SubjectCard subject={item} topics={topics} />}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyText}>No subjects added yet. Ask Kenny to add one!</Text>
            </View>
          }
        />
      ) : (
        <View style={styles.empty}>
          <MaterialCommunityIcons name="brain" size={48} color="#8E8E93" />
          <Text style={styles.emptyText}>FSRS Revision engine is standing by.</Text>
        </View>
      )}

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
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#1C1C1E',
    padding: 4,
    margin: 10,
    borderRadius: 10,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#2C2C2E',
  },
  tabText: {
    color: '#8E8E93',
    fontWeight: '600',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  list: {
    padding: 10,
  },
  card: {
    backgroundColor: '#1C1C1E',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    borderLeftWidth: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  subjectName: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  examDate: {
    color: '#FF3B30',
    fontSize: 12,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: '#2C2C2E',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 5,
  },
  progressBarFill: {
    height: '100%',
  },
  progressText: {
    color: '#8E8E93',
    fontSize: 12,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
  },
  emptyText: {
    color: '#8E8E93',
    textAlign: 'center',
    marginTop: 10,
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
    elevation: 8,
  }
});

const enhance = withObservables([], () => ({
  subjects: database.get('subjects').query(),
  topics: database.get('topics').query()
}));

export default enhance(StudyScreen);
