export const capitalizeEachWord = (string) => {
    return string.replace(/(?:^|\s)\w/g,  (char) => char.toUpperCase());
}

export const getFirstThreeWords = (string) => {
    const match = string.match(/^\s*(\w+(?:\s+\w+){0,2})/);
    return match ? match[1] : '';
}
    
