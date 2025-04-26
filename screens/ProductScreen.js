import { View, Text, StyleSheet, Image, ScrollView } from "react-native";
import { useRoute } from "@react-navigation/native";
import { commonStyles } from "../styles/common";
import { colors } from "../styles/colors";
import { spacing } from "../styles/spacing";
import CustomImage from "../components/CustomImage";

import LoadingIndicator from "../components/LoadingIndicator";

export default function ProductScreen() {
    const route = useRoute();
    const { product } = route.params || {};

    if (!product) {
       return <LoadingIndicator size={80}/>
    }

    return(
        <View style={[commonStyles.container, {paddingHorizontal:0}]}>
            <View style={styles.imageContainer}>
                <CustomImage
                    source={{uri: product.image}}
                    size={200}
                />
            </View>
            <View style={styles.textContainer}>
                <View>
                    <Text style={[styles.text, {fontWeight: 'bold', fontSize: 18}]}>{product.title}</Text>
                    <View style={{paddingVertical: 10}}>
                        <Text style={styles.text}>{product.rating.rate}</Text>
                    </View>
                </View>
                <View style={{gap:5, paddingVertical: 25}}>
                    <Text style={[styles.text, {fontWeight:'bold'}]}>Description</Text>
                    <Text style={styles.text}>{product.description}</Text>
                </View>
                
                <Text style={[styles.text, {fontSize: 18, paddingTop: 10}]}>Price: ${product.price}</Text>
            </View>
            
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
        paddingVertical: 30,
        height: '100%', //fix this
        backgroundColor: colors.secondary,
    },
    text: {
        color: 'white',
        textAlign: 'justify'
    }
})
