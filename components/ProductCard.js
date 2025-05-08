import { View, Text, StyleSheet, Image, Pressable } from "react-native";
import { commonStyles } from "../styles/common";
import { colors } from "../styles/colors";
import { spacing } from "../styles/spacing";
import CustomImage from './CustomImage';
import { getFirstThreeWords } from "../utils/stringUtils";
import { Ionicons } from '@expo/vector-icons';

export default function ProductCard({product, onPress}) {

    return(
        <Pressable style={[commonStyles.card, { height: 190 }]} onPress={onPress}>
            <View style={styles.imageContainer} >
                <CustomImage
                    source={{uri: product.image}}
                    size = {120}
                />
            </View>
            <View style={styles.textContainer}>
                <Text style={[styles.text, {fontWeight: 'bold', fontSize: 16}]}>{getFirstThreeWords(product.title)}</Text>
            <View style={{gap: 5}}>
                <Text style={styles.text}>Price: ${product.price}</Text>
                <View style={{flexDirection: 'row', alignItems: 'center', gap: 6}}>
                    <Ionicons name="star" size={12} color="white" />
                    <Text style={styles.text}>{product.rating.rate}</Text>
                </View>
            </View>
                
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
        justifyContent: 'space-between',
        width: '35%',
        gap: 40,
    },
    text: {
        flexWrap: 'wrap',
        color: '#fff'
    }
})