import { StyleSheet, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import CategoryScreen from './screens/CategoryScreen.js';
import ProductListScreen from './screens/ProductListScreen.js';
import ProductScreen from './screens/ProductScreen.js';

const Stack = createNativeStackNavigator();

export default function App() {

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='CategoryScreen'>
        <Stack.Screen
          name='CategoryScreen'
          component={CategoryScreen}
        />
        <Stack.Screen
          name='ProductListScreen'
          component={ProductListScreen}
        />
        <Stack.Screen
          name='ProductScreen'
          component={ProductScreen}
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
