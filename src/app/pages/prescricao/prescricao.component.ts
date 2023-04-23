import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { PrescricaoService } from './prescricao.service';

@Component({
  selector: 'app-prescricao',
  templateUrl: './prescricao.component.html',
  styleUrls: ['./prescricao.component.scss']
})
export class PrescricaoComponent implements OnInit {

  @ViewChild('mamed', { static: false }) mamed: ElementRef;
  @Input() searchInputControl: FormControl = new FormControl();
  idmemed = 'memed';
  panel: boolean = false;
  constructor(private service: PrescricaoService, private elRef: ElementRef) {  }

  ngOnInit() {
  }

  searchItems(event){
    console.log(event);
  }

  prescrever(){
    const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.WzQwMTcxLCIzMWJjZWEzY2M4ZTZkNzdiMGJhZTI3ZmY4NWM1MGU0OCIsIjIwMjItMDctMDQiLCJzaW5hcHNlLnByZXNjcmljYW8iLCJwYXJ0bmVyLjMuMzU0ODgiXQ.w-weTOynvyZuYsrnpFaS8O5_s5zRee9m9JLG6X7tBXE';
    this.service.load(token)
    .subscribe((e) =>{
      if(e){
        this.panel = true;
        console.log(this.panel);
      }
    });

  }

  createItem(add: boolean){
    console.log(add);
  }

}
