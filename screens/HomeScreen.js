import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  FlatList, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform,
  ActivityIndicator
} from 'react-native';
import { withObservables } from '@nozbe/watermelondb/withObservables';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { database } from '../db';
import MessageBubble from '../components/MessageBubble';
import QuickLogBar from '../components/QuickLogBar';
import { askKenny } from '../kenny/brain';
import { buildKennyContext } from '../kenny/context';

const HomeScreen = ({ messages }) => {
  const [inputText, setInputText] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const flatListRef = useRef();

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userText = inputText.trim();
    setInputText('');
    
    // 1. Save User Message
    await database.write(async () => {
      await database.get('conversations').create(m => {
        m.role = 'user'
        m.content = userText
      })
    })

    // 2. Build Context and Ask Kenny
    setIsThinking(true);
    const context = await buildKennyContext();
    const history = messages.slice(-10); // Last 10 messages for context
    const kennyResponse = await askKenny(userText, context, history);
    setIsThinking(false);

    // 3. Save Kenny Message
    await database.write(async () => {
      await database.get('conversations').create(m => {
        m.role = 'kenny'
        m.content = kennyResponse
      })
    })
  };

  const handleQuickLog = (type) => {
    // Navigate to respective screen or open modal
    console.log('Quick log type:', type);
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={90}
      style={styles.container}
    >
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <MessageBubble message={item} />}
        contentContainerStyle={styles.chatList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
      />

      {isThinking && (
        <View style={styles.thinking}>
          <ActivityIndicator color="#007AFF" />
        </View>
      )}

      <QuickLogBar onLogPress={handleQuickLog} />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Talk to Kenny..."
          placeholderTextColor="#8E8E93"
          value={inputText}
          onChangeText={setInputText}
          multiline
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <MaterialCommunityIcons name="arrow-up" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  chatList: {
    paddingVertical: 10,
  },
  thinking: {
    padding: 10,
    alignItems: 'flex-start',
    marginLeft: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#1C1C1E',
    borderTopWidth: 1,
    borderTopColor: '#2C2C2E',
  },
  input: {
    flex: 1,
    backgroundColor: '#2C2C2E',
    color: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    maxHeight: 100,
    fontSize: 16,
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: '#007AFF',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

const enhance = withObservables([], () => ({
  messages: database.get('conversations').query()
}));

export default enhance(HomeScreen);
