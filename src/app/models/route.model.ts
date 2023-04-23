export class RoutesModel {

    recId: string;
    route?: string;
    roles: any;
    isActive: boolean;

    public constructor(init?: Partial<RoutesModel>) {
        Object.assign(this, init);
    }
};

