export const getNumber =(str)=>{
    if(str){
        const strArr=str?.split("");
        return strArr[strArr?.length-1]
    }

}