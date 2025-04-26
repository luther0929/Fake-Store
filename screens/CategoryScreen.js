import { View, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { commonStyles } from '../styles/common.js';
import useCategories from '../hooks/useCategories.js';
import categoriesImages from '../assets/images.js';
import CategoryCard from '../components/CategoryCard.js';
import LoadingIndicator from '../components/LoadingIndicator.js';
import { colors } from '../styles/colors.js';

export default function CategoryScreen() {
    const { categories, isLoading, error } = useCategories();
    const navigation = useNavigation();
    const handlePress = (category) => {
        navigation.navigate('ProductListScreen', {category});
    };

    if(isLoading) {
        return(
            <LoadingIndicator
                size={80}
                backgroundColor={colors.primary}
            />
        );
    }

    return(
        <View style={commonStyles.container}>
            <ScrollView style={{paddingVertical: '20%'}}>
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
            </ScrollView>
        </View>
        
    );
}
