export class System {
    recId?: number;
    name?: string;
    createdAt?: string;
    createdBy?: string;
    homologUrl?: string;
    isActive?: boolean;
    prodUrl?: string;
    updatedAt?: string;
    updatedBy?: string;
    version?: string;

    public constructor(init?: Partial<System>) {
        Object.assign(this, init);
    }
};
