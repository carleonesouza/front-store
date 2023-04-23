import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TipoExameService } from '../tipo-exame.service';

@Component({
  selector: 'app-tipo-exame-list',
  templateUrl: './tipo-exame-list.component.html',
  styleUrls: ['./tipo-exame-list.component.scss']
})
export class TipoExameListComponent implements OnInit, OnDestroy {

  tipoExames: any[];
  tipoExames$: Observable<any[]>;
  tipoExameCount: number = 0;
  totalElements: number = 0;
  pageSize = 0;
  pageSlice;
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _tipoExameService: TipoExameService
  ) {  }

  ngOnInit() {

    this.tipoExames$ = this._tipoExameService.tipoExames$;

    this.tipoExames$
    .pipe(
      takeUntil(this._unsubscribeAll))
    .subscribe((result) => {
      this.tipoExames = result;
      this.tipoExameCount = result.length;
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

    this._tipoExameService.getTipoExameList(0, endIndex)
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe((result) =>{
      if( result['content']){
        this.tipoExames = result['content'];
        this.tipoExameCount  = result['size'];
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
