import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ExameService } from '../exame.service';

@Component({
  selector: 'app-list-exames',
  templateUrl: './list-exames.component.html',
  styleUrls: ['./list-exames.component.scss']
})
export class ListExamesComponent implements OnInit, OnDestroy {

  exames: any[];
  exames$: Observable<any[]>;
  examesCount: number = 0;
  totalElements: number = 0;
  pageSize = 0;
  pageSlice;
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _exameService: ExameService
  ) {  }

  ngOnInit() {

    this.exames$ = this._exameService.exames$;

    this.exames$
    .pipe(
      takeUntil(this._unsubscribeAll))
    .subscribe((result) => {
      this.exames = result;
      this.examesCount = result.length;
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

    this._exameService.getListasExames(0, endIndex)
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe((result) =>{
      if( result['content']){
        this.exames = result['content'];
        this.examesCount  = result['size'];
        if(endIndex >  result['content'].length){
          endIndex =  result['content'].length;
        }
      }
    });
  }

  createItem(event) {
    if(event){
      this._router.navigate(['./add'], { relativeTo: this._activatedRoute });
    }
  }

}


