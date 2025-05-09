import { View, Text} from 'react-native';
import CustomButton from './CustomButton';
import { StyleSheet } from 'react-native';
import { colors } from '../styles/colors';
import { spacing } from '../styles/spacing';
import { commonStyles } from '../styles/common';
import CustomImage from './CustomImage';
import { Ionicons } from '@expo/vector-icons';
import { getFirstThreeWords } from '../utils/stringUtils';

export default function CartProductCard({item, onAddToCart, onRemoveFromCart}) {
    return(
        <View style={styles.productContainer} key={item.id}>
            <View style={styles.imageContainer} >
                <CustomImage
                    source={{uri: item.image}}
                    size = {120}
                />
            </View>
            <View style={styles.textContainer}>
                <Text style={[styles.text, {fontWeight: 'bold', fontSize: 16}]}>{getFirstThreeWords(item.title)}</Text>
                <Text style={styles.text}>Price: ${item.price}</Text>
            </View>
            <View style={{marginVertical: 20, flexDirection: 'row', alignItems: 'center', gap: 30}}>
                <CustomButton 
                    text='-'
                    handlePress={() => onRemoveFromCart(item)}
                    color='white'
                    width={60}
                />
                <Text style={styles.text}>Qty {item.quantity}</Text>
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