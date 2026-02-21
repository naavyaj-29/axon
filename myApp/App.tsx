import 'react-native-gesture-handler';
import React from 'react';
import { AppProvider } from './src/store/store';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <AppProvider>
      <AppNavigator />
    </AppProvider>
  );
}