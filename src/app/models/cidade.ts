import { Estado } from './estado';

export class Cidade {

    recId: string;
    lstCidDescricao: string;
    lstCidLoginInclusao?: string;
    lstCidLoginAlteracao?: string;
    lstCidLoginExclusao?: string;
    lstCidStatus?: number;
    estado: Estado;

    public constructor(init?: Partial<Cidade>) {
        Object.assign(this, init);
    }
};
