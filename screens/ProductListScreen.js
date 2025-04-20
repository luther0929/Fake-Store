import useProducts from '../hooks/useProducts'
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from "react-native";
import ProductCard from '../components/ProductCard';
import { useRoute, useNavigation } from '@react-navigation/native';

export default function ProductListScreen() {
    const { products, isLoading, error } = useProducts();
    const route = useRoute();
    const navigation = useNavigation();
    const { category } = route.params || {};
    const filteredProducts = products.filter(product => category === product.category);

    const handlePress = (product) => {
        navigation.navigate('ProductScreen', {product});
    }

    return(
        <ScrollView style={styles.container}> 
            <View style={styles.list}>
                {filteredProducts.map((filteredProduct) => {
                    return <ProductCard
                        products={filteredProduct}
                        onPress={() => handlePress(filteredProduct)}
                        key={filteredProduct.id}
                    />
                })}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        height: '100%',
        paddingHorizontal: 16,
        backgroundColor: '#fff',
    },
    list: {
        width: '100%',
        flex: 5,
        alignItems: 'center',
        justifyContent: 'center',
    }

})