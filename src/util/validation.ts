export interface Validatable{
    value: string | number;
    required?: boolean;
    minLength?: number;
    maxlength?: number;
    min?: number;
    max?: number;
}


export function validate(valitableInput: Validatable){
    let isValid = true;
    if(valitableInput.required){
        isValid = isValid && valitableInput.value.toString().trim().length !== 0;
    }
    if(valitableInput.minLength != null &&
        typeof valitableInput.value === 'string'){
            isValid = isValid && valitableInput.value.length >= valitableInput.minLength;
        }
    if(valitableInput.maxlength != null &&
            typeof valitableInput.value === 'string'){
                isValid = isValid && valitableInput.value.length <= valitableInput.maxlength;
            }  
    if(valitableInput.min != null && typeof valitableInput.value === 'number'){
        isValid = isValid && valitableInput.value >= valitableInput.min;
    }
    if(valitableInput.max != null && typeof valitableInput.value === 'number'){
        isValid = isValid && valitableInput.value <= valitableInput.max;
    }    
    return isValid;        
}