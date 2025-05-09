import { View, Text, StyleSheet, Image, ScrollView} from "react-native";
import { useRoute } from "@react-navigation/native";
import { commonStyles } from "../styles/common";
import { colors } from "../styles/colors";
import { spacing } from "../styles/spacing";
import { Ionicons } from '@expo/vector-icons';
import CustomImage from "../components/CustomImage";
import CustomButton from "../components/CustomButton";
import LoadingIndicator from "../components/LoadingIndicator";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/cartSlice";

export default function ProductScreen() {
    const dispatch = useDispatch();
    const route = useRoute();
    const { selectedProduct } = useSelector(state => state.products);

    if (!selectedProduct) {
       return <LoadingIndicator size={80}/>
    }

    const handleAddToCart = () => {
        dispatch(addToCart(selectedProduct));
    };

    return(
        <ScrollView>
            <View style={[commonStyles.container, {paddingHorizontal:0, backgroundColor: "white"}]}>
                <View style={styles.imageContainer}>
                    <CustomImage
                        source={{uri: selectedProduct.image}}
                        size={200}
                    />
                </View>
                <View style={[styles.textContainer, {borderRadius: 30}]}>
                    <View>
                        <Text style={[styles.text, {fontWeight: 'bold', fontSize: 18}]}>{selectedProduct.title}</Text>
                        <View style={{paddingVertical: 10, flexDirection: 'row', alignItems: 'center', gap: 4}}>
                        <Ionicons name="star" size={16} color="white" />
                            <Text style={[styles.text, {fontSize: 16}]}>{selectedProduct.rating.rate}</Text>
                        </View>
                    </View>
                    <View style={{gap:5, paddingVertical: 25}}>
                        <Text style={[styles.text, {fontWeight:'bold'}]}>Description</Text>
                        <Text style={styles.text}>{selectedProduct.description}</Text>
                    </View>
                    
                    <Text style={[styles.text, {fontSize: 24, paddingVertical: 20}]}>${selectedProduct.price}</Text>

                    <CustomButton
                        text={'Add to cart'}
                        handlePress={handleAddToCart}
                    />
            
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    imageContainer: {
        padding: spacing.big,
        borderWidth: spacing.border,
        borderColor: colors.accent,
        width: '100%',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    textContainer: {
        padding: spacing.medium,
        paddingVertical: 30,
        height: '100%', //fix this
        backgroundColor: colors.secondary,
    },
    text: {
        color: 'white',
        textAlign: 'justify'
    }
})
