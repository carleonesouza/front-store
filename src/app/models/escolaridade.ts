
export class Escolaridade {

    recId: string;
    escolaridade: string;
    lstEscLoginAlteracao?: string;
    lstEscLoginExclusao?: string;
    lstEscLoginInclusao?: string;
    lstEscDescricao?: string;
    lstEscStatus?: number;

    public constructor(init?: Partial<Escolaridade>) {
        Object.assign(this, init);
    }
}
