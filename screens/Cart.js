import { View, Text, FlatList, Alert, ActivityIndicator } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, removeFromCart, clearCart, fetchCart, updateCart } from "../redux/cartSlice";
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
    const { token } = useSelector(state => state.auth);
    const { products } = useSelector(state => state.products);
    
    // Use state to track if initial load has happened
    const [initialLoad, setInitialLoad] = useState(false);
    // Use state to track if cart update is in progress
    const [updateInProgress, setUpdateInProgress] = useState(false);

    // Fetch products first to make sure we have product details
    useEffect(() => {
        if (products.length === 0) {
            dispatch(fetchProducts())
                .unwrap()
                .catch(error => {
                    console.error('Error fetching products:', error);
                });
        }
    }, [dispatch, products]);

    // Fetch cart from server when component mounts
    useEffect(() => {
        if (token && !initialLoad) {
            dispatch(fetchCart(token))
                .unwrap()
                .then(() => {
                    setInitialLoad(true);
                })
                .catch(error => {
                    console.error('Error fetching cart:', error);
                    Alert.alert('Error', `Failed to load cart: ${error}`);
                    setInitialLoad(true); // Still set initialLoad to prevent repeated fetch attempts
                });
        }
    }, [dispatch, token, initialLoad]);

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
        if (!initialLoad || cartItems.length === 0) return;
        
        const saveCartToServer = () => {
            if (token && !updateInProgress) {
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
    }, [cartItems, token, initialLoad, updateInProgress, dispatch]);

    const handleAddToCart = (cartItem) => {
        dispatch(addToCart(cartItem));
    };

    const handleRemoveFromCart = (cartItem) => {
        dispatch(removeFromCart(cartItem));
    };

    const handleCheckout = () => {
        // Will be implemented later
        Alert.alert('Checkout', 'Checkout functionality will be implemented in the next step.');
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

    if (isLoading && !initialLoad) {
        return (
            <View style={[commonStyles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color={colors.secondary} />
            </View>
        );
    }

    if (error) {
        return (
            <View style={[commonStyles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <Text style={{ fontSize: spacing.medium, color: 'red', textAlign: 'center' }}>
                    Error loading cart: {error}
                </Text>
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
    }
});