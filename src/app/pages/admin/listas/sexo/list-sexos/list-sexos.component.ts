import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Sexo } from 'app/models/sexo';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SexoService } from '../sexo.service';

@Component({
  selector: 'app-list-sexos',
  templateUrl: './list-sexos.component.html',
  styleUrls: ['./list-sexos.component.scss']
})
export class ListSexosComponent implements OnInit, OnDestroy{

  sexos: Sexo[];
  sexos$: Observable<Sexo[]>;
  sexoCount: number = 0;
  totalElements: number = 0;
  pageSize = 0;
  pageSlice;
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _sexoService: SexoService
  ) {  }

  ngOnInit() {

    this.sexos$ = this._sexoService.sexos$;

    this.sexos$
    .pipe(
      takeUntil(this._unsubscribeAll))
    .subscribe((result) => {
      this.sexos = result;
      this.sexoCount = result.length;
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

    this._sexoService.getListaSexos(0, endIndex)
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe((result) =>{
      if( result['content']){
        this.sexos = result['content'];
        this.sexoCount  = result['size'];
        if(endIndex >  result['content'].length){
          endIndex =  result['content'].length;
        }
      }
    });
  }

  createSexo(event) {
    if(event){
      this._router.navigate(['./add'], { relativeTo: this._activatedRoute });
    }
  }
}
