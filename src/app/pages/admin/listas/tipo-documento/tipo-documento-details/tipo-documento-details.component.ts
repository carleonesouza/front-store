import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, UntypedFormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { ListItemsComponent } from 'app/shared/list-items/list-items.component';
import { Observable } from 'rxjs';
import { TipoDocumentoService } from '../tipo-documento.service';

@Component({
  selector: 'app-tipo-documento-details',
  templateUrl: './tipo-documento-details.component.html',
  styleUrls: ['./tipo-documento-details.component.scss']
})
export class TipoDocumentoDetailsComponent implements OnInit {

  @Input() tipoDocumentoForm: UntypedFormGroup;
  editMode: boolean = false;
  title: string;
  creating: boolean = false;
  loading: boolean = false;
  tipoDocumento$: Observable<any>;
  tipoDocumento: any;

  constructor(private _changeDetectorRef: ChangeDetectorRef, private _listItemComponent: ListItemsComponent,
    private _formBuilder: UntypedFormBuilder,
    public _snackBar: MatSnackBar,
    private _activateRoute: ActivatedRoute,
    private _tipoDocumentoService: TipoDocumentoService,
    private _router: Router,
    public dialog: MatDialog) {  }

  ngOnInit(): void {
     // Open the drawer
     this._listItemComponent.matDrawer.open();
     this._changeDetectorRef.markForCheck();

     if (this._activateRoute.snapshot.url[0].path === 'add') {
      this.creating = true;
      this.title = 'Novo Tipo Documento';
      this.createTipoDocumentoForm();
    }

    if (this._activateRoute.snapshot.paramMap.get('id') !== 'add') {

      this.loading = true;
      this.tipoDocumento$ = this._tipoDocumentoService.tipoDocumento$;

      this.tipoDocumento$
        .subscribe((tipoDocumento) => {

          // Open the drawer in case it is closed
          this._listItemComponent.matDrawer.open();
          this.createTipoDocumentoForm();
          this.tipoDocumentoForm.reset();
          this.tipoDocumento = tipoDocumento;
          // Get the Lista
          if (this.tipoDocumento) {
            this.loading = false;
            this.tipoDocumentoForm.patchValue(this.tipoDocumento);
          }

          // Toggle the edit mode off
          this.toggleEditMode(false);

          // Mark for check
          this._changeDetectorRef.markForCheck();
        });


    }
  }

  createTipoDocumentoForm(){
    this.tipoDocumentoForm = this._formBuilder.group({
      lstTipDocDescricao: new UntypedFormControl(''),
    });
  }

  get tipoDocumentoControls() {
    return this.tipoDocumentoForm.controls;
  }

  compareFn(c1: any, c2: any): boolean {
    return c1 && c2 ? c1.recId === c2.recId : c1 === c2;
  }


    /**
     * Close the drawer
     */
     async closeDrawer(): Promise<MatDrawerToggleResult> {
      return this._listItemComponent.matDrawer.close();
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
      this.title = 'Editar Tipo Documento';
    }
    // Mark for check
    this._changeDetectorRef.markForCheck();
  }

  cancelEdit() {
    if(this.creating){
      this.closeDrawer();
      this._router.navigate(['/admin/listas/documentos/list']);
    }
    this.editMode = false;
  }

  updateItem() {
    if (this.tipoDocumentoForm.valid) {
      console.log(this.tipoDocumentoForm.value);
    }
  }

  onSubmit(){
    if(this.tipoDocumentoForm.valid){
     console.log(this.tipoDocumentoForm.value);
    }
  }
}
