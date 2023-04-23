import { ContratoModel } from './contrato.model';

export class Produto {

    recId: string;
    ativo: boolean;
    prodDataInclusao: string;
    prodLoginInclusao?: string;
    prodLoginAlteracao?: string;
    prodLoginExclusao?: string;
    contrato: ContratoModel;

    public constructor(init?: Partial<Produto>) {
        Object.assign(this, init);
    }
};
