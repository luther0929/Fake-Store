import React from 'react';
import { TouchableOpacity, StyleSheet, Text } from 'react-native';
import { colors } from '../styles/colors';
import { spacing } from '../styles/spacing';

export default function CustomButton({text}) {
    return(
        <TouchableOpacity
            style={styles.button}
            onPress={()=>{}}
        >
            <Text style={styles.text}>{text}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        width: 120,
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