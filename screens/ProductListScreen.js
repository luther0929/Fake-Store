import { View, ScrollView, ActivityIndicator } from "react-native";
import { useRoute, useNavigation } from '@react-navigation/native';
import { commonStyles } from '../styles/common';
import useProducts from '../hooks/useProducts'
import { colors } from "../styles/colors";
import ProductCard from '../components/ProductCard';
import LoadingIndicator from "../components/LoadingIndicator";

export default function ProductListScreen() {
    const { products, isLoading, error } = useProducts();
    const route = useRoute();
    const navigation = useNavigation();
    const { category } = route.params || {};
    const filteredProducts = products.filter(product => category === product.category);

    const handlePress = (product) => {
        navigation.navigate('ProductScreen', {product});
    }

    if(isLoading) {
        return(
            <LoadingIndicator
                size={80}
                backgroundColor={colors.primary}
            />
        );
    }

    return(
        <ScrollView style={[commonStyles.container, {paddingVertical: '5%'}]}> 
            <View style={commonStyles.list}>
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
