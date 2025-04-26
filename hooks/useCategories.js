import { useState, useEffect } from "react";

export default function useCategories() {
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCategories = async() => {
            try{
                setIsLoading(true);
                const response = await fetch('https://fakestoreapi.com/products/categories');
                if (!response.ok){
                    throw new Error(`Error fetching categories: ${response.status}`)
                }
                const data = await response.json();
                setCategories(data);
                setIsLoading(false);
            } catch(error){
                setError(error.message);
                setIsLoading(false);
            }
        };

        fetchCategories();
    }, [])

    return { categories, isLoading, error };
}