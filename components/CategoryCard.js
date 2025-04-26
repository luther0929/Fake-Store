import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { capitalizeEachWord } from "../utils/stringUtils";
import { commonStyles } from "../styles/common";
import { colors } from "../styles/colors";
import { spacing } from "../styles/spacing";
import CustomImage from "./CustomImage";

export default function CategoryCard({ name, imageSource, onPress }) {

    return(
        <TouchableOpacity
            style={commonStyles.card}
            onPress={onPress}
        >
            <View style={styles.textContainer}>
                <Text style={styles.text}>{capitalizeEachWord(name)}</Text>
            </View>
            <View>
                <CustomImage
                    source={imageSource}
                    size = {180}
                />
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    textContainer: {
        justifyContent: "center",
        flex: 1,
        margin: spacing.medium
    },
    text: {
        color: colors.fontTitle,
        fontSize: 20,
    },
    image: {
        width: 180,
        height: 180
    }
});