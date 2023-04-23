import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { switchMap, take, takeUntil } from 'rxjs/operators';
import { Individuo } from 'app/models/individuo';
import { Identificador } from 'app/models/identificador';
import { IndividuosService } from '../individuos.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogAssociateComponent } from 'app/shared/dialog-association/dialog-associate.component';
import { AddIdentificadorComponent } from 'app/shared/add-identificador/add-identificador.component';
import { ContractsService } from '../../customers/contracts/contracts.service';

@Component({
  selector: 'app-list-individuos',
  templateUrl: './list-individuos.component.html',
  styleUrls: ['./list-individuos.component.scss']
})
export class ListIndividuosComponent implements OnInit, OnDestroy {

  individuos: Individuo[];
  clientes: any[];
  individuos$: Observable<any[]>;
  individuoCount: number = 0;
  totalElements: number = 0;
  pageSize = 0;
  pageSlice;
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    public dialog: MatDialog,
    private _clientesService: ContractsService,
    private _individuoService: IndividuosService
  ) {
    this._clientesService.getAllContracts().subscribe((clientes) => {
      this.clientes = clientes['content'];
    });
  }

  ngOnInit() {
    this.individuos$ = this._individuoService.individuos$;
    this.individuos$
      .pipe(
        takeUntil(this._unsubscribeAll))
      .subscribe((result) => {
        this.individuos = result;
        this.individuoCount = result.length;
        this.pageSize = result['size'];
        this.totalElements = result['totalElements'];
      });
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  /**
   *
   * @param event
   */
  onPageChange(event): void {
    const startIndex = event.pageIndex * event.pageSize;
    let endIndex = startIndex + event.pageSize;

    this._individuoService.getIndividuos(0, endIndex)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((result) => {
        if (result['content']) {
          let individuos = result['content'];
          individuos = individuos.sort((a, b) => a.indNome.localeCompare(b.indNome));
          this.individuos = individuos;
          this.individuoCount = result['size'];
          if (endIndex > result['content'].length) {
            endIndex = result['content'].length;
          }
        }
      });
  }

  /**
   *
   * @param event
   */
  createItem(event) {
    if (event) {
      this._router.navigate(['./add'], { relativeTo: this._activatedRoute });
    }
  }

  /**
   *
   * @param event
   */
  associaItem(event) {
    if (this.individuos && event) {
      const dialogRef = this.dialog.open(DialogAssociateComponent, {
        width: '550px',
        data: this.clientes,
      });
      dialogRef.componentInstance.titleDialog = 'Associar Cliente';
      dialogRef.componentInstance.labelInput = 'Clientes';
      dialogRef.componentInstance.propety = 'nome';
      dialogRef.afterClosed().subscribe((result) => {
        if (result != null || result !== undefined) {
          const individuoCliente = new Individuo(event);
          individuoCliente.cliente = result;
          this._individuoService.associateIndividuoCliente(individuoCliente).subscribe();
        }
      });
    }
  }

  /**
   *
   * @param event
   */
  addIdentificador(event) {
    if (this.individuos && event) {
      const dialogRef = this.dialog.open(AddIdentificadorComponent, {
        width: '550px',
        data: event
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result != null || result !== undefined) {
          const individuoIdentificador = new Individuo(event);
          individuoIdentificador.identificadores = [{ identificador: result }];
          this._individuoService.addIndividuoIdentificadores(individuoIdentificador).subscribe();
        }
      });
    }
  }

  syncListas(event) {
    console.log(event);
  }

  /**
   *
   * @param event
   */
  searchItem(event) {
    if (event.target.value !== '' && event.target.valeu !== null && event.target.value !== undefined) {
      this.individuos$.pipe(
        take(1),
        takeUntil(this._unsubscribeAll),
        switchMap(() =>
          this._individuoService.getIndividuoById(event.target.value)
        )
      ).subscribe();
    }
  }
}
