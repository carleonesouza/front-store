import { Route } from '@angular/router';
import { SettingsComponent } from '../settings/settings.component';

export const settingsRoutes: Route[] = [
    {
        path     : '',
        component: SettingsComponent,
        children:[
            {
                path:'conta', loadChildren: () => import('app/pages/admin/settings/account/account.module').then(account => account.AccountModule),
            },
            {
                path:'rota', loadChildren: () => import('app/pages/admin/settings/routes/routes.module').then(routes => routes.RoutesModule),
            },
            {
                path:'servico', loadChildren: () => import('app/pages/admin/settings/systems/systems.module').then(systems => systems.SystemsModule),
            },
            {
                path:'perfil', loadChildren: () => import('app/pages/admin/settings/roles/roles.module').then(roles => roles.RolesModule),
            },
            // {
            //     path:'', loadChildren: () => import('app/pages/admin/settings/services/services.module').then(services => services.ServicesModule),
            // }
        ]
    }
];
