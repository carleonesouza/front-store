import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { switchMap, take, takeUntil } from 'rxjs/operators';
import { RoutesService } from '../routes.service';

@Component({
  selector: 'app-list-routes',
  templateUrl: './list-routes.component.html',
  styleUrls: ['./list-routes.component.scss']
})
export class ListRoutesComponent implements OnInit, OnDestroy {

  routes$: Observable<any[]>;
  routes: any[];
  routesCount: number = 0;
  totalElements: number = 0;
  pageSize = 0;
  pageSlice;
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _routesService: RoutesService
  ) {
    this.routes$ = this._routesService.routes$;
    this.routes$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((result) => {
        this.routes = result;
        this.routesCount = result.length;
        this.pageSize = result.length;
        this.totalElements = result.length;
      });
  }

  ngOnInit() { }


  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  onPageChange(event): void {
    const startIndex = event.pageIndex * event.pageSize;
    let endIndex = startIndex + event.pageSize;

    this._routesService.getAllRoutes()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((result) => {
        if (result) {
          this.routes = result;
          this.routesCount = result.length;
          if (endIndex > result.length) {
            endIndex = result.length;
          }
        }
      });
  }

  createItem(event) {
    if (event) {
      this._router.navigate(['./add'], { relativeTo: this._activatedRoute });
    }
  }

  searchItem(event) {
    if (event.target.value !== '' && event.target.valeu !== null && event.target.value !== undefined) {
      this.routes$.pipe(
        take(1),
        takeUntil(this._unsubscribeAll),
        switchMap(() =>
          this._routesService.searchRoute(event.target.value)
        )
      ).subscribe();
    }
  }

}
