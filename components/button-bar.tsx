import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import React from 'react';

export const ButtonBar = ({ onReset, onStart, onStop, onFlip }: {
  onReset: () => void,
  onStart: () => void,
  onStop: () => void
  onFlip?: () => void,
}) => {
  return (
    <View
      style={styles.buttonBar}>
      {onFlip && <TouchableOpacity
        style={styles.button}
        onPress={onFlip}>
        <Text style={styles.label}>Flip</Text>
      </TouchableOpacity>}
      <TouchableOpacity
        style={styles.button}
        onPress={onReset}
      >
        <Text style={styles.label}>Reset</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={onStart}
      >
        <Text style={styles.label}>Start</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={onStop}
      >
        <Text style={styles.label}>Stop</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: '#222'
  },
  buttonBar: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    flex: 1,
    backgroundColor: '#0007',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  button: {
    flex: 0.1,
    alignSelf: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F0F',
    backgroundColor: '#F0F7',
    padding: 4,
    paddingHorizontal: 8,
    marginHorizontal: 4,
    minWidth: 80,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
    color: 'white'
  }
});
