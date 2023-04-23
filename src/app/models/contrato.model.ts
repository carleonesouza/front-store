export class ContratoModel {

    contStatus?: boolean;
    contLoginAlteracao?: string;
    contLoginExclusao?: string;
    contLoginInclusao?: string;
    inicioVigencia: string;
    terminoVigencia: string;
    numero?: string;
    observacao?: string;
    contDescricao?: string;
    recId?: 0;


    public constructor(init?: Partial<ContratoModel>) {
        Object.assign(this, init);
    }
};
