import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Home from '../screens/Home';
import LoginScreen from '../screens/LoginScreen';
import StripeScreen from '../screens/StripeScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="StripeScreen" component={StripeScreen} />
    </Stack.Navigator>
  );
};

export default App;
