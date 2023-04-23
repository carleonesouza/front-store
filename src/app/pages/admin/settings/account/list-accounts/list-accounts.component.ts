import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { UserSystemModel } from 'app/models/user-system.model';
import { ContractsService } from 'app/pages/admin/customers/contracts/contracts.service';
import { DialogAssociateComponent } from 'app/shared/dialog-association/dialog-associate.component';
import { Observable, Subject } from 'rxjs';
import { switchMap, takeUntil, take } from 'rxjs/operators';
import { AccountService } from '../account.service';

@Component({
  selector: 'app-list-accounts',
  templateUrl: './list-accounts.component.html',
  styleUrls: ['./list-accounts.component.scss']
})
export class ListAccountsComponent implements OnInit, OnDestroy {

  users: any[];
  users$: Observable<any[]>;
  clientes: any[];
  usersCount: number = 0;
  totalElements: number = 0;
  pageSize = 0;
  pageSlice;
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    public dialog: MatDialog,
    private _customersServices: ContractsService,
    private _accountService: AccountService
  ) {

    this.users$ = this._accountService.users$;
    this.users$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((result) => {
        this.users = result;
        this.usersCount = result.length;
        this.pageSize = result.length;
        this.totalElements = result.length;
      });
      this._customersServices.getAllContracts().subscribe((clientes) =>{
          this.clientes = clientes['content'];
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

    this._accountService.getAllUsers(event?.pageIndex + 1, endIndex)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((result) => {
        if (result) {
          this.users = result;
          this.usersCount = result.length;
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

  associaItem(event) {
    this.openDialog(event);
  }

  openDialog(event): void {
    if (this.users && event) {
      const dialogRef = this.dialog.open(DialogAssociateComponent, {
        width: '550px',
        data: this.clientes,
      });
      dialogRef.componentInstance.titleDialog = 'Associar Usuário ao Cliente';
      dialogRef.componentInstance.labelInput = 'Clientes';
      dialogRef.componentInstance.propety = 'nome';
      dialogRef.afterClosed().subscribe((result) => {
        if (result != null || result !== undefined) {
          const usuarioCliente = new UserSystemModel(event);
          usuarioCliente.cliente = result;
          this._accountService.associateUserCustomer(usuarioCliente).subscribe();
        }
      });
    }
  }

  syncListas(event) {
    console.log(event);
  }

  searchItem(event) {
    if (event.target.value !== '' && event.target.valeu !== null && event.target.value !== undefined) {
      this.users$.pipe(
        take(1),
        takeUntil(this._unsubscribeAll),
        switchMap(() =>
          this._accountService.searchUsers(event.target.value)
        )
      ).subscribe();
    }
  }
}
