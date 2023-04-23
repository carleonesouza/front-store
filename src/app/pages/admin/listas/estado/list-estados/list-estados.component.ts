import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Estado } from 'app/models/estado';
import { Observable, Subject } from 'rxjs';
import { takeUntil  } from 'rxjs/operators';
import { EstadoService } from '../estado.service';

@Component({
  selector: 'app-list-estados',
  templateUrl: './list-estados.component.html',
  styleUrls: ['./list-estados.component.scss']
})
export class ListEstadosComponent implements OnInit, OnDestroy{

  estados: Estado[];
  estados$: Observable<Estado[]>;
  estadoCount: number = 0;
  totalElements: number = 0;
  pageSize = 0;
  pageSlice;
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _estadoService: EstadoService
  ) {  }

  ngOnInit() {
    this.estados$ = this._estadoService.estados$;

    this.estados$
    .pipe(
      takeUntil(this._unsubscribeAll))
    .subscribe((result) => {
      this.estados = result;
      this.estadoCount = result.length;
      this.pageSize = result['size'];
      this.totalElements = 1;
    });
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  onPageChange(event): void {
    const startIndex = event.pageIndex * event.pageSize;
    let endIndex = startIndex + event.pageSize;

    this._estadoService.getListaEstados(0, endIndex)
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe((result) =>{
      if( result['content']){
        this.estados = result['content'];
        this.estadoCount  = result['size'];
        if(endIndex >  result['content'].length){
          endIndex =  result['content'].length;
        }
      }
    });
  }

  createEstado(event) {
    if(event){
      this._router.navigate(['./add'], { relativeTo: this._activatedRoute });
    }
  }
}
