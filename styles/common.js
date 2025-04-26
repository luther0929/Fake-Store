import { StyleSheet } from "react-native";
import { colors } from "./colors";
import { spacing } from "./spacing";

export const commonStyles = {
    container: {
        flex: 1,
        width: '100%',
        height: '100%',
        paddingHorizontal: spacing.medium,
        backgroundColor: colors.primary,
    },
    list: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    card: {
        flexDirection: 'row',
        height: 130,
        width: '100%',
        margin: spacing.small,
        alignItems: 'center',
        justifyContent: 'space-around',
        borderRadius: spacing.medium,
        backgroundColor: colors.secondary,
        borderWidth: spacing.border,
        borderColor: colors.accent
    }
}