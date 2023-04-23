import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Raca } from 'app/models/raca';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { RacaService } from '../raca.service';

@Component({
  selector: 'app-list-racas',
  templateUrl: './list-racas.component.html',
  styleUrls: ['./list-racas.component.scss']
})
export class ListRacasComponent implements OnInit, OnDestroy {

  racas: Raca[];
  racas$: Observable<Raca[]>;
  racaCount: number = 0;
  totalElements: number = 0;
  pageSize = 0;
  pageSlice;
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _racaService: RacaService
  ) {  }

  ngOnInit() {

    this.racas$ = this._racaService.racas$;

    this.racas$
    .pipe(
      takeUntil(this._unsubscribeAll))
    .subscribe((result) => {
      this.racas = result;
      this.racaCount = result.length;
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

    this._racaService.getListaRacas(0, endIndex)
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe((result) =>{
      if(result['content']){
        this.racas = result['content'];
        this.racaCount  = result['size'];
        if(endIndex >  result['content'].length){
          endIndex =  result['content'].length;
        }
      }
    });
  }

  createRaca(event) {
    if(event){
      this._router.navigate(['./add'], { relativeTo: this._activatedRoute });
    }
  }
}
