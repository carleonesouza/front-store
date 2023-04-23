export class Identificador{
    recId?: number;
    identificador: string;
    indIdeLoginInclusao?: string;
    indIdeStatus?: number;
    public constructor(init?: Partial<Identificador>) {
        Object.assign(this, init);
    }
}
