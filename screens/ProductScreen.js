import { View, Text, StyleSheet, Image, ScrollView } from "react-native";
import { useRoute } from "@react-navigation/native";
import { commonStyles } from "../styles/common";
import { colors } from "../styles/colors";
import { spacing } from "../styles/spacing";
import CustomImage from "../components/CustomImage";

export default function ProductScreen() {
    const route = useRoute();
    const { product } = route.params || {};

    return(
        <View style={commonStyles.container}>
            <View style={styles.imageContainer}>
                <CustomImage
                    source={{uri: product.image}}
                    size={200}
                />
            </View>
            <ScrollView style={styles.textContainer}>
                <Text>{product.title}</Text>
                <Text>Price ${product.price}</Text>
                <Text>{product.description}</Text>
                <Text>{product.category}</Text>
                <Text>{product.rating.rate}</Text>
            </ScrollView>
            
        </View>
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
        height: '100%', //fix this
        backgroundColor: colors.secondary,
    }
})
