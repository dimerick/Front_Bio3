import { Project } from "./project";

export class User{

    constructor(
        public id: number,
        public name: string, 
        public last_name: string, 
        public email: string, 
        public avatar?: string, 
        public date_joined?: string, 
        public description?: string, 
        public websites?: string, 
        public degree?: string,
        public fieldofstudy?: string, 
        public university_id?: number, 
        public university?: string, 
        public projects?: Project[],

    ){
        
    }
}