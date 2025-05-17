// OrdersScreen.js - Updated to show empty categories

import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { fetchOrders, updateOrderStatus, clearOrdersError } from '../redux/ordersSlice';
import { fetchProducts } from '../redux/productsSlice';
import { colors } from '../styles/colors';
import { commonStyles } from '../styles/common';
import { spacing } from '../styles/spacing';
import CustomButton from '../components/CustomButton';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { getFirstThreeWords } from '../utils/stringUtils';
import CustomImage from '../components/CustomImage';

export default function OrdersScreen() {
  const dispatch = useDispatch();
  const { orders, isLoading, error } = useSelector(state => state.orders);
  const { token, isAuthenticated } = useSelector(state => state.auth);
  const { products } = useSelector(state => state.products);
  
  // Track expanded order items
  const [expandedOrders, setExpandedOrders] = useState({});
  // Track expanded categories
  const [expandedCategories, setExpandedCategories] = useState({
    'New Orders': true,
    'Paid Orders': true,
    'Delivered Orders': true
  });
  
  // Use useFocusEffect to refresh orders when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      if (token && isAuthenticated) {
        // Always ensure we have products loaded
        dispatch(fetchProducts());
        dispatch(clearOrdersError());
        loadOrders();
      }
      return () => {}; // cleanup function
    }, [dispatch, token, isAuthenticated])
  );
  
  // Also load orders when component mounts
  useEffect(() => {
    if (token && isAuthenticated) {
      // Always ensure we have products loaded
      dispatch(fetchProducts());
      dispatch(clearOrdersError());
      loadOrders();
    }
  }, [dispatch, token, isAuthenticated]);
  
  // Refresh orders when there's an error
  useEffect(() => {
    if (error) {
      Alert.alert('Error', error);
    }
  }, [error]);
  
  const loadOrders = () => {
    if (token) {
      dispatch(fetchOrders(token))
        .unwrap()
        .catch(error => {
          console.error('Error loading orders:', error);
        });
    }
  };
  
  const toggleOrderExpanded = (orderId) => {
    setExpandedOrders(prev => ({
      ...prev,
      [orderId]: !prev[orderId]
    }));
  };
  
  const toggleCategoryExpanded = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };
  
  const handlePayOrder = (orderId) => {
    Alert.alert(
      'Pay Order',
      'Do you want to mark this order as paid?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: () => {
            // Use binary values (0 or 1) for isPaid and isDelivered fields
            dispatch(updateOrderStatus({
              token,
              orderId,
              isPaid: 1, // Use 1 instead of true
              isDelivered: 0 // Use 0 instead of false
            }))
              .unwrap()
              .then(() => {
                Alert.alert('Success', 'Order has been marked as paid');
                // Refresh orders to show updated status
                loadOrders();
              })
              .catch(error => {
                console.error('Error updating order:', error);
                Alert.alert('Error', 'Failed to update order status');
              });
          },
        },
      ]
    );
  };
  
  const handleReceiveOrder = (orderId) => {
    Alert.alert(
      'Receive Order',
      'Do you want to mark this order as delivered?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: () => {
            // Use binary values (0 or 1) for isPaid and isDelivered fields
            dispatch(updateOrderStatus({
              token,
              orderId,
              isPaid: 1, // Use 1 instead of true
              isDelivered: 1 // Use 1 instead of true
            }))
              .unwrap()
              .then(() => {
                Alert.alert('Success', 'Order has been marked as delivered');
                // Refresh orders to show updated status
                loadOrders();
              })
              .catch(error => {
                console.error('Error updating order:', error);
                Alert.alert('Error', 'Failed to update order status');
              });
          },
        },
      ]
    );
  };
  
  // Parse order items from string to array
  const parseOrderItems = (orderItemsString) => {
    try {
      // Handle the case where order_items might already be parsed as an array
      if (Array.isArray(orderItemsString)) {
        return orderItemsString;
      }
      
      // Handle string format
      if (typeof orderItemsString === 'string') {
        return JSON.parse(orderItemsString);
      }
      
      // If none of the above, return empty array
      return [];
    } catch (error) {
      console.error('Error parsing order items:', error);
      return [];
    }
  };
  
  // Find a product that matches the price (since we don't have product IDs)
  const findProductByPrice = (price) => {
    // Check if price is a string and convert it to number
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    
    // Find products with similar price (allowing for small rounding differences)
    return products.find(product => {
      const productPrice = typeof product.price === 'string' ? parseFloat(product.price) : product.price;
      return Math.abs(productPrice - numPrice) < 0.01;
    });
  };
  
  // Group orders by status - using numeric values (0/1) instead of boolean
  const newOrders = orders.filter(order => order.is_paid === 0 && order.is_delivered === 0);
  const paidOrders = orders.filter(order => order.is_paid === 1 && order.is_delivered === 0);
  const deliveredOrders = orders.filter(order => order.is_paid === 1 && order.is_delivered === 1);
  
  // Calculate totals for order summary
  const getOrderSummary = (order) => {
    if (!order) return { totalItems: 0, totalAmount: 0 };
    
    // Parse order items if they're in string format
    const orderItems = parseOrderItems(order.order_items);
    
    if (!orderItems || orderItems.length === 0) {
      return { 
        totalItems: order.item_numbers || 0, 
        totalAmount: order.total_price ? (order.total_price / 100).toFixed(2) : '0.00'
      };
    }
    
    const totalItems = orderItems.reduce((sum, item) => sum + (item.quantity || 0), 0);
    const totalAmount = orderItems.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 0)), 0);
    
    return { 
      totalItems: totalItems || order.item_numbers || 0, 
      totalAmount: totalAmount.toFixed(2) || (order.total_price ? (order.total_price / 100).toFixed(2) : '0.00')
    };
  };
  
  // Get category color using the app's color palette
  const getCategoryColor = (category) => {
    switch (category) {
      case 'New Orders':
        return colors.secondary; // Using the app's secondary color
      case 'Paid Orders':
        return '#445566'; // A muted blue-gray that complements the app's palette
      case 'Delivered Orders':
        return '#5D4037'; // A muted brown that complements the app's palette
      default:
        return colors.secondary;
    }
  };
  
  // Get order color based on status
  const getOrderColor = (isPaid, isDelivered) => {
    if (isDelivered === 1) return '#5D4037'; // Muted brown for delivered
    if (isPaid === 1) return '#445566'; // Muted blue-gray for paid
    return colors.secondary; // App's secondary color for new
  };
  
  const renderOrderItem = (order, categoryTitle) => {
    const { totalItems, totalAmount } = getOrderSummary(order);
    const isExpanded = expandedOrders[order.id] || false;
    const orderItems = parseOrderItems(order.order_items);
    const orderColor = getOrderColor(order.is_paid, order.is_delivered);
    
    return (
      <View 
        style={[
          styles.orderContainer, 
          { backgroundColor: orderColor }
        ]} 
        key={order.id}
      >
        <TouchableOpacity onPress={() => toggleOrderExpanded(order.id)} style={styles.orderHeader}>
          <View style={styles.orderSummary}>
            <Text style={styles.orderText}>Order #{order.id}</Text>
            <Text style={styles.orderText}>Items: {totalItems}</Text>
            <Text style={styles.orderText}>Total: ${totalAmount}</Text>
          </View>
          <Ionicons 
            name={isExpanded ? 'chevron-up' : 'chevron-down'} 
            size={24} 
            color="white" 
          />
        </TouchableOpacity>
        
        {isExpanded && (
          <View style={styles.orderDetails}>
            <Text style={styles.detailTitle}>Items:</Text>
            {orderItems && orderItems.length > 0 ? (
              orderItems.map((item, index) => {
                // Try to find a product with matching price
                const product = findProductByPrice(item.price);
                
                return (
                  <View key={index} style={styles.orderItem}>
                    {product && (
                      <View style={styles.imageContainer}>
                        <CustomImage
                          source={{ uri: product.image }}
                          size={50}
                        />
                      </View>
                    )}
                    <View style={styles.itemDetails}>
                      <Text style={styles.orderItemText}>
                        {product ? getFirstThreeWords(product.title) : `Item #${index + 1}`}
                      </Text>
                      <Text style={styles.orderItemText}>Qty: {item.quantity}</Text>
                      <Text style={styles.orderItemText}>Price: ${item.price}</Text>
                      <Text style={styles.orderItemText}>Subtotal: ${(item.price * item.quantity).toFixed(2)}</Text>
                    </View>
                  </View>
                );
              })
            ) : (
              <Text style={styles.noItemsText}>No items available for this order</Text>
            )}
            
            <View style={styles.buttonContainer}>
              {order.is_paid === 0 && (
                <CustomButton 
                  text="Pay"
                  handlePress={() => handlePayOrder(order.id)}
                  color={colors.primary}
                />
              )}
              
              {order.is_paid === 1 && order.is_delivered === 0 && (
                <CustomButton 
                  text="Receive"
                  handlePress={() => handleReceiveOrder(order.id)}
                  color={colors.primary}
                />
              )}
            </View>
          </View>
        )}
      </View>
    );
  };
  
  const renderCategory = ({ item }) => {
    const isExpanded = expandedCategories[item.title];
    const categoryColor = getCategoryColor(item.title);
    
    return (
      <View style={styles.section}>
        <TouchableOpacity 
          style={[styles.categoryHeader, { backgroundColor: categoryColor }]}
          onPress={() => toggleCategoryExpanded(item.title)}
        >
          <Text style={styles.categoryTitle}>{item.title} ({item.data.length})</Text>
          <Ionicons 
            name={isExpanded ? 'chevron-up' : 'chevron-down'} 
            size={24} 
            color="white" 
          />
        </TouchableOpacity>
        
        {isExpanded && (
          <View style={styles.categoryContent}>
            {item.data.length > 0 ? (
              item.data.map(order => renderOrderItem(order, item.title))
            ) : (
              <View style={styles.emptyContainer}>
                <Text style={styles.noOrdersInSectionText}>No orders in this category</Text>
              </View>
            )}
          </View>
        )}
      </View>
    );
  };
  
  // Show loading indicator while fetching orders
  if (isLoading && orders.length === 0) {
    return (
      <View style={[commonStyles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.secondary} />
        <Text style={styles.loadingText}>Loading your orders...</Text>
      </View>
    );
  }
  
  // Show loading indicator if products aren't loaded yet
  if (products.length === 0) {
    return (
      <View style={[commonStyles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.secondary} />
        <Text style={styles.loadingText}>Loading product information...</Text>
      </View>
    );
  }
  
  // Show message if not authenticated
  if (!isAuthenticated || !token) {
    return (
      <View style={[commonStyles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={styles.errorText}>
          Please sign in to view your orders.
        </Text>
      </View>
    );
  }
  
  // Show message if no orders
  if (orders.length === 0) {
    return (
      <View style={[commonStyles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={styles.noOrdersText}>
          You don't have any orders yet.
        </Text>
      </View>
    );
  }
  
  return (
    <View style={commonStyles.container}>
      <FlatList
        data={[
          { title: 'New Orders', data: newOrders },
          { title: 'Paid Orders', data: paidOrders },
          { title: 'Delivered Orders', data: deliveredOrders }
        ]}
        keyExtractor={(item, index) => `section-${index}`}
        renderItem={renderCategory}
        contentContainerStyle={{ paddingTop: spacing.medium }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: spacing.big,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.medium,
    paddingHorizontal: spacing.medium,
    marginBottom: spacing.small,
    borderRadius: spacing.medium,
    marginHorizontal: spacing.small,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  categoryContent: {
    paddingHorizontal: spacing.small,
  },
  orderContainer: {
    borderRadius: spacing.medium,
    marginVertical: spacing.small,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.medium,
  },
  orderSummary: {
    flex: 1,
  },
  orderText: {
    color: 'white',
    marginBottom: spacing.small / 2,
    fontSize: 16,
    fontWeight: '500',
  },
  orderDetails: {
    padding: spacing.medium,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.3)',
  },
  detailTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: spacing.medium,
  },
  orderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.small,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginBottom: spacing.small,
    borderRadius: spacing.small,
    padding: spacing.small,
  },
  imageContainer: {
    marginRight: spacing.medium,
    backgroundColor: 'white',
    borderRadius: spacing.small,
    padding: spacing.small / 2,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  itemDetails: {
    flex: 1,
  },
  orderItemText: {
    color: 'white',
    fontSize: 14,
    marginBottom: 2,
  },
  buttonContainer: {
    marginTop: spacing.medium,
    alignItems: 'center',
  },
  noOrdersText: {
    fontSize: 18,
    color: colors.secondary,
    marginBottom: spacing.big,
    textAlign: 'center',
  },
  emptyContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: spacing.medium,
    padding: spacing.medium,
    marginVertical: spacing.small,
  },
  noOrdersInSectionText: {
    color: colors.secondary,
    fontStyle: 'italic',
    textAlign: 'center',
    padding: spacing.small,
  },
  noItemsText: {
    color: 'white',
    fontStyle: 'italic',
    textAlign: 'center',
    marginVertical: spacing.small,
  },
  loadingText: {
    fontSize: spacing.medium,
    color: colors.secondary,
    marginTop: spacing.medium,
  },
  errorText: {
    fontSize: spacing.medium,
    color: 'red',
    textAlign: 'center',
    marginBottom: spacing.big,
  },
});