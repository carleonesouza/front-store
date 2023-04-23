import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProgramaSaudeDetailsComponent } from './programa-saude-details/programa-saude-details.component';
import { ProgramaSaudeListComponent } from './programa-saude-list/programa-saude-list.component';
import { ProgramaSaudeComponent } from './programa-saude.component';
import { ProgramaSaudeResolver, ProgramasSaudeResolver } from './programa-saude.resolver';

const routes: Routes = [
  {
    path: '',
    component: ProgramaSaudeComponent,
    children: [
      {
        path: 'lista',
        component: ProgramaSaudeListComponent,
        resolve: {
          task: ProgramasSaudeResolver
        },
        children: [
          {
            path: ':id',
            component: ProgramaSaudeDetailsComponent,
            resolve: {
              item: ProgramaSaudeResolver
            }
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
export class ProgramaSaudeRoutingModule { }
