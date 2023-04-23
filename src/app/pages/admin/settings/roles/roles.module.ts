import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RolesRoutingModule } from './roles-routing.module';
import { RolesComponent } from './roles.component';
import { ListRolesComponent } from './list-roles/list-roles.component';
import { RoleDetailsComponent } from './role-details/role-details.component';
import { RolesService } from './roles.service';
import { RoleIdResolver, RolesResolver } from './roles.resolver';
import { SharedModule } from 'app/shared/shared.module';
import { MaterialAppModule } from 'material-app.module';
import { SystemsModule } from '../systems/systems.module';
import { SystemsResolver } from '../systems/systems.resolver';
import { SystemsService } from '../systems/systems.service';
import { RoutesService } from '../routes/routes.service';
import { RoutesResolver } from '../routes/routes.resolver';


@NgModule({
  declarations: [
    RolesComponent,
    ListRolesComponent,
    RoleDetailsComponent
  ],
  imports: [
    CommonModule,
    RolesRoutingModule,
    MaterialAppModule,
    SystemsModule,
    SharedModule,
  ],
  providers:[RolesService, RolesResolver, RoleIdResolver, RoutesResolver,
    RoutesService, SystemsService, SystemsResolver]
})
export class RolesModule { }
