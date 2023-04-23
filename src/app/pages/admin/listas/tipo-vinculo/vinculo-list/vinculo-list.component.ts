import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TipoVinculoService } from '../tipo-vinculo.service';

@Component({
  selector: 'app-vinculo-list',
  templateUrl: './vinculo-list.component.html',
  styleUrls: ['./vinculo-list.component.scss']
})
export class VinculoListComponent implements OnInit, OnDestroy {

  vinculos: any[];
  vinculos$: Observable<any[]>;
  vinculoCount: number = 0;
  totalElements: number = 0;
  pageSize = 0;
  pageSlice;
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _vinculosService: TipoVinculoService
  ) {  }

  ngOnInit() {

    this.vinculos$ = this._vinculosService.vinculos$;

    this.vinculos$
    .pipe(
      takeUntil(this._unsubscribeAll))
    .subscribe((result) => {
      this.vinculos = result;
      this.vinculoCount = result.length;
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

    this._vinculosService.getListasVinculo(0, endIndex)
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe((result) =>{
      if( result['content']){
        this.vinculos = result['content'];
        this.vinculoCount  = result['size'];
        if(endIndex >  result['content'].length){
          endIndex =  result['content'].length;
        }
      }
    });
  }

  createVinculo(event) {
    if(event){
      this._router.navigate(['./add'], { relativeTo: this._activatedRoute });
    }
  }

}
