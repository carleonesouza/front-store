export class ProgramaSaude{
    recId: number;
    progSauDescricao: string;
    progSauLoginAlteracao?: string;
    progSauLoginExclusao?: string;
    progSauLoginInclusao?: string;
    progSauStatus?: boolean;

    public constructor(init?: Partial<ProgramaSaude>) {
        Object.assign(this, init);
    }
}
