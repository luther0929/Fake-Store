import { View, Text, StyleSheet, Image, Pressable } from "react-native";
import { commonStyles } from "../styles/common";
import { colors } from "../styles/colors";
import { spacing } from "../styles/spacing";
import CustomImage from './CustomImage';

export default function ProductCard({products, onPress}) {

    return(
        <Pressable style={[commonStyles.card, { height: 190 }]} onPress={onPress}>
            <View style={styles.imageContainer} >
                <CustomImage
                    source={{uri: products.image}}
                    size = {120}
                />
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.text}>{products.title}</Text>
                <Text style={styles.text}>Price: ${products.price}</Text>
                <Text style={styles.text}>Rating: {products.rating.rate}</Text>
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    imageContainer: {
        margin: spacing.small,
        padding: spacing.small,
        borderWidth: spacing.border,
        borderRadius: spacing.medium,
        backgroundColor: 'white',
        borderColor: colors.accent
    },
    textContainer: {
        paddingVertical: 10,
        justifyContent: 'space-around',
        width: '40%',
        gap: spacing.medium,
    },
    text: {
        flexWrap: 'wrap',
        color: '#fff'
    }
})