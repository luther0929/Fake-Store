import { View, Text, StyleSheet, Image, Pressable } from "react-native";

export default function ProductCard({products, onPress}) {

    return(
        <Pressable style={styles.container} onPress={onPress}>
            <Text>{products.title}</Text>
            <Image style={styles.image} source={{uri: products.image}} resizeMode="contain"/>
            <Text>{products.rating.rate}</Text>
        </Pressable>
    );
}

// {"id":9,
//     "title":"WD 2TB Elements Portable External Hard Drive - USB 3.0 ",
//     "price":64,
//     "description":"USB 3.0 and USB 2.0 Compatibility Fast data transfers Improve PC Performance High Capacity; Compatibility Formatted NTFS for Windows 10, Windows 8.1, Windows 7; Reformatting may be required for other operating systems; Compatibility may vary depending on user’s hardware configuration and operating system",
//     "category":"electronics","image":"https://fakestoreapi.com/img/61IBBVJvSDL._AC_SY879_.jpg",
//     "rating":{"rate":3.3,"count":203}}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        width: '100%',
        margin: 10,
        borderRadius: 16,
        backgroundColor: 'white',
    },
    image: {
        width: 150,
        height: 150
    }
})