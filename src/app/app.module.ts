import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ExtraOptions, PreloadAllModules, RouterModule } from '@angular/router';
import { MarkdownModule } from 'ngx-markdown';
import { FuseModule } from '@fuse';
import { FuseConfigModule } from '@fuse/services/config';
import { CoreModule } from 'app/core/core.module';
import { appConfig } from 'app/core/config/app.config';
import { LayoutModule } from 'app/layout/layout.module';
import { MaterialAppModule } from 'material-app.module';
import { SharedModule } from './shared/shared.module';
import { FuseNavigationModule } from '@fuse/components/navigation';
import { FuseFindByKeyPipeModule } from '@fuse/pipes/find-by-key';
import { NgxMaskModule, IConfig } from 'ngx-mask';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';

import { appRoutes } from 'app/app.routing';

import { BaseComponent } from './base.component';
import { AppComponent } from 'app/app.component';

import { initializeKeycloak } from './utils/app.init';
import { AuthModule } from './core/auth/auth.module';
import { TranslocoRootModule } from './utils/transloco-root.module';

const routerConfig: ExtraOptions = {
    preloadingStrategy       : PreloadAllModules,
    scrollPositionRestoration: 'enabled'
};

export const options: Partial<IConfig> | (() => Partial<IConfig>) = null;

@NgModule({
    declarations: [
        AppComponent,
        BaseComponent,
    ],
    imports     : [
        BrowserModule,
        BrowserAnimationsModule,
        RouterModule.forRoot(appRoutes, routerConfig),
        NgxMaskModule.forRoot(),

        // Fuse, FuseConfig
        FuseModule,
        FuseConfigModule.forRoot(appConfig),
        TranslocoRootModule,

        //Shared Module
        SharedModule,

        // Core module of your application
        CoreModule,

        // Layout module of your application
        LayoutModule,

        // 3rd party modules that require global configuration via forRoot
        MarkdownModule.forRoot({}),
        FuseNavigationModule,
        MaterialAppModule,
        FuseFindByKeyPipeModule,

        //KeyClockModule
        KeycloakAngularModule,

        //Interceptors
        AuthModule
    ],
    providers: [
        {
          provide: APP_INITIALIZER,
          useFactory: initializeKeycloak,
          multi: true,
          deps: [KeycloakService],
        },
      ],
    bootstrap   : [
        AppComponent
    ]
})
export class AppModule
{
}
