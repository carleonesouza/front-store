import { ContratoModel } from './contrato.model';

export class ClienteModel {

    ativo?: boolean;
    cliLoginAlteracao?: string;
    cliLoginExclusao?: string;
    cliLoginInclusao?: string;
    cnpj?: string;
    email?: string;
    nome?: string;
    recId?: 0;
    contratos?: ContratoModel[];


    public constructor(init?: Partial<ClienteModel>) {
        Object.assign(this, init);
    }
};
