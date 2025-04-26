import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { commonStyles } from '../styles/common.js';
import useCategories from '../hooks/useCategories.js';
import categoriesImages from '../assets/images.js';
import CategoryCard from '../components/CategoryCard.js';

export default function CategoryScreen() {
    const { categories, isLoading, error } = useCategories();
    const navigation = useNavigation();
    const handlePress = (category) => {
        navigation.navigate('ProductListScreen', {category});
    };

    if(isLoading) {
        return(
            <LoadingIndicatorS
                size={80}
            />
        );
    }

    return(
        <View style={commonStyles.container}>
            <View style={commonStyles.list}>
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
