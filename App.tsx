import React from 'react';
import { View, StyleSheet } from 'react-native';
import ProfileScreen from './src/screens/ProfileScreen.jsx';

const App: React.FC = () => {
  return (
    <View style={styles.container}>
      <ProfileScreen />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    minHeight: '100%',
    alignSelf: 'stretch',
    backgroundColor: '#F8F9FA',
  },
});

export default App;
