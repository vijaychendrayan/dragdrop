import {Project, ProjectStatus} from "../models/project-model.js";

type Listener<T> = (items: T[]) => void;

class State<T> {
    protected listener: Listener<T>[] = [];

    addlistener(listenerFn: Listener<T>){
        this.listener.push(listenerFn);
    }
}


export class ProjectState extends State<Project>{
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

    moveProject(projectId: string, newStatus: ProjectStatus){

        const project = this.projects.find(prj => prj.id === projectId)
        if(project && project.status !== newStatus){
            project.status = newStatus;
            this.updateListeners();
        }

    }

    private updateListeners(){
        for (const listenerFn of this.listeners){
            listenerFn(this.projects.slice());
        }
    }
}

export const projectState = ProjectState.getInstance();