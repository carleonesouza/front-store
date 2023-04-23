import { Route } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PageComponent } from './page.component';
import { BaseComponent } from 'app/base.component';
import { Error404Component } from 'app/shared/error/error-404/error-404.component';
import { Error401Component } from 'app/shared/error/error-401/error-401.component';
import { Error500Component } from 'app/shared/error/error-500/error-500.component';
import { LayoutComponent } from 'app/layout/layout.component';
import { AuthGuard } from 'app/core/auth/guards/auth.guard';


export const pagesRoutes: Route[] = [
    {path: '', pathMatch : 'full', component: BaseComponent},
    {
        path: '',
        component: PageComponent,
        children: [
            {
                path: 'inicio',
                component: HomeComponent

            },
            {
                path: '',
                component: LayoutComponent,
                canActivateChild: [AuthGuard],
                children: [
                    {
                        path:'', loadChildren: () => import('app/pages/admin/admin.module').then(admin => admin.AdminModule),
                    }
                ]
            },
            {
                path: '', loadChildren: () => import('app/pages/paciente/paciente.module').then(p => p.PacienteModule),
            },
            // {
            //     path: '', loadChildren: () => import('app/pages/prescricao/prescricao.module').then(pres => pres.PrescricaoModule),
            // },
            {
                path: '', loadChildren: () => import('app/pages/profile/profile.module').then(p => p.ProfileModule),
            },
            {path: 'sign-out', loadChildren: () => import('app/pages/auth/sign-out/sign-out.module').then(m => m.AuthSignOutModule)},
            { path: '401-unauthorized', component: Error401Component},
            { path: 'error-500', component: Error500Component},
            // 404 & Catch all
            { path: '404-not-found', component: Error404Component},
            { path: '**', redirectTo: '404-not-found', pathMatch: 'full' },
        ]
    },
];
