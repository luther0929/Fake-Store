import { View, Text, FlatList } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, removeFromCart } from "../redux/cartSlice";
import { commonStyles } from "../styles/common";
import CartProductCard from "../components/CartProductCard";
import { spacing } from "../styles/spacing";
import { StyleSheet } from "react-native";
import { colors } from "../styles/colors";

export default function Cart() {
    const dispatch = useDispatch();
    const { cartItems, totalPrice, totalQuantity } = useSelector(state => state.cart);

    const handleAddToCart = (cartItem) => {
        dispatch(addToCart(cartItem))
    }

    const handleRemoveFromCart = (cartItem) => {
        dispatch(removeFromCart(cartItem))
    }

    const renderHeader = () => (
        <View style={styles.headerContainer}>
            <Text style={styles.text}>Total Price: ${totalPrice}</Text>
            <Text style={styles.text}>Total Quantity: {totalQuantity}</Text>
        </View>
    );

    const renderItem = ({item}) => (
        <CartProductCard item = {item} onAddToCart={handleAddToCart} onRemoveFromCart={handleRemoveFromCart}/>
    );

    return(
        <View style={[commonStyles.container, { justifyContent: 'center', alignItems: 'center' }]}>
            {cartItems.length === 0 ? (
                <Text style={{fontSize: spacing.medium, textAlign: 'center', alignItems: 'center'}}>Your shopping cart is empty</Text>
            ) : (
                <FlatList
                    data={cartItems}
                    renderItem={renderItem}
                    keyExtractor={item => item.id.toString()}
                    ListHeaderComponent={renderHeader}
                />
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
        alignSelf: 'center'
    }
})
