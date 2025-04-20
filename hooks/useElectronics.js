import React, { useState, useEffect } from "react";

export default function useElectronics() {
    const [electronics, setElectronics] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchElectronics = async() => {
            try{
                setIsLoading(true);
                const response = await fetch('https://fakestoreapi.com/products/category/electronics');
                if (!response.ok){
                    throw new Error (`Error fetching electronics data ${response.status}`)
                }
                const data = await response.json();
                setElectronics(data);
                setIsLoading(false);
            } catch(error){
                setError(error.message);
                setIsLoading(false);
            }
        };

        fetchElectronics();
    }, [])

    return { electronics, isLoading, error };
}