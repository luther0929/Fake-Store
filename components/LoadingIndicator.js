import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { colors } from '../styles/colors';

export default function LoadingIndicator({size}) {
    return(
        <View style={styles.container}>
            <ActivityIndicator
                size={size}
                color={colors.accent}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.primary,
    }
});