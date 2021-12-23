// autobind decorator
export function autobind(
    _: any, 
    _2: string, 
    descriptor: PropertyDescriptor){

    const originalMetiod = descriptor.value;
    const adjDescriptor: PropertyDescriptor ={
        configurable: true,
        get(){
            const boundFn = originalMetiod.bind(this);
            return boundFn;
        }
    };
    return adjDescriptor;
}