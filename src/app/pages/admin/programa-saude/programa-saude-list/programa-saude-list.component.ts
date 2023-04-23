import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ProgramaSaudeService } from '../programa-saude.service';

@Component({
  selector: 'app-programa-saude-list',
  templateUrl: './programa-saude-list.component.html',
  styleUrls: ['./programa-saude-list.component.scss']
})
export class ProgramaSaudeListComponent implements OnInit, OnDestroy {

  programaSaudes: any[];
  programaSaudes$: Observable<any[]>;
  programaSaudeCount: number = 0;
  totalElements: number = 0;
  pageSize = 0;
  pageSlice;
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _programaSaudeService: ProgramaSaudeService,
  ) { }

  ngOnInit() {

    this.programaSaudes$ = this._programaSaudeService.programaSaudes$;

    this.programaSaudes$
      .pipe(
        takeUntil(this._unsubscribeAll))
      .subscribe((result) => {
        this.programaSaudes = result;
        this.programaSaudeCount = result.length;
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

    this._programaSaudeService.getProgramaSaudeList(0, endIndex)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((result) => {
        if (result['content']) {
          this.programaSaudes = result['content'];
          this.programaSaudeCount = result['size'];
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

