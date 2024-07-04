import { useEffect, useState } from "react";

export function useLocalStorage<T>(key: string, fallbackValue: T) {
    const [value, setValue] = useState(fallbackValue);
    useEffect(() => {
        const stored = localStorage.getItem(key);
        //console.log("found", stored, stored !== null, stored !== null ? JSON.parse(stored) : fallbackValue)
        setValue(stored !== null ? JSON.parse(stored) : fallbackValue);//stored !== null ? JSON.parse(stored) : fallbackValue);
    }, [key, fallbackValue]);

    useEffect(() => {
        if (value !== fallbackValue) {
            //console.log("writing", JSON.stringify(value));
            localStorage.setItem(key, JSON.stringify(value));
        }
    }, [key, fallbackValue, value]);

    return [value, setValue] as const;
}