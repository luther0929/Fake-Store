import CategoryCard from '../components/CategoryCard.js';
import useCategories from '../hooks/useCategories.js';
import { View, StyleSheet } from 'react-native';
import categoriesImages from '../assets/images.js';
import { useNavigation } from '@react-navigation/native';

export default function CategoryScreen() {
    const { categories, isLoading, error } = useCategories();
    const navigation = useNavigation();
    const handlePress = (category) => {
        navigation.navigate('ProductListScreen', {category});
    };

    return(
        <View style={styles.container}>
            <View style={styles.list}>
                {categories.map((category) => {
                  return <CategoryCard
                      name={category}
                      imageSource={categoriesImages[category]}
                      onPress={() => handlePress(category)}
                      key={category}
                  />
                })}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    paddingHorizontal: 16,
    backgroundColor: '#a0aaa7',
    alignItems: 'center',
  },
  list: {
    width: '100%',
    flex: 5,
    alignItems: 'center',
    justifyContent: 'center',
  }
});