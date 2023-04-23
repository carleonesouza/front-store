import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { ListItemsComponent } from 'app/shared/list-items/list-items.component';
import { Observable } from 'rxjs';
import { CondicaoClinicaService } from '../condicao-clinica.service';

@Component({
  selector: 'app-condicao-clinica-details',
  templateUrl: './condicao-clinica-details.component.html',
  styleUrls: ['./condicao-clinica-details.component.scss']
})
export class CondicaoClinicaDetailsComponent implements OnInit {

  @Input() condicaoClinicaForm: FormGroup;
  editMode: boolean = false;
  title: string;
  creating: boolean = false;
  loading: boolean = false;
  condicaoClinica$: Observable<any>;
  condicaoClinica: any;

  constructor(private _changeDetectorRef: ChangeDetectorRef, private _listItemComponent: ListItemsComponent,
    private _formBuilder: FormBuilder,
    public _snackBar: MatSnackBar,
    private _activateRoute: ActivatedRoute,
    private _condicaoClinicaService: CondicaoClinicaService,
    private _router: Router,
    public dialog: MatDialog) {  }

  ngOnInit(): void {
     // Open the drawer
     this._listItemComponent.matDrawer.open();
     this._changeDetectorRef.markForCheck();

     if (this._activateRoute.snapshot.url[0].path === 'add') {
      this.creating = true;
      this.title = 'Nova Condição Clínica';
      this.createCondicaoClinicaoForm();
    }

    if (this._activateRoute.snapshot.paramMap.get('id') !== 'add') {

      this.loading = true;
      this.condicaoClinica$ = this._condicaoClinicaService.condicaoClinica$;

      this.condicaoClinica$
        .subscribe((condicaoClinica) => {

          // Open the drawer in case it is closed
          this._listItemComponent.matDrawer.open();
          this.createCondicaoClinicaoForm();
          this.condicaoClinicaForm.reset();
          this.condicaoClinica = condicaoClinica;
          // Get the Lista
          if (this.condicaoClinica) {
            this.loading = false;
            this.condicaoClinicaForm.patchValue(this.condicaoClinica);
          }

          // Toggle the edit mode off
          this.toggleEditMode(false);

          // Mark for check
          this._changeDetectorRef.markForCheck();
        });


    }
  }

  createCondicaoClinicaoForm(){
    this.condicaoClinicaForm = this._formBuilder.group({
      lstConCliDescricao: new FormControl(''),
      lstConCliCategoria: new FormControl(''),
      lstConCliPalavraChave: new FormControl(''),
    });
  }

  get condicaoClinicaControls() {
    return this.condicaoClinicaForm.controls;
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
      this.title = 'Editar Condição Clínica';
    }
    // Mark for check
    this._changeDetectorRef.markForCheck();
  }

  cancelEdit() {
    if(this.creating){
      this.closeDrawer();
      this._router.navigate(['/admin/listas/condicao-clinica/list']);
    }
    this.editMode = false;
  }

  updateItem() {
    if (this.condicaoClinicaForm.valid) {
      console.log(this.condicaoClinicaForm.value);
    }
  }

  onSubmit(){
    if(this.condicaoClinicaForm.valid){
     console.log(this.condicaoClinicaForm.value);
    }
  }
}
