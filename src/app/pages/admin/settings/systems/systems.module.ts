import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SystemsRoutingModule } from './systems-routing.module';
import { SystemDetailsComponent } from './system-details/system-details.component';
import { ListSystemsComponent } from './list-systems/list-systems.component';
import { SettingsSystemsComponent } from './systems.component';
import { SystemsService } from './systems.service';
import { SharedModule } from 'app/shared/shared.module';
import { MaterialAppModule } from 'material-app.module';
import { SystemIdResolver, SystemsResolver } from './systems.resolver';


@NgModule({
  declarations: [
    SystemDetailsComponent,
    ListSystemsComponent,
    SettingsSystemsComponent
  ],
  imports: [
    CommonModule,
    SystemsRoutingModule,
    MaterialAppModule,
    SharedModule
  ],
  providers:[SystemsService, SystemIdResolver, SystemsResolver]
})
export class SystemsModule { }
