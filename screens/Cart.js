import { View, Text } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import CustomButton from "../components/CustomButton";
import { addToCart, removeFromCart } from "../redux/cartSlice";

export default function Cart() {
    const dispatch = useDispatch();
    const { cartItems, totalPrice, totalQuantity } = useSelector(state => state.cart);

    const handleAddToCart = (cartItem) => {
        dispatch(addToCart(cartItem))
    }

    const handleRemoveFromCart = (cartItem) => {
        dispatch(removeFromCart(cartItem))
    }

    return(
        <View>
            {cartItems.map(cartItem => (
                <View style={{flexDirection: 'row'}} key={cartItem.id}>
                    <CustomButton 
                        text='-'
                        handlePress={() => handleRemoveFromCart(cartItem)}
                    />
                    <CustomButton 
                        text='+'
                        handlePress={() => handleAddToCart(cartItem)}
                    />
                    <View key={cartItem.id}>
                        <Text>{cartItem.title}</Text>
                    </View>
                    
                </View>
            ))}
            <Text>totalPrice: ${totalPrice}</Text>
            <Text>totalQuantity: {totalQuantity}</Text>
        </View>
    );
}