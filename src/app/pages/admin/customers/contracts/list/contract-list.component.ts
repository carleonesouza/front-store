import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ClienteModel } from 'app/models/cliente.model';
import { ContratoModel } from 'app/models/contrato.model';
import { ProductsService } from 'app/pages/admin/products/products.service';
import { DialogAssociateComponent } from 'app/shared/dialog-association/dialog-associate.component';
import { Observable, Subject } from 'rxjs';
import { takeUntil, switchMap, take } from 'rxjs/operators';
import { CustomersService } from '../../customers.service';
import { ContractsService } from '../contracts.service';




@Component({
  selector: 'app-list-contract',
  templateUrl: './contract-list.component.html',
  styleUrls: ['./contract-list.component.scss']
})
export class ContractListComponent implements OnInit, OnDestroy {

  contracts$: Observable<any[]>;
  contracts: any[];
  produtos: any[];
  contractsCount: number = 0;
  totalElements: number = 0;
  pageSize = 0;
  pageSlice;
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    public dialog: MatDialog,
    private _productsService: ProductsService,
    private _clientService: ContractsService
  ) {
    this._productsService.getAllProducts().subscribe((produtos) => {
      this.produtos = produtos['content'];
    });
  }

  ngOnInit() {
    this.contracts$ = this._clientService.contracts$;
    this._clientService.getAllContracts()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((result) => {
        this.contracts = result['content'];
        this.contractsCount = result['content'].length;
        this.pageSize = result['totalPages'];
        this.totalElements = result['totalElements'];
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

    this._clientService.getAllContracts(0, endIndex)
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe((result) =>{
      if( result){
        this.contracts = result['content'];
        this.contractsCount = result['content'].length;
        if(endIndex >  result.length){
          endIndex =  result.length;
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
  }

  associaItem(event) {
    if (event) {
      const dialogRef = this.dialog.open(DialogAssociateComponent, {
        width: '550px',
        data: this.produtos
      });
      dialogRef.componentInstance.titleDialog = 'Associar Contrato ao Produto';
      dialogRef.componentInstance.labelInput = 'Produtos';
      dialogRef.componentInstance.propety = 'prodDescricao';
      dialogRef.afterClosed().subscribe((result) => {
        if (result != null || result !== undefined) {
          const clienteContratoProduto = new ClienteModel(event);
          //clienteContratoProduto.contratos = [new ContratoModel(result)];
          console.log(event);

          //this._clientService.vinculaContratoProduto(clienteContratoProduto).subscribe();
        }
      });
    }
  }

}
