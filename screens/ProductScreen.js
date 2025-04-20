import { View, Text, StyleSheet, Image } from "react-native";
import { useRoute } from "@react-navigation/native";

export default function ProductScreen() {
    const route = useRoute();
    const { product } = route.params || {};

    return(
        <View>
            <Image style={styles.image} source={{uri: product.image}}/>
            <Text>{product.title}</Text>
            <Text>{product.price}</Text>
            <Text>{product.description}</Text>
            <Text>{product.category}</Text>
            <Text>{product.rating.rate}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    image: {
        width: 150,
        height: 150
    }
})


// {"id":9,
//     "title":"WD 2TB Elements Portable External Hard Drive - USB 3.0 ",
//     "price":64,
//     "description":"USB 3.0 and USB 2.0 Compatibility Fast data transfers Improve PC Performance High Capacity; Compatibility Formatted NTFS for Windows 10, Windows 8.1, Windows 7; Reformatting may be required for other operating systems; Compatibility may vary depending on user’s hardware configuration and operating system",
//     "category":"electronics","image":"https://fakestoreapi.com/img/61IBBVJvSDL._AC_SY879_.jpg",
//     "rating":{"rate":3.3,"count":203}}