import React, { useState, useEffect }from "react"

export default function useProducts() {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async() => {
            try{
                setIsLoading(true);
                const response = await fetch('https://fakestoreapi.com/products');
                if (!response.ok){
                    throw new Error(`Error fetching product data: ${response.status}`);
                }
                const data = await response.json();
                setProducts(data);
                setIsLoading(false);
            } catch(error){
                setError(error.message);
                setIsLoading(false);
            } 
        };

        fetchProducts();
    }, []);

    return { products, isLoading, error };
}