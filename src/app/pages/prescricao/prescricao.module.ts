import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PrescricaoRoutingModule } from './prescricao-routing.module';
import { PrescricaoComponent } from './prescricao.component';
import { PrescricaoService } from './prescricao.service';
import { SharedModule } from 'app/shared/shared.module';
import { MaterialAppModule } from 'material-app.module';
import { FuseCardModule } from '@fuse/components/card';


@NgModule({
  declarations: [
    PrescricaoComponent
  ],
  imports: [
    CommonModule,
    PrescricaoRoutingModule,
    SharedModule,
    MaterialAppModule,
    FuseCardModule
  ],
  providers:[
    PrescricaoService
  ]
})
export class PrescricaoModule { }
