import React from 'react';
import { TouchableOpacity, StyleSheet, Text } from 'react-native';
import { colors } from '../styles/colors';
import { spacing } from '../styles/spacing';

export default function CustomButton({text, handlePress, color, width}) {
    return(
        <TouchableOpacity
            style={[styles.button, { backgroundColor: color ? color : colors.primary, width: width ? width : 120 }]}
            onPress={handlePress}
        >
            <Text style={styles.text}>{text}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.medium,
        backgroundColor: colors.primary,
        borderWidth: 2,
        borderColor: colors.accent,
        borderRadius: spacing.medium


    },
    text: {
        fontSize: 16,
        fontWeight: 'bold',
    }
})