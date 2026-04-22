import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const MessageBubble = ({ message }) => {
  const isKenny = message.role === 'kenny';

  return (
    <View style={[
      styles.container,
      isKenny ? styles.kennyContainer : styles.userContainer
    ]}>
      <View style={[
        styles.bubble,
        isKenny ? styles.kennyBubble : styles.userBubble
      ]}>
        <Text style={styles.text}>{message.content}</Text>
      </View>
      <Text style={styles.timestamp}>
        {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    maxWidth: '85%',
  },
  kennyContainer: {
    alignSelf: 'flex-start',
    marginLeft: 10,
  },
  userContainer: {
    alignSelf: 'flex-end',
    marginRight: 10,
  },
  bubble: {
    padding: 12,
    borderRadius: 18,
  },
  kennyBubble: {
    backgroundColor: '#2C2C2E',
    borderBottomLeftRadius: 4,
  },
  userBubble: {
    backgroundColor: '#007AFF',
    borderBottomRightRadius: 4,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  timestamp: {
    color: '#8E8E93',
    fontSize: 10,
    marginTop: 4,
    marginHorizontal: 4,
  }
});

export default MessageBubble;
