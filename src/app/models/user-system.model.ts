import { ClienteModel } from './cliente.model';

export class UserSystemModel{

    roles?: any;
    fullName: string;
    email: string;
    keycloakId?: string;
    password?: string;
    recId?: number;
    cliente: ClienteModel;

    public constructor(init?: Partial<UserSystemModel>) {
        Object.assign(this, init);
    }
}
