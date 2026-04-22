import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView,
  ActivityIndicator
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { database } from '../db';
import { askKenny } from '../kenny/brain';
import { buildKennyContext } from '../kenny/context';

const MindDumpScreen = () => {
  const [text, setText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(null);

  const handleDump = async () => {
    if (!text.trim()) return;

    setIsProcessing(true);
    const context = await buildKennyContext();
    
    const prompt = `Process this mind dump and extract: 
    1. Tasks (to be added to tasks table)
    2. Ideas/Insights
    3. Worries/Anxieties
    4. Decisions made
    
    Mind Dump: ${text}`;

    const response = await askKenny(prompt, context);
    
    // Save thought to DB
    await database.write(async () => {
      await database.get('thoughts').create(t => {
        t.raw_text = text
        t.processed = true
        t.kenny_response = response
      })
    })

    setResult(response);
    setIsProcessing(false);
    setText('');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Mind Dump</Text>
      <Text style={styles.subtitle}>Get everything out of your head. Kenny will organize it.</Text>

      <TextInput
        style={styles.input}
        placeholder="Dump your thoughts here..."
        placeholderTextColor="#8E8E93"
        multiline
        value={text}
        onChangeText={setText}
      />

      <TouchableOpacity 
        style={[styles.button, (!text.trim() || isProcessing) && styles.buttonDisabled]} 
        onPress={handleDump}
        disabled={!text.trim() || isProcessing}
      >
        {isProcessing ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <>
            <MaterialCommunityIcons name="brain" size={24} color="#FFFFFF" />
            <Text style={styles.buttonText}>Process with Kenny</Text>
          </>
        )}
      </TouchableOpacity>

      {result && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultTitle}>Kenny's Analysis:</Text>
          <Text style={styles.resultText}>{result}</Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  content: {
    padding: 20,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#8E8E93',
    fontSize: 16,
    marginTop: 8,
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#1C1C1E',
    color: '#FFFFFF',
    borderRadius: 15,
    padding: 15,
    minHeight: 200,
    fontSize: 18,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#5856D6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 15,
    marginTop: 20,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  resultContainer: {
    marginTop: 30,
    backgroundColor: '#1C1C1E',
    padding: 20,
    borderRadius: 15,
  },
  resultTitle: {
    color: '#5856D6',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  resultText: {
    color: '#FFFFFF',
    fontSize: 16,
    lineHeight: 24,
  }
});

export default MindDumpScreen;
