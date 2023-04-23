export class User{
    recId?: number;
    username: string;
    firstName: string;
    lastName: string;
    email?: string;

    public constructor(init?: Partial<User>) {
        Object.assign(this, init);
    }


    getFullName(){
        return `${this.firstName} ${this.lastName}`;
    }
}
