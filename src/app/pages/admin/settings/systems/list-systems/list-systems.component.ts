import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { System } from 'app/models/system.model';
import { Observable, Subject } from 'rxjs';
import { switchMap, take, takeUntil } from 'rxjs/operators';
import { SystemsService } from '../systems.service';


@Component({
  selector: 'app-list-systems',
  templateUrl: './list-systems.component.html',
  styleUrls: ['./list-systems.component.scss']
})
export class ListSystemsComponent implements OnInit, OnDestroy{

  systems$: Observable<any[]>;
  systems: any[];
  systemCount: number = 0;
  totalElements: number = 0;
  pageSize = 0;
  pageSlice;
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _systemService: SystemsService
  ) {
      this.systems$ = this._systemService.systems$;
      this.systems$.pipe(takeUntil(this._unsubscribeAll))
      .subscribe((result) =>{
        this.systems=result;
        this.systemCount = result.length;
        this.pageSize = 10;
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

    this._systemService.getAllSystems()
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe((result) =>{
      if( result){
        this.systems = result;
        this.systemCount  = result.length;
        if(endIndex >  result.length){
          endIndex =  result.length;
        }
      }
    });
  }

  createItem(event) {
    if(event){
      this._router.navigate(['./add'], { relativeTo: this._activatedRoute });
    }
  }

  searchItem(event) {
    if (event.target.value !== '' && event.target.valeu !== null && event.target.value !== undefined) {
      this.systems$.pipe(
        take(1),
        takeUntil(this._unsubscribeAll),
        switchMap(() =>
          this._systemService.searchSystems(event.target.value)
        )
      ).subscribe();
    }
  }
}
