import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Colors } from '../theme/theme';

// Screens
import DashboardScreen   from '../screens/dashboard/DashboardScreen';
import EntryHubScreen    from '../screens/entry/EntryHubScreen';
import TextEntryScreen   from '../screens/entry/TextEntryScreen';
import AudioEntryScreen  from '../screens/entry/AudioEntryScreen';
import VideoEntryScreen  from '../screens/entry/VideoEntryScreen';
import AnalyzingScreen   from '../screens/entry/AnalyzingScreen';

// 1. Define the parameters for your stack
export type RootStackParamList = {
  Dashboard: undefined;
  EntryHub: undefined;
  TextEntry: undefined;
  AudioEntry: undefined;
  VideoEntry: undefined;
  Analyzing: undefined;
};

// 2. Pass the param list to the Stack creator
const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Dashboard"
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: Colors.bg },
          animation: 'slide_from_right',
          gestureEnabled: true,
        }}
      >
        <Stack.Screen name="Dashboard"   component={DashboardScreen}  />
        <Stack.Screen name="EntryHub"    component={EntryHubScreen}   />
        <Stack.Screen name="TextEntry"   component={TextEntryScreen}  />
        <Stack.Screen name="AudioEntry"  component={AudioEntryScreen} />
        <Stack.Screen
          name="VideoEntry"
          component={VideoEntryScreen}
          options={{ animation: 'fade' }}
        />
        <Stack.Screen
          name="Analyzing"
          component={AnalyzingScreen}
          options={{ animation: 'fade', gestureEnabled: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}