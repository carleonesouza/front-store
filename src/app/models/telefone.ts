export class Telefone{
    recId?: number;
    telefone: string;
    indTelStatus?: number;
    public constructor(init?: Partial<Telefone>) {
        Object.assign(this, init);
    }
}
