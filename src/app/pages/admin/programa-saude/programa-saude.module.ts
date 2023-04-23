import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'app/shared/shared.module';
import { MaterialAppModule } from 'material-app.module';

import { ProgramaSaudeRoutingModule } from './programa-saude-routing.module';
import { ProgramaSaudeListComponent } from './programa-saude-list/programa-saude-list.component';
import { ProgramaSaudeDetailsComponent } from './programa-saude-details/programa-saude-details.component';
import { ProgramaSaudeComponent } from './programa-saude.component';
import { ProgramaSaudeService } from './programa-saude.service';
import { ProgramaSaudeResolver, ProgramasSaudeResolver } from './programa-saude.resolver';



@NgModule({
  declarations: [
    ProgramaSaudeListComponent,
    ProgramaSaudeDetailsComponent,
    ProgramaSaudeComponent
  ],
  imports: [
    CommonModule,
    ProgramaSaudeRoutingModule,
    MaterialAppModule,
    SharedModule
  ],
  providers: [
    ProgramaSaudeService, ProgramasSaudeResolver, ProgramaSaudeResolver
  ]
})
export class ProgramaSaudeModule { }
