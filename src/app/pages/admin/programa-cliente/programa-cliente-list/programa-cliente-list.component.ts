import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ProgramaClienteService } from '../programa-cliente.service';

@Component({
  selector: 'app-programa-cliente-list',
  templateUrl: './programa-cliente-list.component.html',
  styleUrls: ['./programa-cliente-list.component.scss']
})
export class ProgramaClienteListComponent implements OnInit, OnDestroy {

  programaClientes: any[];
  programaClientes$: Observable<any[]>;
  programaClienteCount: number = 0;
  totalElements: number = 0;
  pageSize = 0;
  pageSlice;
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _programaClienteService: ProgramaClienteService,
  ) { }

  ngOnInit() {

    this.programaClientes$ = this._programaClienteService.programaClientes$;

    this.programaClientes$
      .pipe(
        takeUntil(this._unsubscribeAll))
      .subscribe((result) => {
        this.programaClientes = result;
        this.programaClienteCount = result.length;
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

    this._programaClienteService.getProgramaClienteList(0, endIndex)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((result) => {
        if (result['content']) {
          this.programaClientes = result['content'];
          this.programaClienteCount = result['size'];
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

