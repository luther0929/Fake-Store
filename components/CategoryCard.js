import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";

export default function CategoryCard({ name, imageSource, onPress }) {

    return(
        <TouchableOpacity
            style={styles.container}
            onPress={onPress}
        >
            <View style={styles.textContainer}>
                <Text style={styles.text}>{name}</Text>
            </View>
            <View>
                <Image
                    source={imageSource}
                    style={styles.image}
                    resizeMode="contain"
                />
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        height: 130,
        width: '100%',
        margin: 10,
        alignItems: 'center',
        justifyContent: 'space-around',
        borderRadius: 16,
        backgroundColor: '#e6d2b9',
    },
    textContainer: {
        marginLeft: 16,
        justifyContent: "center",
        flex: 1
    },
    text: {
        color: '#323A45',
        fontSize: 20,
    },
    image: {
        width: 185,
        height: 185
    }
});