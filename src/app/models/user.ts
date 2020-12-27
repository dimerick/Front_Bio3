export class User{

    constructor(
        public id: number,
        public name: string, 
        public last_name: string, 
        public email: string, 
        public password: string, 
        public avatar: string
    ){
        
    }
}