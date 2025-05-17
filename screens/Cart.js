import { View, Text, FlatList, Alert, ActivityIndicator } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, removeFromCart, clearCart, fetchCart, updateCart } from "../redux/cartSlice";
import { createOrder } from '../redux/ordersSlice';
import { commonStyles } from "../styles/common";
import CartProductCard from "../components/CartProductCard";
import { spacing } from "../styles/spacing";
import { StyleSheet } from "react-native";
import { colors } from "../styles/colors";
import { useEffect, useState } from "react";
import CustomButton from "../components/CustomButton";
import { fetchProducts } from "../redux/productsSlice";

export default function Cart() {
    const dispatch = useDispatch();
    const { cartItems, totalPrice, totalQuantity, isLoading, error } = useSelector(state => state.cart);
    const { token, isAuthenticated } = useSelector(state => state.auth);
    const { products } = useSelector(state => state.products);
    
    // Use state to track if initial load has happened
    const [initialLoad, setInitialLoad] = useState(false);
    // Use state to track if cart update is in progress
    const [updateInProgress, setUpdateInProgress] = useState(false);

    // Fetch products first to make sure we have product details
    useEffect(() => {
        if (products.length === 0 && isAuthenticated) {
            dispatch(fetchProducts())
                .unwrap()
                .catch(error => {
                    console.error('Error fetching products:', error);
                });
        }
    }, [dispatch, products, isAuthenticated]);

    // Fetch cart from server when component mounts - ONLY if we have a valid token
    useEffect(() => {
        if (token && isAuthenticated && !initialLoad) {
            // Add a small delay to make sure token is ready
            const timer = setTimeout(() => {
                dispatch(fetchCart(token))
                    .unwrap()
                    .then(() => {
                        setInitialLoad(true);
                    })
                    .catch(error => {
                        console.error('Error fetching cart:', error);
                        // Don't show alert to avoid annoying the user
                        setInitialLoad(true); // Still set initialLoad to prevent repeated fetch attempts
                    });
            }, 300);
            
            return () => clearTimeout(timer);
        }
    }, [dispatch, token, initialLoad, isAuthenticated]);

    // Process cart items to include product details
    const processedCartItems = cartItems.map(item => {
        // If the cart item already has all details, return it as is
        if (item.title && item.image && item.description) {
            return item;
        }
        
        // Find the product in the products array
        const productDetails = products.find(p => p.id === item.id);
        
        // Return item with product details if found, otherwise return the item as is
        return productDetails ? {
            ...item,
            title: productDetails.title,
            image: productDetails.image,
            description: productDetails.description,
            category: productDetails.category,
            rating: productDetails.rating,
            // Make sure we keep the quantity from the cart item
            quantity: item.quantity || item.count || 1
        } : item;
    });

    // Save cart changes to server (with debounce)
    useEffect(() => {
        if (!initialLoad || cartItems.length === 0 || !token || !isAuthenticated) return;
        
        const saveCartToServer = () => {
            if (!updateInProgress) {
                setUpdateInProgress(true);
                
                console.log('Saving cart to server:', cartItems);
                
                dispatch(updateCart({ 
                    token, 
                    items: cartItems.map(item => ({
                        id: item.id,
                        price: item.price,
                        count: item.quantity || item.count || 1
                    }))
                }))
                .unwrap()
                .then(() => {
                    console.log('Cart saved successfully');
                })
                .catch(error => {
                    console.error('Error saving cart to server:', error);
                })
                .finally(() => {
                    setUpdateInProgress(false);
                });
            }
        };
        
        // Use a timeout to debounce and avoid too many server updates
        const timeoutId = setTimeout(saveCartToServer, 1000);
        return () => clearTimeout(timeoutId);
    }, [cartItems, token, initialLoad, updateInProgress, dispatch, isAuthenticated]);

    const handleAddToCart = (cartItem) => {
        dispatch(addToCart(cartItem));
    };

    const handleRemoveFromCart = (cartItem) => {
        dispatch(removeFromCart(cartItem));
    };

    const handleCheckout = () => {
        if (cartItems.length === 0) {
            Alert.alert('Cart Empty', 'Your cart is empty. Add some items before checkout.');
            return;
        }

        Alert.alert(
            'Confirm Checkout',
            'Do you want to create an order with these items?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Confirm',
                    onPress: () => {
                        // Create a new order with the cart items
                        dispatch(createOrder({ 
                            token, 
                            items: cartItems.map(item => ({
                                prodID: item.id,
                                price: item.price,
                                quantity: item.quantity || 1
                            }))
                        }))
                        .unwrap()
                        .then(() => {
                            // Clear the cart after successful order creation
                            dispatch(clearCart());
                            // Show success message
                            Alert.alert('Success', 'Your order has been placed successfully!');
                        })
                        .catch(error => {
                            console.error('Error creating order:', error);
                            Alert.alert('Error', 'Failed to create order. Please try again.');
                        });
                    },
                },
            ]
        );
    };

    const renderHeader = () => (
        <View style={styles.headerContainer}>
            <Text style={styles.text}>Total Price: ${totalPrice}</Text>
            <Text style={styles.text}>Total Quantity: {totalQuantity}</Text>
            
            {cartItems.length > 0 && (
                <CustomButton 
                    text="Checkout"
                    handlePress={handleCheckout}
                    color={colors.primary}
                    width={200}
                />
            )}
        </View>
    );

    const renderItem = ({item}) => (
        <CartProductCard 
            item={item} 
            onAddToCart={handleAddToCart} 
            onRemoveFromCart={handleRemoveFromCart}
        />
    );

    // Show loading indicator while fetching cart
    if (isLoading && !initialLoad) {
        return (
            <View style={[commonStyles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color={colors.secondary} />
                <Text style={styles.loadingText}>Loading your cart...</Text>
            </View>
        );
    }

    // Show specific message if not authenticated 
    if (!isAuthenticated || !token) {
        return (
            <View style={[commonStyles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <Text style={styles.errorText}>
                    Please sign in to view your cart.
                </Text>
            </View>
        );
    }

    // Show error message if there's an error and we've attempted to load
    if (error && initialLoad) {
        return (
            <View style={[commonStyles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <Text style={styles.errorText}>
                    Error loading cart: {error}
                </Text>
                <CustomButton 
                    text="Try Again"
                    handlePress={() => {
                        setInitialLoad(false); // Reset initialLoad to try again
                    }}
                    color={colors.primary}
                />
            </View>
        );
    }

    return(
        <View style={[commonStyles.container, { justifyContent: 'center', alignItems: 'center' }]}>
            {processedCartItems.length === 0 ? (
                <Text style={{fontSize: spacing.medium, textAlign: 'center', alignItems: 'center'}}>
                    Your shopping cart is empty
                </Text>
            ) : (
                <FlatList
                    data={processedCartItems}
                    renderItem={renderItem}
                    keyExtractor={item => item.id.toString()}
                    ListHeaderComponent={renderHeader}
                />
            )}
            {updateInProgress && (
                <View style={styles.savingIndicator}>
                    <ActivityIndicator size="small" color={colors.secondary} />
                    <Text style={styles.savingText}>Saving cart...</Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    text: {
        margin: spacing.small,
        flexWrap: 'wrap',
        color: 'white',
        textAlign: 'center',
        fontSize: spacing.medium,
    },
    headerContainer: {
        width: 280,
        margin: spacing.medium,
        padding: spacing.small,
        backgroundColor: colors.secondary,
        borderRadius: spacing.medium,
        alignSelf: 'center',
        alignItems: 'center'
    },
    savingIndicator: {
        position: 'absolute',
        bottom: 10,
        right: 10,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 15,
    },
    savingText: {
        marginLeft: 5,
        fontSize: 12,
        color: colors.secondary,
    },
    errorText: {
        fontSize: spacing.medium,
        color: 'red',
        textAlign: 'center',
        marginBottom: spacing.big,
    },
    loadingText: {
        fontSize: spacing.medium,
        color: colors.secondary,
        marginTop: spacing.medium,
    }
});