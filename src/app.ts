
interface Validatable{
    value: string | number;
    required?: boolean;
    minLength?: number;
    maxlength?: number;
    min?: number;
    max?: number;
}

function validate(valitableInput: Validatable){
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
// autobind decorator
function autobind(
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

// ProjectState class declaration
class ProjectState{
    private projects: any[] = [];

    addProject(title: string, description: string, numOfPeople: number){
        const newProject = {
            id: Math.random().toString(),
            title: title,
            description: description,
            people: numOfPeople,
        };
        this.projects.push(newProject);
    }
}
// Project List class declaration
class ProjectList{
    templateElement : HTMLTemplateElement;
    hostElement : HTMLDivElement;
    element : HTMLElement;
    constructor(private type: 'active'|'finished'){
        this.templateElement = document.getElementById('project-list')! as HTMLTemplateElement;
        this.hostElement = document.getElementById('app')! as HTMLDivElement;
        const importedNode = document.importNode(this.templateElement.content,true);
        this.element = importedNode.firstElementChild as HTMLElement;
        this.element.id = `${this.type}-projects`;
        this.attach();
        this.renderContent();

    }

    private renderContent(){
        const listId = `${this.type}-projects-list`;
        this.element.querySelector('ul')!.id = listId;
        this.element.querySelector('h2')!.textContent = this.type.toUpperCase()+' PROJECTS';

    }
    private attach(){
        this.hostElement.insertAdjacentElement('beforeend', this.element);
    }
}
// Class declaration
class ProjectInput{
    templateElement : HTMLTemplateElement;
    hostElement : HTMLDivElement;
    element : HTMLFormElement;
    titleInputElement: HTMLInputElement;
    descriptionInputElement: HTMLInputElement;
    peopleInputElement: HTMLInputElement;
    constructor(){
        this.templateElement = document.getElementById('project-input')! as HTMLTemplateElement;
        this.hostElement = document.getElementById('app')! as HTMLDivElement;
        const importedNode = document.importNode(this.templateElement.content,true);
        this.element = importedNode.firstElementChild as HTMLFormElement;
        this.element.id = 'user-input';
        this.titleInputElement = this.element.querySelector('#title') as HTMLInputElement;
        this.descriptionInputElement = this.element.querySelector('#description') as HTMLInputElement;
        this.peopleInputElement = this.element.querySelector('#people') as HTMLInputElement;
        this.configure();
        this.attach();
    }
    private gatherUserInput(): [String, String, number] | void {
        const enteredTitle = this.titleInputElement.value;
        const enteredDescription = this.descriptionInputElement.value;
        const enteredPeople = this.peopleInputElement.value;
        const titelValidatable: Validatable ={
            value: enteredTitle,
            required:true
        };
        const descriptionValidatable: Validatable ={
            value: enteredDescription,
            required:true,
            minLength: 5
        };
        const peopleValidatable: Validatable ={
            value: +enteredPeople,
            required:true,
            min:1,
            max:5
        };
        if ( !validate(titelValidatable) ||
             !validate(descriptionValidatable) ||
             !validate(peopleValidatable)){
                alert('Invalid input, Please try again');
                return;
        }else{
            return [enteredTitle, enteredDescription, +enteredPeople];

        }
    }

    @autobind
    private submitHandler(event: Event){
        event.preventDefault();
        const userInput = this.gatherUserInput();
        if(Array.isArray(userInput)){
           const [title, desc, people] = userInput;
           console.log(title,desc,people);
        }
        console.log(this.titleInputElement.value);

        this.clearInputs();
    }

    private clearInputs(){
        this.titleInputElement.value = '';
        this.descriptionInputElement.value = '';
        this.peopleInputElement.value = '';
    }

    private configure(){
        this.element.addEventListener('submit', this.submitHandler);
    }
    private attach(){
        this.hostElement.insertAdjacentElement('afterbegin', this.element);
    }

}

const prjInput = new ProjectInput();
const activePrjList = new ProjectList('active');
const finishedPrjList = new ProjectList('finished');