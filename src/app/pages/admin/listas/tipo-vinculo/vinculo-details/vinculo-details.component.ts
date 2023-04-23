import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, UntypedFormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { ListItemsComponent } from 'app/shared/list-items/list-items.component';
import { Observable } from 'rxjs';
import { TipoVinculoService } from '../tipo-vinculo.service';

@Component({
  selector: 'app-vinculo-details',
  templateUrl: './vinculo-details.component.html',
  styleUrls: ['./vinculo-details.component.scss']
})
export class VinculoDetailsComponent implements OnInit {

  @Input() tipoVinculoForm: UntypedFormGroup;
  editMode: boolean = false;
  title: string;
  creating: boolean = false;
  loading: boolean = false;
  tipoVinculo$: Observable<any>;
  tipoVinculo: any;

  constructor(private _changeDetectorRef: ChangeDetectorRef, private _listItemComponent: ListItemsComponent,
    private _formBuilder: UntypedFormBuilder,
    public _snackBar: MatSnackBar,
    private _activateRoute: ActivatedRoute,
    private _tipoVinculoService: TipoVinculoService,
    private _router: Router,
    public dialog: MatDialog) {  }

  ngOnInit(): void {
     // Open the drawer
     this._listItemComponent.matDrawer.open();
     this._changeDetectorRef.markForCheck();

     if (this._activateRoute.snapshot.url[0].path === 'add') {
      this.creating = true;
      this.title = 'Novo Tipo Vínculo';
      this.createTipoVinculoForm();
    }

    if (this._activateRoute.snapshot.paramMap.get('id') !== 'add') {

      this.loading = true;
      this.tipoVinculo$ = this._tipoVinculoService.vinculo$;

      this.tipoVinculo$
        .subscribe((tipoVinculo) => {

          // Open the drawer in case it is closed
          this._listItemComponent.matDrawer.open();
          this.createTipoVinculoForm();
          this.tipoVinculoForm.reset();
          this.tipoVinculo = tipoVinculo;
          // Get the Lista
          if (this.tipoVinculo) {
            this.loading = false;
            this.tipoVinculoForm.patchValue(this.tipoVinculo);
          }

          // Toggle the edit mode off
          this.toggleEditMode(false);

          // Mark for check
          this._changeDetectorRef.markForCheck();
        });


    }
  }

  createTipoVinculoForm(){
    this.tipoVinculoForm = this._formBuilder.group({
      recId: new UntypedFormControl(''),
      lstTipVinDescricao: new UntypedFormControl(''),
    });
  }

  get tipoVinculoControls() {
    return this.tipoVinculoForm.controls;
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
      this.title = 'Editar Tipo Vínculo';
    }
    // Mark for check
    this._changeDetectorRef.markForCheck();
  }

  cancelEdit() {
    if(this.creating){
      this.closeDrawer();
      this._router.navigate(['/admin/tipo-vinculo/lista']);
    }
    this.editMode = false;
  }

  updateItem() {
    if (this.tipoVinculoForm.valid) {
      this._tipoVinculoService
      .editTipoVinculo(this.tipoVinculoForm.value)
      .subscribe(() =>{
       this._snackBar.open('Tipo Vínculo Atualizado com Sucesso!', 'OK', { duration: 6000 });
       this.closeDrawer();
       this._router.navigate(['/admin/tipo-vinculo/lista']);
      });
    }
  }

  onSubmit(){
    if(this.tipoVinculoForm.valid){
      const vinculo = this.tipoVinculoForm.value.lstTipVinDescricao;
     this._tipoVinculoService
     .addTipoVinculo(vinculo)
     .subscribe(() =>{
      this._snackBar.open('Tipo Vínculo Adicionado com Sucesso!', 'OK', { duration: 6000 });
      this.tipoVinculoForm.reset();
      this.closeDrawer();
      this._router.navigate(['/admin/tipo-vinculo/lista']);
     });
    }
  }
}
