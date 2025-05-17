import { StyleSheet, View, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import CategoryScreen from './screens/CategoryScreen.js';
import ProductListScreen from './screens/ProductListScreen.js';
import ProductScreen from './screens/ProductScreen.js';
import Cart from './screens/Cart.js';
import OrdersScreen from './screens/OrdersScreen.js';
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
import { fetchProducts } from './redux/productsSlice.js';
import { fetchOrders } from './redux/ordersSlice.js';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const AuthStack = createNativeStackNavigator();
const ProductsStack = createNativeStackNavigator();

function ProductStack() {
  return(
    <ProductsStack.Navigator
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
      <ProductsStack.Screen
        name='Category'
        component={CategoryScreen}
        options={{
          title: 'Category'
        }}
      />
      <ProductsStack.Screen
        name='ProductListScreen'
        component={ProductListScreen}
        options={({route}) => ({
          title: route.params?.category ? capitalizeEachWord(route.params.category) : 'Products'
        })}
      />
      <ProductsStack.Screen
        name='ProductScreen'
        component={ProductScreen}
        options={({route}) => ({
          title: route.params?.product?.title ? getFirstThreeWords(route.params.product.title) : 'Product'
        })}
      />
    </ProductsStack.Navigator>
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
  const { newOrdersCount } = useSelector(state => state.orders);
  const { isAuthenticated, token } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  
  // Pre-fetch products to avoid delays later
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchProducts());
    }
  }, [dispatch, isAuthenticated]);
  
  // Load user's cart and orders when a valid token is available
  useEffect(() => {
    // Only fetch data if we have a valid token
    if (isAuthenticated && token) {
      console.log('Fetching user data with token:', token);
      // Add a small delay to ensure token is fully processed
      const timer = setTimeout(() => {
        dispatch(fetchCart(token))
          .unwrap()
          .catch(error => {
            console.error('Error loading cart:', error);
          });
        
        dispatch(fetchOrders(token))
          .unwrap()
          .catch(error => {
            console.error('Error loading orders:', error);
          });
      }, 500); // 500ms delay to ensure token is ready
      
      return () => clearTimeout(timer);
    }
  }, [dispatch, isAuthenticated, token]);

  // Handle tab press when not authenticated
  const handleTabPress = (e) => {
    if (!isAuthenticated) {
      // Prevent navigation and show alert
      e.preventDefault();
      Alert.alert('Authentication Required', 'Please sign in to access this feature.');
    }
  };
  
  return(
    <Tab.Navigator
      initialRouteName="Profile" // Start with Profile tab
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
              name={focused ? 'basket' : 'basket-outline'}
              color={isAuthenticated ? 'white' : 'gray'} // Grey out if not authenticated
              size={size}
            />
          ),
          headerShown: false,
          tabBarActiveTintColor: isAuthenticated ? 'white' : 'gray',
          tabBarInactiveTintColor: 'gray',
        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            if (!isAuthenticated) {
              e.preventDefault();
              Alert.alert('Authentication Required', 'Please sign in to access the shop.');
            }
          },
        })}
      />
      <Tab.Screen
        name='Cart'
        component={Cart}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name={focused ? 'cart' : 'cart-outline'}
              color={isAuthenticated ? 'white' : 'gray'} // Grey out if not authenticated
              size={size}
            />
          ),
          tabBarBadge: isAuthenticated && totalQuantity > 0 ? totalQuantity : null,
          tabBarActiveTintColor: isAuthenticated ? 'white' : 'gray',
          tabBarInactiveTintColor: 'gray',
        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            if (!isAuthenticated) {
              e.preventDefault();
              Alert.alert('Authentication Required', 'Please sign in to access your cart.');
            }
          },
        })}
      />
      <Tab.Screen
        name='Orders'
        component={OrdersScreen}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name={focused ? 'list' : 'list-outline'}
              color={isAuthenticated ? 'white' : 'gray'} // Grey out if not authenticated
              size={size}
            />
          ),
          tabBarBadge: isAuthenticated && newOrdersCount > 0 ? newOrdersCount : null,
          tabBarActiveTintColor: isAuthenticated ? 'white' : 'gray',
          tabBarInactiveTintColor: 'gray',
        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            if (!isAuthenticated) {
              e.preventDefault();
              Alert.alert('Authentication Required', 'Please sign in to access your orders.');
            }
          },
        })}
      />
      <Tab.Screen
        name='Profile'
        component={isAuthenticated ? UserProfileScreen : AuthStackNavigator}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name={focused ? 'person' : 'person-outline'}
              color={'white'} // Always white since this tab is always accessible
              size={size}
            />
          ),
          headerShown: isAuthenticated, // Only show profile header when authenticated
        }}
      />
    </Tab.Navigator>
  );
}

function AppContent() {
  const [isSplashVisible, setIsSplashVisible] = useState(true);
  
  if (isSplashVisible) {
    return <ManualSplashScreen onFinish={() => setIsSplashVisible(false)} />;
  }

  return(
    <NavigationContainer>
      <MainTabNavigator />
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