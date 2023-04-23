import { ClienteModel } from './cliente.model';

export class UsuarioClienteModel {

    ativo?: boolean;
    keycloakId?: string;
    recId?: 0;
    usuCliLoginAlteracao?: string;
    usuCliLoginCriacao?: string;
    cliente?: ClienteModel;


    public constructor(init?: Partial<UsuarioClienteModel>) {
        Object.assign(this, init);
    }
};
