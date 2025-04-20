import { View, Text, StyleSheet, Image } from "react-native";
import { useRoute } from "@react-navigation/native";

export default function ProductScreen() {
    const route = useRoute();
    const { product } = route.params || {};

    return(
        <View style={styles.container}>
            <View style={styles.imageContainer}>
                <Image
                    style={styles.image}
                    source={{uri: product.image}}
                    resizeMode="contain"
                />
            </View>
            <View style={styles.textContainer}>
                <Text>{product.title}</Text>
                <Text>Price ${product.price}</Text>
                <Text>{product.description}</Text>
                <Text>{product.category}</Text>
                <Text>{product.rating.rate}</Text>
            </View>
            
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        width: '100%',
        backgroundColor: 'white',
        alignContent: 'center',
        borderWidth: 1,
    },
    imageContainer: {
        padding: 20,
        borderWidth: 1,
        width: '100%',
        alignItems: 'center',
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24
    },
    image: {
        width: 200,
        height: 200
    },
    textContainer: {
        padding: 16,
        height: '60%', //fix this
        backgroundColor: '#e6d2b9',
        justifyContent: 'space-around'
    }
})
