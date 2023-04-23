import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'app/core/auth/guards/auth.guard';
import { AdminComponent } from './admin.component';

const routes: Routes = [
  {
    path: 'admin',
    component: AdminComponent,
    canActivateChild: [AuthGuard],
    children: [
      {
        path: 'individuo', loadChildren: () => import('app/pages/admin/individuos/individuos.module').then(i => i.IndividuosModule),
      },
      {
        path: '', loadChildren: () => import('app/pages/admin/listas/listas.module').then(l => l.ListasModule),
      },
      {
        path: 'configuracoes', loadChildren: () => import('app/pages/admin/settings/settings.module').then(m => m.SettingsModule),
      },
      {
        path: 'clientes', loadChildren: () => import('app/pages/admin/customers/customers.module').then(c => c.CustomersModule),
      },
      {
        path: 'produtos', loadChildren: () => import('app/pages/admin/products/products.module').then(p => p.ProductsModule),
      },
      {
        path: 'equipe', loadChildren: () => import('app/pages/admin/equipe/equipe.module').then(e => e.EquipeModule),
      },
      {
        path: 'programa-cliente', loadChildren: () => import('app/pages/admin/programa-cliente/programa-cliente.module').then(pc => pc.ProgramaClienteModule),
      },
      {
        path: 'programa-saude', loadChildren: () => import('app/pages/admin/programa-saude/programa-saude.module').then(ps => ps.ProgramaSaudeModule),
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
