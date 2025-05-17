import { View, Text} from 'react-native';
import CustomButton from './CustomButton';
import { StyleSheet } from 'react-native';
import { colors } from '../styles/colors';
import { spacing } from '../styles/spacing';
import { commonStyles } from '../styles/common';
import CustomImage from './CustomImage';
import { getFirstThreeWords } from '../utils/stringUtils';

export default function CartProductCard({item, onAddToCart, onRemoveFromCart}) {
    // Add defensive check for item
    if (!item) {
        return (
            <View style={styles.productContainer}>
                <Text style={[styles.text, {color: 'red'}]}>Invalid cart item</Text>
            </View>
        );
    }
    
    // Make sure item has all required properties
    const title = item.title ? getFirstThreeWords(item.title) : 'Product';
    const price = item.price || 0;
    const quantity = item.quantity || 0;
    const image = item.image || '';
    
    return(
        <View style={styles.productContainer} key={item.id}>
            <View style={styles.imageContainer} >
                {image ? (
                    <CustomImage
                        source={{uri: image}}
                        size={120}
                    />
                ) : (
                    <View style={{width: 120, height: 120, backgroundColor: '#f0f0f0', justifyContent: 'center', alignItems: 'center'}}>
                        <Text>No Image</Text>
                    </View>
                )}
            </View>
            <View style={styles.textContainer}>
                <Text style={[styles.text, {fontWeight: 'bold', fontSize: 16}]}>{title}</Text>
                <Text style={styles.text}>Price: ${price}</Text>
            </View>
            <View style={{marginVertical: 20, flexDirection: 'row', alignItems: 'center', gap: 30}}>
                <CustomButton 
                    text='-'
                    handlePress={() => onRemoveFromCart(item)}
                    color='white'
                    width={60}
                />
                <Text style={styles.text}>Qty {quantity}</Text>
                <CustomButton 
                    text='+'
                    handlePress={() => onAddToCart(item)}
                    color='white'
                    width={60}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    productContainer: {
        width: 280,
        height: 380,
        margin: spacing.medium,
        padding: spacing.medium,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.secondary,
        borderRadius: spacing.medium,
        borderWidth: spacing.border,
        borderColor: colors.border
    },
    imageContainer: {
        margin: spacing.small,
        padding: spacing.small,
        borderWidth: spacing.border,
        borderRadius: spacing.medium,
        backgroundColor: 'white',
        borderColor: colors.accent
    },
    textContainer: {
        gap: 20,
    },
    text: {
        margin: spacing.small,
        flexWrap: 'wrap',
        color: '#fff',
        textAlign: 'center',
        fontSize: spacing.medium,
    }
});