import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-individuos',
  templateUrl: './individuos.component.html',
  styleUrls: ['./individuos.component.scss']
})
export class IndividuosComponent implements OnInit {

  constructor(private _router: Router) {}

  ngOnInit(): void {
    this._router.navigate(['/admin/individuo/lista/']);
  }

}
