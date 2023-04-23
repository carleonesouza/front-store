import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'app/core/auth/auth.service';
import { ClienteModel } from 'app/models/cliente.model';
import { User } from 'app/models/user';
import { ConfirmationDialogComponent } from 'app/shared/confirmation-dialog/confirmation-dialog.component';
import { ListItemsComponent } from 'app/shared/list-items/list-items.component';
import { DialogMessage } from 'app/utils/dialog-message ';
import moment from 'moment';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ProductsService } from '../../products/products.service';
import { ContractsService } from '../contracts/contracts.service';
import { CustomersService } from '../customers.service';

@Component({
  selector: 'app-customer-details',
  templateUrl: './customer-details.component.html',
  styleUrls: ['./customer-details.component.scss']
})
export class CustomerDetailsComponent implements OnInit, OnDestroy{


  @Input() clienteForm: FormGroup;
  @Input() checked: boolean;
  editMode: boolean = false;
  title: string;
  cliente: any;
  user: any;
  creating: boolean = false;
  loading: boolean = false;
  contratos$: Observable<any>;
  cliente$: Observable<any>;
  produtos$: Observable<any>;
  saving: boolean;
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(private _changeDetectorRef: ChangeDetectorRef,
    private _listItemsComponent: ListItemsComponent,
    private _formBuilder: FormBuilder,
    public _snackBar: MatSnackBar,
    private _contractsService: ContractsService,
    private _clientesService: CustomersService,
    private _productsService: ProductsService,
    private _dialogMessage: DialogMessage,
    private _route: ActivatedRoute,
    private _router: Router,
    public _dialog: DialogMessage,
    public dialog: MatDialog,) {
    //this.cliente$ = this._clientesService.clientes$;
    this.produtos$ = this._productsService.products$;
  }

