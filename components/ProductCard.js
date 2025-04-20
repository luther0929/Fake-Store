import { View, Text, StyleSheet, Image, Pressable } from "react-native";

export default function ProductCard({products, onPress}) {

    return(
        <Pressable style={styles.container} onPress={onPress}>
            <View style={styles.imageContainer}>
                <Image style={styles.image} source={{uri: products.image}} resizeMode="contain"/>
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.title}>{products.title}</Text>
                <Text>Price: ${products.price}</Text>
                <Text>Rating: {products.rating.rate}</Text>
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        width: '100%',
        margin: 10,
        borderRadius: 16,
        backgroundColor: '#e6d2b9',
        justifyContent: 'space-around',
        borderWidth: 1
    },
    imageContainer: {
        margin: 12,
        padding: 10,
        borderWidth: 1,
        borderRadius: 16,
        backgroundColor: '#fff',
    },
    image: {
        width: 150,
        height: 150,
    },
    textContainer: {
        paddingVertical: 10,
        justifyContent: 'space-around',
        width: '40%',
        gap: 10,
    },
    title: {
        flexWrap: 'wrap',
    }
})