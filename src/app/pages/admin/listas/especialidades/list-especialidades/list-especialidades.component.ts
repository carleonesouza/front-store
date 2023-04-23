import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { EspecialidadesService } from '../especialidades.service';

@Component({
  selector: 'app-list-especialidades',
  templateUrl: './list-especialidades.component.html',
  styleUrls: ['./list-especialidades.component.scss']
})
export class ListEspecialidadesComponent implements OnInit, OnDestroy {

  especialidades: any[];
  especialidades$: Observable<any[]>;
  especialidadesCount: number = 0;
  totalElements: number = 0;
  pageSize = 0;
  pageSlice;
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _especialidadesService: EspecialidadesService
  ) {  }

  ngOnInit() {

    this.especialidades$ = this._especialidadesService.especialidades$;

    this.especialidades$
    .pipe(
      takeUntil(this._unsubscribeAll))
    .subscribe((result) => {
      this.especialidades = result;
      this.especialidadesCount = result.length;
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

    this._especialidadesService.getListasEspecialidades(0, endIndex)
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe((result) =>{
      if( result['content']){
        this.especialidades = result['content'];
        this.especialidadesCount  = result['size'];
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


