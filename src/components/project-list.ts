import {Component} from "./base-component.js";
import {Project} from "../models/project-model.js";
import { autobind } from "../decorators/autobind.js";
import { projectState } from "../state/project-state.js";
import { ProjectStatus } from "../models/project-model.js";
import { ProjectItem } from "./project-item.js";
import { DrageTarget } from "../models/drag-drop.js";

// Project List class declaration
export class ProjectList extends Component<HTMLDivElement, HTMLElement> implements DrageTarget  {
    
    assignedProjects: Project[];
    constructor(private type: 'active'|'finished'|'progress'){
        super('project-list','app',false, `${type}-projects`);
        this.assignedProjects = [];
        this.configure();
        this.renderContent();
    }

    @autobind
    dragOverHandler(event: DragEvent): void {

        if( event.dataTransfer && event.dataTransfer.types[0] === 'text/plain'){
        
            event.preventDefault();
            const listEl = this.element.querySelector('ul')!;
            listEl.classList.add('droppable');
        }
        
    }

    @autobind
    dropHandler(event: DragEvent): void {
        const prjId = event.dataTransfer!.getData('text/plain');
        projectState.moveProject(prjId, this.type === 'active'? ProjectStatus.Active : this.type === 'progress' ? ProjectStatus.Progress: ProjectStatus.Finished)
        console.log(event);
    }

    @autobind
    dragLeaveHandler(_: DragEvent): void {

        const listEl = this.element.querySelector('ul')!;
        listEl.classList.remove('droppable');
        
    }
    private renderProjects(){
        const listEl = document.getElementById(`${this.type}-projects-list`)! as HTMLUListElement;
        listEl.innerHTML = '';
        for(const prjItem of this.assignedProjects){
            new ProjectItem(this.element.querySelector('ul')!.id, prjItem);
        }

    }
    configure(): void {  
        this.element.addEventListener('dragover', this.dragOverHandler);
        this.element.addEventListener('dragleave', this.dragLeaveHandler);
        this.element.addEventListener('drop', this.dropHandler);

        projectState.addListener((projects: Project[]) => {
            const relaventProjects = projects.filter(prj => { 
            if(this.type === 'active'){
                return prj.status === ProjectStatus.Active
            }else if(this.type === 'progress'){
                return prj.status === ProjectStatus.Progress;
            }else
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
    
}