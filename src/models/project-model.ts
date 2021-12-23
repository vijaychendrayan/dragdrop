//  Project Type 

export enum ProjectStatus {Active, Finished, Progress}

// Project  class declaration

export class Project {
    constructor(public id: string, 
                public title: string, 
                public description: string, 
                public people:number, 
                public status: ProjectStatus ){

    }
}
