import { StyleSheet, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import CategoryScreen from './screens/CategoryScreen.js';
import ProductListScreen from './screens/ProductListScreen.js';
import ProductScreen from './screens/ProductScreen.js';
import Cart from './screens/Cart.js';
import { colors } from './styles/colors.js';
import { capitalizeEachWord, getFirstThreeWords } from './utils/stringUtils.js';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from '@expo/vector-icons';
import { Provider } from 'react-redux';
import store from './redux/store.js';


const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function ProductStack() {
  return(
    <Stack.Navigator
      initialRouteName='Category'
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.secondary,
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
  );
}

function AppContent() {
  return(
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.secondary,
          },
          headerTintColor: colors.fontTitle,
          headerTitleStyle: {
            fontWeight: 'bold'
          },
          tabBarStyle: {
            backgroundColor: colors.secondary
          }
        }}
      >
        <Tab.Screen 
          name='Shop'
          component={ProductStack}
          options={{
            tabBarIcon: ({ focused, color, size }) => (
              <Ionicons
                name = {focused ? 'basket' : 'basket-outline'}
                color = {'white'}
                size = {size}
              />
            ),
            headerShown: false
          }}
        />
        <Tab.Screen
          name='Cart'
          component={Cart}
          options={{
            tabBarIcon: ({ focused, color, size }) => (
              <Ionicons
                name = {focused ? 'cart' : 'cart-outline'}
                color = {'white'}
                size = {size}
              />
            )
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
export default function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}
