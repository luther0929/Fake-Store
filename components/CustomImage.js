import React, { useState } from 'react';
import { Image, ActivityIndicator, View } from 'react-native';
import LoadingIndicator from './LoadingIndicator';

export default function CustomImage({source, size = 200}) {
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);

    const handleLoad = () => {
        setIsLoading(false);
    };

    const handleError = () => {
        setIsError(true)
        setIsLoading(false);
    };

    

    return(
        <View>
            <Image 
            source = {source}
            style = {[{height: size, width: size}]}
            resizeMode = 'contain'
            onLoad = {handleLoad}
            onError = {handleError}
            />

            {isLoading && (
                <LoadingIndicator size={80}  />
            )}
        </View>    
    );

}
