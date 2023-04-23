import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { switchMap, take, takeUntil } from 'rxjs/operators';
import { EscolaridadeService } from '../escolaridade.service';
import { Escolaridade } from 'app/models/escolaridade';

@Component({
  selector: 'app-list-escolaridade',
  templateUrl: './list-escolaridades.component.html',
  styleUrls: ['./list-escolaridades.component.scss']
})
export class ListEscolaridadeComponent implements OnInit, OnDestroy{

  escolaridades: Escolaridade[];
  escolaridades$: Observable<Escolaridade[]>;
  escolaridadeCount: number = 0;
  totalElements: number = 0;
  pageSize = 0;
  pageSlice;
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _escolaridadeService: EscolaridadeService
  ) {}

  ngOnInit() {

    this.escolaridades$ = this._escolaridadeService.escolaridades$;

    this._escolaridadeService.getListaEscolaridades()
    .pipe(
      takeUntil(this._unsubscribeAll))
    .subscribe((result) => {
      this.escolaridades = result;
      this.escolaridadeCount = result['content'].length;
      this.pageSize = result['totalPages'];
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

    this._escolaridadeService.getListaEscolaridades(0, endIndex)
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe((result) =>{
      if( result['content']){
        this.escolaridades = result['content'];
        this.escolaridadeCount  = result['size'];
        if(endIndex >  result['content'].length){
          endIndex =  result['content'].length;
        }
      }
    });
  }
  searchItem(event) {
    if (event.target.value !== '' && event.target.valeu !== null && event.target.value !== undefined) {
      this.escolaridades$.pipe(
        take(1),
        takeUntil(this._unsubscribeAll),
        switchMap(() =>
          this._escolaridadeService.searchEscolaridade(event.target.value)
        )
      ).subscribe();
    }else{
      this._escolaridadeService.getListaEscolaridades().subscribe();
    }
  }

  createEscolaridade(event) {
    if(event){
      this._router.navigate(['./add'], { relativeTo: this._activatedRoute });
    }
  }
}
