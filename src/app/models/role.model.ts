export class RoleModel {

    recId: string;
    rota?: any;
    roles: any;
    isActive: boolean;
    roleName: string;

    public constructor(init?: Partial<RoleModel>) {
        Object.assign(this, init);
    }
};
