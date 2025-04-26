import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { colors } from '../styles/colors';

export default function LoadingIndicator({size = 50, backgroundColor = ''}) {
    return(
        <View style={[styles.container, {backgroundColor:backgroundColor}]}>
            <ActivityIndicator
                size={size}
                color={colors.loading}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 999
    }
});