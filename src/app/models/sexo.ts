export class Sexo{
    recId: string;
    sexo: string;
    lstSexoLoginAlteSexo?: string;
    lstSexoLoginExclusao?: string;
    lstSexoLoginInclusao?: string;
    lstSexoStatus?: number;
    lstSexoDescricao?: string;

    public constructor(init?: Partial<Sexo>) {
        Object.assign(this, init);
    }
}
