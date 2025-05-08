import { View, ScrollView, ActivityIndicator } from "react-native";
import { useRoute, useNavigation } from '@react-navigation/native';
import { commonStyles } from '../styles/common';
import { fetchProducts } from "../redux/productsSlice";
import { colors } from "../styles/colors";
import ProductCard from '../components/ProductCard';
import LoadingIndicator from "../components/LoadingIndicator";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

export default function ProductListScreen() {
    const dispatch = useDispatch();
    const { products, isLoading, error } = useSelector(state => state.products);
    const route = useRoute();
    const navigation = useNavigation();
    const { category } = route.params || {};
    const filteredProducts = products.filter(product => category === product.category);

    const handlePress = (product) => {
        navigation.navigate('ProductScreen', {product});
    }

    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch])

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
                        product={filteredProduct}
                        onPress={() => handlePress(filteredProduct)}
                        key={filteredProduct.id}
                    />
                })}
            </View>
        </ScrollView>
    );
}
