import LottieView from 'lottie-react-native';
import React from 'react';
import { StyleSheet, View } from 'react-native';

const Loading = () => {
  return (
    <View style={styles.loadingContainer}>
      <LottieView
        source={require('./2gDueM01bE.json')}
        autoPlay
        loop
        style={styles.animation}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    zIndex: 999,
  },
  animation: {
    width: 200,
    height: 200,
  },
});

export default Loading;