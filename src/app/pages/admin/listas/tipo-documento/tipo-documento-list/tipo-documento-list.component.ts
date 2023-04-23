import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TipoDocumentoService } from '../tipo-documento.service';

@Component({
  selector: 'app-tipo-documento-list',
  templateUrl: './tipo-documento-list.component.html',
  styleUrls: ['./tipo-documento-list.component.scss']
})
export class TipoDocumentoListComponent implements OnInit, OnDestroy {

  tipoDocumentos: any[];
  tipoDocumentos$: Observable<any[]>;
  tipoDocumentoCount: number = 0;
  totalElements: number = 0;
  pageSize = 0;
  pageSlice;
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _tipoDocumentoService: TipoDocumentoService
  ) { }

  ngOnInit() {

    this.tipoDocumentos$ = this._tipoDocumentoService.tipoDocumentos$;

    this.tipoDocumentos$
      .pipe(
        takeUntil(this._unsubscribeAll))
      .subscribe((result) => {
        this.tipoDocumentos = result;
        this.tipoDocumentoCount = result.length;
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

    this._tipoDocumentoService.getTipoDocumentos(0, endIndex)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((result) => {
        if (result['content']) {
          this.tipoDocumentos = result['content'];
          this.tipoDocumentoCount = result['size'];
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
