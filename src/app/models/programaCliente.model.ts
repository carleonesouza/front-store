export class ProgramaCliente{
    recId: number;
    progCliDescricao: string;
    progCliLoginAlteracao?: string;
    progCliLoginExclusao?: string;
    progCliLoginInclusao?: string;
    progCliStatus?: boolean;

    public constructor(init?: Partial<ProgramaCliente>) {
        Object.assign(this, init);
    }
}
