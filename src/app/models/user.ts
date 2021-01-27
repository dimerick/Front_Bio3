import { Project } from "./project";

export interface User{

        id: number,
        name: string, 
        last_name: string, 
        email: string, 
        avatar?: string, 
        date_joined?: string, 
        description?: string, 
        websites?: string, 
        degree?: string,
        fieldofstudy?: string, 
        university_id?: number, 
        university?: string, 
        projects?: Project[],
        ind_researcher?: boolean, 
        location?: {
            coordinates: number[], 
            type: string
        }
}