  ngOnInit(): void {
    // Open the drawer
    this._listItemsComponent.matDrawer.open();
    this._changeDetectorRef.markForCheck();

    if (this._route.snapshot.url[0].path === 'add') {
      this.creating = true;
      this.title = 'Novo Cliente';
      this.createClientForm();
    }

    if (this._route.snapshot.paramMap.get('id') !== 'add') {

      this.loading = true;
      this.cliente$ = this._clientesService.cliente$;

      this.cliente$
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((cliente: any) => {

          // Open the drawer in case it is closed
          this._listItemsComponent.matDrawer.open();
          this.createClientForm();
          this.clienteForm.reset();

          // Get the Lista
          this.cliente = cliente;
          if (this.cliente) {
            this.clienteForm.patchValue(this.cliente);
            this.loading = false;
          }

          // Toggle the edit mode off
          this.toggleEditMode(false);

          // Mark for check
          this._changeDetectorRef.markForCheck();
        });

    }
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  createClientForm() {
    return this.clienteForm = this._formBuilder.group({
      recId: new FormControl(''),
      nome: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      cnpj: new FormControl('', Validators.required),
      observacao: new FormControl(''),
      contrato: this._formBuilder.array([this.createContractForm()]),
    });
  }


  createContractForm() {
    return this._formBuilder.group({
      contDescricao: new FormControl('', Validators.required),
      ativo: new FormControl(''),
      numero: new FormControl('', Validators.required),
      inicioVigencia: new FormControl({ value: '', disabled: true }, [Validators.required]),
      terminoVigencia: new FormControl({ value: '', disabled: true }, [Validators.required]),
      observacao: new FormControl(''),
    });
  }

  createFormProduct() {
    return this._formBuilder.group({
      produto: new FormControl('')
    });
  }


  get clienteControls() {
    return this.clienteForm.controls;
  }

  contratoProduto(index = 0) {
    return (this.contatos().at(index).get('produto') as FormArray).controls;
  }

  contratoProdutoArray(index = 0): FormArray {
    return this.contatos().at(index).get('produto') as FormArray;
  }


  get contractControls() {
    return (this.clienteForm.get('contrato') as FormArray).controls;
  }

  contatos(): FormArray {
    return this.clienteForm.get('contrato') as FormArray;
  }

  compareFn(c1: any, c2: any): boolean {
    return c1 && c2 ? c1.recId === c2.recId : c1 === c2;
  }


  /**
   * Close the drawer
   */
  closeDrawer(): Promise<MatDrawerToggleResult> {
    return this._listItemsComponent.matDrawer.close();
  }

  addContactField(): void {

    const contractFormGroup = this.createContractForm();

    (this.clienteForm.get('contrato') as FormArray).push(contractFormGroup);
    // Mark for check
    this._changeDetectorRef.markForCheck();
  }


  removeContractField(index: number): void {

    // Get form array for address
    const contractFormArray = this.clienteForm.get('contrato') as FormArray;

    const cliente = contractFormArray.at(index);
    // Remove the Endereço field
    contractFormArray.removeAt(index);

    // Mark for check
    this._changeDetectorRef.markForCheck();
  }



  addProductField(index: number) {
    this.contratoProduto(index).push(this.createFormProduct());
    this._changeDetectorRef.markForCheck();
  }

  removeProductField(index: number, prodIndex: number) {
    this.contratoProdutoArray(index).removeAt(prodIndex);
  }


  trackByFn(index: number, item: any): any {
    return item.id || index;
  }

  /**
   * Toggle edit mode
   *
   * @param editMode
   */
  toggleEditMode(editMode: boolean | null = null): void {
    if (editMode === null) {
      this.editMode = !this.editMode;
    }
    else {
      this.editMode = editMode;
      this.title = 'Editar Cliente';
    }
    // Mark for check
    this._changeDetectorRef.markForCheck();
  }

  cancelEdit() {
    if (this.creating) {
      this.closeDrawer();
      this._router.navigate(['/admin/clientes/lista']);
    }
    this.editMode = false;
  }

  desativaContrato(event,  contrato){
    const ativaDesativa = this.cliente.ativo === true ? 'Inativar' : 'Ativar';
    const dialogRef = this._dialog.showDialog(`${ativaDesativa} Contrato`, `Certeza que deseja ${ativaDesativa} Contrato?`,
    contrato, event?.checked);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const cliente = new ClienteModel(result?.item);
        cliente.ativo = cliente.ativo === true ? false : true;
        this._clientesService.deactivateActiveContrato(cliente)
          .subscribe(
            () => {
              this._router.navigate(['/admin/clientes/lista']);
              this.closeDrawer();
              this._dialog.showMessageResponse('Atualizado com Sucesso!', 'OK');
            }
          );
      }
    });
  }

  desativaCliente(event){
    const ativaDesativa = this.cliente.ativo === true ? 'Inativar' : 'Ativar';
    const dialogRef = this._dialog.showDialog(`${ativaDesativa} Cliente`, `Certeza que deseja ${ativaDesativa} Cliente?`,
      this.cliente, event?.checked);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const cliente = new ClienteModel(result?.item);
        cliente.ativo = cliente.ativo === true ? false : true;
        this._clientesService.deactivateActiveCliente(cliente)
          .subscribe(
            () => {
              this._router.navigate(['/admin/clientes/lista']);
              this.closeDrawer();
              this.checked = true;
              this._dialog.showMessageResponse('Atualizado com Sucesso!', 'OK');
            }
          );
      }else{
        this.checked = false;
      }
    });
  }

  updateItem() {
    if (this.clienteForm.valid) {
      this.contatos().controls.forEach((element) => {
        element.value.inicioVigencia = moment(element.value.inicioVigencia).format('L');
        element.value.terminoVigencia = moment(element.value.terminoVigencia).format('L');
      });
      this.saving = true;
      const clienteContrato = new ClienteModel(this.clienteForm.value);
      this._clientesService.editClienteContrato(clienteContrato)
      .subscribe(() =>{
        this.saving = false;
        this.toggleEditMode(false);
        this.closeDrawer().then(() => true);
        this._router.navigate(['/admin/clientes/lista']);
        this._dialogMessage.showMessageResponse('Cliente Adicionado com Sucesso!', 201);
      });
    }
  }

  onSubmit() {
    if (this.clienteForm.valid) {
      this.contatos().controls.forEach((element) => {
        element.value.inicioVigencia = moment(element.value.inicioVigencia).format('L');
        element.value.terminoVigencia = moment(element.value.terminoVigencia).format('L');
      });
      this.saving = true;
      this.closeDrawer().then(() => true);
      const cliente = new ClienteModel(this.clienteForm.value);
      delete cliente.recId;
      this._clientesService
        .addCliente(cliente)
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(
          () => {
            this.saving = false;
            this.toggleEditMode(false);
            this.closeDrawer().then(() => true);
            this._router.navigate(['/admin/clientes/lista']);
            this._dialogMessage.showMessageResponse('Cliente Adicionado com Sucesso!', 201);

          });

    }
  }
}
