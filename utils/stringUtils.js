export const capitalizeEachWord = (string) => {
    return string.replace(/\b\w/g,  (char) => char.toUpperCase());
}
    
