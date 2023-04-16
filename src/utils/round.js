export default function roundNum(num, digits) {
    /**
     * num 数字
     * digits 小数点后的位数
     */
    let mult = 1;
    for(let i=0;i<digits;i++){
        mult*=10
    }
    return Math.round(num*mult)/mult;
}