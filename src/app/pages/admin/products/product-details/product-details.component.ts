import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatAccordion } from '@angular/material/expansion';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Produto } from 'app/models/produto.model';
import { ListItemsComponent } from 'app/shared/list-items/list-items.component';
import { DialogMessage } from 'app/utils/dialog-message ';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ProductsService } from '../products.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit, OnDestroy {

  @Input() productForm: UntypedFormGroup;
  @ViewChild(MatAccordion) accordion: MatAccordion;
  displayedColumns: string[] = ['position', 'name'];
  editMode: boolean = false;
  title: string;
  user: any;
  creating: boolean = false;
  loading: boolean = false;
  hide = true;
  product$: Observable<any>;
  contratcts$: Observable<any[]>;
  product: any;
  saving: boolean;
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(private _changeDetectorRef: ChangeDetectorRef,
    private _listItemsComponent: ListItemsComponent,
    private _formBuilder: UntypedFormBuilder,
    public _snackBar: MatSnackBar,
    private _productsService: ProductsService,
    private _route: ActivatedRoute,
    public _dialog: DialogMessage,
    private _router: Router) { }

  ngOnInit(): void {
    // Open the drawer
    this._listItemsComponent.matDrawer.open();
    this._changeDetectorRef.markForCheck();

    if (this._route.snapshot.url[0].path === 'add') {
      this.creating = true;
      this.title = 'Novo Produto';
      this.createProductForm();
    }

    if (this._route.snapshot.paramMap.get('id') !== 'add') {

      this.loading = true;
      this.product$ = this._productsService.product$;


      this._productsService.product$
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((product: any) => {

          // Open the drawer in case it is closed
          this._listItemsComponent.matDrawer.open();
          this.createProductForm();
          this.productForm.reset();

          // Get the Lista
          this.product = product['content'][0];

          if (this.product) {
            this.productForm.patchValue(this.product);
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


  createProductForm() {
    this.productForm = this._formBuilder.group({
      recId: new UntypedFormControl(''),
      prodDescricao: new UntypedFormControl('', Validators.required),
    });
  }

  comparaPasswords(v1, v2): boolean {
    return v1 && v2 ? v1 === v2 : false;
  }

  get productControls() {
    return this.productForm.controls;
  }

  compareFn(c1: any, c2: any): boolean {
    return c1 && c2 ? c1.roleName === c2 : c2 === c1.roleName;
  }

  /**
   * Close the drawer
   */
  closeDrawer(): Promise<MatDrawerToggleResult> {
    return this._listItemsComponent.matDrawer.close();
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
      this.title = 'Editar Produto';
    }
    // Mark for check
    this._changeDetectorRef.markForCheck();
  }

  cancelEdit() {
    if (this.creating) {
      this.closeDrawer();
      this._router.navigate(['/admin/produtos/lista']);
    }
    this.editMode = false;
  }

  updateProduct() {

    if (this.productForm.valid) {
      this.saving = true;
      const produto = new Produto(this.productForm.value);
      this._productsService
        .editProduct(produto)
        .subscribe(() => {
          this._router.navigate(['/admin/produtos/lista/']);
          this.saving = false;
          this.toggleEditMode(false);
          this.closeDrawer().then(() => true);
          this._dialog.showMessageResponse('Atualizado com Sucesso!', 'OK');
        }
        );
    }
  }

  desativaProduto(event) {
    const ativaDesativa = this.product.ativo === true ? 'Inativar' : 'Ativar';
    const dialogRef = this._dialog.showDialog(`${ativaDesativa} Produto`, `Certeza que deseja ${ativaDesativa} Produto?`,
      this.product, event?.checked);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const produto = new Produto(result?.item);
        produto.ativo = produto.ativo === true ? false : true;
        this._productsService.deactivateActiveProduct(produto)
          .subscribe(
            () => {
              this._router.navigate(['/admin/produtos/lista/']);
              this.closeDrawer();
              this._dialog.showMessageResponse('Atualizado com Sucesso!', 'OK');
            }
          );
      }
    });
  }

  onSubmit() {
    if (this.productForm.valid) {
      const product = new Produto(this.productForm.value);
      delete product.recId;
      this.saving = true;
      this.closeDrawer().then(() => true);
      this._productsService
        .addProduct(product)
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(
          () => {
            this.saving = false;
            this.toggleEditMode(false);
            this.closeDrawer().then(() => true);
            this._router.navigate(['/admin/produto/lista']);
            this._snackBar.open('Produto Salvo com Sucesso');
            this.productForm.reset();
          });
    }
  }

}
