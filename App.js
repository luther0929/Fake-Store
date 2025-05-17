import { StyleSheet, View, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import CategoryScreen from './screens/CategoryScreen.js';
import ProductListScreen from './screens/ProductListScreen.js';
import ProductScreen from './screens/ProductScreen.js';
import Cart from './screens/Cart.js';
import UserProfileScreen from './screens/UserProfileScreen.js';
import SignInScreen from './screens/SignInScreen.js';
import SignUpScreen from './screens/SignUpScreen.js';
import ManualSplashScreen from './screens/ManualSplashScreen.js';
import { colors } from './styles/colors.js';
import { capitalizeEachWord, getFirstThreeWords } from './utils/stringUtils.js';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from '@expo/vector-icons';
import { Provider, useSelector, useDispatch } from 'react-redux';
import store from './redux/store.js';
import { fetchCart } from './redux/cartSlice.js';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const AuthStack = createNativeStackNavigator();

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

function AuthStackNavigator() {
  return (
    <AuthStack.Navigator
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
      <AuthStack.Screen 
        name="SignIn" 
        component={SignInScreen} 
        options={{ title: 'Sign In' }}
      />
      <AuthStack.Screen 
        name="SignUp" 
        component={SignUpScreen} 
        options={{ title: 'Sign Up' }}
      />
    </AuthStack.Navigator>
  );
}

function MainTabNavigator() {
  const { totalQuantity } = useSelector(state => state.cart);
  const { token } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  
  // Load user's cart when they access the main app
  useEffect(() => {
    if (token) {
      dispatch(fetchCart(token))
        .unwrap()
        .catch(error => {
          console.error('Error loading cart:', error);
          // Don't show alert on initial load to avoid bad UX
        });
    }
  }, [dispatch, token]);
  
  return(
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
          ),
          tabBarBadge: totalQuantity > 0 ? totalQuantity : null
        }}
      />
      <Tab.Screen
        name='Profile'
        component={UserProfileScreen}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name = {focused ? 'person' : 'person-outline'}
              color = {'white'}
              size = {size}
            />
          )
        }}
      />
    </Tab.Navigator>
  );
}

function AppContent() {
  const [isSplashVisible, setIsSplashVisible] = useState(true);
  const { isAuthenticated } = useSelector(state => state.auth);
  
  if (isSplashVisible) {
    return <ManualSplashScreen onFinish={() => setIsSplashVisible(false)} />;
  }

  return(
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <Stack.Screen 
            name="Auth" 
            component={AuthStackNavigator}
          />
        ) : (
          <Stack.Screen 
            name="Main" 
            component={MainTabNavigator}
          />
        )}
      </Stack.Navigator>
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