import { Cidade } from './cidade';
import { Estado } from './estado';

export class Endereco {
    recId?: number;
    logradouro: string;
    bairro: string;
    cidade: string;
    estado: string;
    cep: number;
    indEndStatus?: number;

    public constructor(init?: Partial<Endereco>) {
        Object.assign(this, init);
    }
}
