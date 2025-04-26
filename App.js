import { StyleSheet, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import CategoryScreen from './screens/CategoryScreen.js';
import ProductListScreen from './screens/ProductListScreen.js';
import ProductScreen from './screens/ProductScreen.js';
import { colors } from './styles/colors.js';
import { capitalizeEachWord, getFirstThreeWords } from './utils/stringUtils.js';


const Stack = createNativeStackNavigator();

export default function App() {

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName='Category'
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.secondary
          },
          headerTintColor: colors.fontTitle,
          headerTitleStyle: {
            fontWeight: 'bold'
          }
        }}
      >
        <Stack.Screen
          name='Category'
          component={CategoryScreen}
          options={{
            title: 'Category'
          }}
        />
        <Stack.Screen
          name='ProductListScreen'
          component={ProductListScreen}
          options={({route}) => ({
            title: route.params?.category ? capitalizeEachWord(route.params.category) : 'Products'
          })}
        />
        <Stack.Screen
          name='ProductScreen'
          component={ProductScreen}
          options={({route}) => ({
            title: route.params?.product?.title ? getFirstThreeWords(route.params.product.title) : 'Product'
          })}
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
