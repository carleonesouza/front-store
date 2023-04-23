import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Cidade } from 'app/models/cidade';
import { Observable, Subject } from 'rxjs';
import { switchMap, take, takeUntil } from 'rxjs/operators';
import { CidadeService } from '../cidade.service';

@Component({
  selector: 'app-list-cidades',
  templateUrl: './list-cidades.component.html',
  styleUrls: ['./list-cidades.component.scss']
})
export class ListCidadesComponent implements OnInit, OnDestroy {

  cidades$: Observable<any[]>;
  cidades: any[];
  cidadeCount: number = 0;
  totalElements: number = 0;
  pageSize = 0;
  pageSlice;
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _cidadeService: CidadeService
  ) {  }

  ngOnInit() {

    this.cidades$ = this._cidadeService.cidades$;

    this._cidadeService.getListaCidades()
    .pipe(
      takeUntil(this._unsubscribeAll))
    .subscribe((result) => {
      this.cidades = result['content'];
      this.cidadeCount = result['content'].length;
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

    this._cidadeService.getListaCidades(0, endIndex)
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe((result) =>{
      if( result['content']){
        this.cidades = result['content'];
        this.cidadeCount  = result['size'];
        if(endIndex >  result['content'].length){
          endIndex =  result['content'].length;
        }
      }
    });
  }

  searchItem(event) {
    if (event.target.value !== '' && event.target.valeu !== null && event.target.value !== undefined) {
      this.cidades$.pipe(
        take(1),
        takeUntil(this._unsubscribeAll),
        switchMap(() =>
          this._cidadeService.searchCidades(event.target.value)
        )
      ).subscribe();
    }else{
      this._cidadeService.getListaCidades().subscribe();
    }
  }

  createCidade(event) {
    if(event){
      this._router.navigate(['./add'], { relativeTo: this._activatedRoute });
    }
  }

}
