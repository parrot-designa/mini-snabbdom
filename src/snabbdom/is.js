export const array = Array.isArray;

// 判断是否是原始值
export function primitive(s){
    return (
        typeof s === 'string' || 
        typeof s === 'number' || 
        s instanceof String ||
        s instanceof Number
    )
}