export class TipoDocumento{
    recId: string;
    tipoDocumento?: string;
    public constructor(init?: Partial<TipoDocumento>) {
        Object.assign(this, init);
    }
}
