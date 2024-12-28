import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Home from '../screens/Home';
import LoginScreen from '../screens/LoginScreen';
import StripeScreen from '../screens/StripeScreen';
import NavigationScreen from '../screens/Navigation';

const Stack = createStackNavigator();

const App = () => {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="StripeScreen" component={StripeScreen} />
      <Stack.Screen name="NavigationScreen" component={NavigationScreen} />
    </Stack.Navigator>
  );
};

export default App;
