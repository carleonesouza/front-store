import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CondicaoClinicaService } from '../condicao-clinica.service';

@Component({
  selector: 'app-condicao-clinica-list',
  templateUrl: './condicao-clinica-list.component.html',
  styleUrls: ['./condicao-clinica-list.component.scss']
})
export class CondicaoClinicaListComponent implements OnInit, OnDestroy {

  condicaoClinicas: any[];
  condicaoClinicas$: Observable<any[]>;
  condicaoClinicaCount: number = 0;
  totalElements: number = 0;
  pageSize = 0;
  pageSlice;
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _condicaoClinicaService: CondicaoClinicaService,
  ) { }

  ngOnInit() {

    this.condicaoClinicas$ = this._condicaoClinicaService.condicaoClinicas$;

    this.condicaoClinicas$
      .pipe(
        takeUntil(this._unsubscribeAll))
      .subscribe((result) => {
        this.condicaoClinicas = result;
        this.condicaoClinicaCount = result.length;
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

    this._condicaoClinicaService.getCondicaoClinicas(0, endIndex)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((result) => {
        if (result['content']) {
          this.condicaoClinicas = result['content'];
          this.condicaoClinicaCount = result['size'];
          if (endIndex > result['content'].length) {
            endIndex = result['content'].length;
          }
        }
      });
  }

  createItem(event) {
    if (event) {
      this._router.navigate(['./add'], { relativeTo: this._activatedRoute });
    }
  }

}
