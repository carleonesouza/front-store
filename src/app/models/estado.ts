
export class Estado {

    recId: string;
    nome: string;
    sigla: string;
    lstEstLoginInclusao?: string;
    lstEstStatus?: number;
    lstEstLoginAlteracao?: string;
    lstEstLoginExclusao?: string;

    public constructor(init?: Partial<Estado>) {
        Object.assign(this, init);
    }
};
