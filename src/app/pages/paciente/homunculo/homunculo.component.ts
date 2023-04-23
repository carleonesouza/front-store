import { formatDate } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewEncapsulation, OnInit } from '@angular/core';



@Component({
  selector: 'app-homunculo',
  templateUrl: './homunculo.component.html',
  styleUrls: ['./homunculo.component.scss'],
  encapsulation  : ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomunculoComponent implements  OnInit
{


    selectedClient: any;
    currentDate: any;

        constructor(){
        this.currentDate = formatDate(new Date(), 'dd/MM/yyyy', 'en');
      }

     ngOnInit() {  }
  }
