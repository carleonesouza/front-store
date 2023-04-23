import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountDetailsComponent } from './account-details/account-details.component';
import { SettingsAccountComponent } from './account.component';
import { AccountResolver, AccountsResolver } from './account.resolver';
import { ListAccountsComponent } from './list-accounts/list-accounts.component';

const routes: Routes = [
  {
    path: '',
    component: SettingsAccountComponent,

    children: [
      {
        path: 'lista',
        component: ListAccountsComponent,
        resolve: {
          task: AccountsResolver
        },
        children:[
          {
            path:':id',
            resolve:{
              task: AccountResolver},
            component: AccountDetailsComponent
          }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRoutingModule { }
