// Drag and Drop Interfaces
interface Draggable {
    dragStartHandler(event: DragEvent): void;
    dragEndHandler(event: DragEvent): void;
}

interface DrageTarget{
    dragOverHandler(event: DragEvent): void;
    dropHandler(event: DragEvent): void;
    dragLeaveHandler(event: DragEvent): void;
}


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


// Component Base class

abstract class Component<T extends HTMLElement, U extends HTMLElement>{
    templateElement : HTMLTemplateElement;
    hostElement: T;
    element:U; 
    
    constructor(templateId: string, hostElementId: string, insertAtStart:boolean, newelementId?:string ){
        this.templateElement = document.getElementById(templateId)! as HTMLTemplateElement;
        this.hostElement = document.getElementById(hostElementId)! as T;
        const importedNode = document.importNode(this.templateElement.content,true);
        this.element = importedNode.firstElementChild as U;
        if(newelementId){
            this.element.id = newelementId;
        }
        
        this.attach(insertAtStart);

    }

    private attach(insertAtBegining: boolean){
        this.hostElement.insertAdjacentElement(insertAtBegining ? 'afterbegin' : 'beforeend', this.element);
    }

    abstract configure(): void;
    abstract renderContent(): void;

}

//  Project Type 

enum ProjectStatus {Active, Finished}

// Project  class declaration

class Project {
    constructor(public id: string, 
                public title: string, 
                public description: string, 
                public people:number, 
                public status: ProjectStatus ){

    }
}

// ProjectState class declaration

type Listener<T> = (items: T[]) => void;

class State<T> {
    protected listener: Listener<T>[] = [];

    addlistener(listenerFn: Listener<T>){
        this.listener.push(listenerFn);
    }
}


class ProjectState extends State<Project>{
    protected listeners: Listener<Project>[] = [];
    private projects: Project[] = [];
    private static instance: ProjectState;

    private constructor() {
        super();

    }

    static getInstance (){
        if(this.instance){
            return this.instance
        }
        this.instance = new ProjectState();
        return this.instance;
    }

    addListener(listenerFn: Listener<Project>){
        this.listeners.push(listenerFn);
    }

    addProject(title: string, description: string, numOfPeople: number){
        const newProject = new Project(Math.random().toString(),
                           title,
                           description,
                           numOfPeople,ProjectStatus.Active);

        this.projects.push(newProject);

        for (const listenerFn of this.listeners){
            listenerFn(this.projects.slice());

        }
    }
}

const projectState = ProjectState.getInstance();

// Project Item Class

class ProjectItem extends Component<HTMLUListElement, HTMLLIElement> implements Draggable{
    private project: Project;

    get persons(){
        if (this.project.people ===1){
            return '1 Person'
        }else{
            return `${this.project.people} persons`;
        }
    }

    constructor(hostId: string, project: Project){
        super('single-project', hostId, false, );
        this.project = project;
        this.configure();
        this.renderContent();
    }

    @autobind
    dragStartHandler(_: DragEvent): void {
        console.log('Start Drag');
        
    }

    @autobind
    dragEndHandler(_: DragEvent): void {
        console.log('End Drag');
    }

    configure() {

        this.element.addEventListener('dragstart', this.dragStartHandler);
        
    }

    renderContent() {
        this.element.querySelector('h2')!.textContent= this.project.title
        this.element.querySelector('h3')!.textContent= this.persons + ' assigned';
        this.element.querySelector('p')!.textContent= this.project.description;
        
    }

}

// Project List class declaration
class ProjectList extends Component<HTMLDivElement, HTMLElement>  {
    
    assignedProjects: Project[];
    constructor(private type: 'active'|'finished'){
        super('project-list','app',false, `${type}-projects`);
        this.assignedProjects = [];
        this.configure();
        this.renderContent();
    }

    
    private renderProjects(){
        const listEl = document.getElementById(`${this.type}-projects-list`)! as HTMLUListElement;
        listEl.innerHTML = '';
        for(const prjItem of this.assignedProjects){
            new ProjectItem(this.element.querySelector('ul')!.id, prjItem);
        }

    }
    configure(): void {  
        projectState.addListener((projects: Project[]) => {
            const relaventProjects = projects.filter(prj => { 
            if(this.type === 'active'){
                return prj.status === ProjectStatus.Active
            }
            return prj.status === ProjectStatus.Finished;
            });

            this.assignedProjects = relaventProjects;
            this.renderProjects();

        });     
    }
    renderContent(){
        const listId = `${this.type}-projects-list`;
        this.element.querySelector('ul')!.id = listId;
        this.element.querySelector('h2')!.textContent = this.type.toUpperCase()+' PROJECTS';

    }
    // private attach(){
    //     this.hostElement.insertAdjacentElement('beforeend', this.element);
    // }
}
// Class declaration
class ProjectInput extends Component<HTMLDivElement, HTMLFormElement>{
    // templateElement : HTMLTemplateElement;
    // hostElement : HTMLDivElement;
    // element : HTMLFormElement;
    titleInputElement: HTMLInputElement;
    descriptionInputElement: HTMLInputElement;
    peopleInputElement: HTMLInputElement;
    constructor(){
        super('project-input','app',true,'user-input')

        this.titleInputElement = this.element.querySelector('#title') as HTMLInputElement;
        this.descriptionInputElement = this.element.querySelector('#description') as HTMLInputElement;
        this.peopleInputElement = this.element.querySelector('#people') as HTMLInputElement;
        this.configure();

    }
    configure(){
       this.element.addEventListener('submit', this.submitHandler);
    }
    renderContent(): void {
        
    }
    private gatherUserInput(): [string , string, number] | void {
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
           projectState.addProject(title,desc,people);
        }
        console.log(this.titleInputElement.value);
        this.clearInputs();
    }

    private clearInputs(){
        this.titleInputElement.value = '';
        this.descriptionInputElement.value = '';
        this.peopleInputElement.value = '';
    }


    // attach(){
    //     this.hostElement.insertAdjacentElement('afterbegin', this.element);
    // }

}

const prjInput = new ProjectInput();
const activePrjList = new ProjectList('active');
const finishedPrjList = new ProjectList('finished');