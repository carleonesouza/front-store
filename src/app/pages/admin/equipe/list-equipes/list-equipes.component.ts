import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { EquipeService } from '../equipe.service';

@Component({
  selector: 'app-list-equipes',
  templateUrl: './list-equipes.component.html',
  styleUrls: ['./list-equipes.component.scss']
})
export class ListEquipesComponent implements OnInit, OnDestroy {

  equipes: any[];
  equipes$: Observable<any[]>;
  equipeCount: number = 0;
  totalElements: number = 0;
  pageSize = 0;
  pageSlice;
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _equipeService: EquipeService,
  ) { }

  ngOnInit() {

    this.equipes$ = this._equipeService.equipes$;

    this.equipes$
      .pipe(
        takeUntil(this._unsubscribeAll))
      .subscribe((result) => {
        this.equipes = result;
        this.equipeCount = result.length;
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

    this._equipeService.getEquipeList(0, endIndex)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((result) => {
        if (result['content']) {
          this.equipes = result['content'];
          this.equipeCount = result['size'];
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
