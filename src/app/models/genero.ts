export class Genero{
    recId: string;
    genero: string;
    lstGenLoginAlteracao?: string;
    lstGenLoginExclusao?: string;
    lstGenLoginInclusao?: string;
    lstGenStatus?: number;
    lstGenDescricao?: string;

    public constructor(init?: Partial<Genero>) {
        Object.assign(this, init);
    }
}
