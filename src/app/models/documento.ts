import { TipoDocumento } from './tipoDocumento';

export class Documento{
    recId?: number;
    tipoDocId: TipoDocumento;
    indDocNumero: string;
    indDocStatus?: number;
    public constructor(init?: Partial<Documento>) {
        Object.assign(this, init);
    }
}
