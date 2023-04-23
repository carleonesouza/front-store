export class Raca{
    recId: string;
    raca: string;
    lstRacaLoginAlteracao?: string;
    lstRacaLoginExclusao?: string;
    lstRacaLoginInclusao?: string;
    lstRacaStatus?: number;
    lstRacaDescricao?: string;

    public constructor(init?: Partial<Raca>) {
        Object.assign(this, init);
    }
}
