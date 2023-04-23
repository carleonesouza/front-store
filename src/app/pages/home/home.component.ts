import { formatDate } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewChild, ViewEncapsulation, OnInit, Input, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FuseVerticalNavigationAppearance, FuseVerticalNavigationMode, FuseNavigationItem, FuseVerticalNavigationPosition, FuseNavigationService, FuseVerticalNavigationComponent } from '@fuse/components/navigation';
import { AuthService } from 'app/core/auth/auth.service';
import { Subject } from 'rxjs';



@Component({
  selector: 'app-individuos',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  encapsulation  : ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements  OnInit
{


    selectedClient: any;
    currentDate: any;

        constructor(){
        this.currentDate = formatDate(new Date(), 'dd/MM/yyyy', 'en');
      }

     ngOnInit() {  }
  }
