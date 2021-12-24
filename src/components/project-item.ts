import {Component} from "./base-component";
import {Draggable} from "../models/drag-drop";
import {Project} from "../models/project-model";
import { autobind } from "../decorators/autobind";

// Project Item Class

export class ProjectItem extends Component<HTMLUListElement, HTMLLIElement> implements Draggable{
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
    dragStartHandler(event: DragEvent): void {
        event.dataTransfer!.setData('text/plain', this.project.id);
        event.dataTransfer!.effectAllowed = 'move';
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