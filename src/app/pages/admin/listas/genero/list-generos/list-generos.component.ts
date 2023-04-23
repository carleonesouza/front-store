import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Genero } from 'app/models/genero';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { GeneroService } from '../genero.service';

@Component({
  selector: 'app-list-generos',
  templateUrl: './list-generos.component.html',
  styleUrls: ['./list-generos.component.scss']
})
export class ListGenerosComponent implements OnInit, OnDestroy {

  generos: Genero[];
  generos$: Observable<Genero[]>;
  generoCount: number = 0;
  totalElements: number = 0;
  pageSize = 0;
  pageSlice;
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _generoService: GeneroService
  ) {  }

  ngOnInit() {

    this.generos$ = this._generoService.generos$;
    this.generos$
    .pipe(
      takeUntil(this._unsubscribeAll))
    .subscribe((result) => {
      this.generos = result;
      this.generoCount = result.length;
      this.pageSize = result['size'];
      this.totalElements = result['totalElements'];
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

    this._generoService.getListaGeneros(0, endIndex)
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe((result) =>{
      if(result['content']){
        this.generos = result['content'];
        this.generoCount  = result['size'];
        if(endIndex >  result['content'].length){
          endIndex =  result['content'].length;
        }
      }
    });
  }

  createGenero(event) {
    if(event){
      this._router.navigate(['./add'], { relativeTo: this._activatedRoute });
    }
  }

}
