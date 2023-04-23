import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RoutesRoutingModule } from './routes-routing.module';
import { ListRoutesComponent } from './list-routes/list-routes.component';
import { RoutesDetailsComponent } from './routes-details/routes-details.component';
import { SettingsRoutesComponent } from './routes.component';
import { SharedModule } from 'app/shared/shared.module';
import { MaterialAppModule } from 'material-app.module';
import { RoutesService } from './routes.service';
import { RoutesIdResolver, RoutesResolver } from './routes.resolver';
import { SystemsModule } from '../systems/systems.module';
import { SystemsResolver } from '../systems/systems.resolver';
import { SystemsService } from '../systems/systems.service';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FuseAlertModule } from '@fuse/components/alert';
import { RolesService } from '../roles/roles.service';
import { RolesResolver } from '../roles/roles.resolver';

@NgModule({
    declarations: [
        RoutesDetailsComponent,
        ListRoutesComponent,
        SettingsRoutesComponent,
    ],
    imports: [
        CommonModule,
        RoutesRoutingModule,
        MaterialAppModule,
        SharedModule,
        SystemsModule,
        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatRadioModule,
        MatSelectModule,
        MaterialAppModule,
        MatSidenavModule,
        MatSlideToggleModule,
        FuseAlertModule,
        SharedModule,
    ],
    providers: [
        SystemsService,
        SystemsResolver,
        RoutesService,
        RoutesIdResolver,
        RoutesResolver,
        RolesService,
        RolesResolver
    ],
})
export class RoutesModule {}
