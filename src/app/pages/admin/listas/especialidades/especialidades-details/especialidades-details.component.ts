import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { ListItemsComponent } from 'app/shared/list-items/list-items.component';
import { Observable } from 'rxjs';
import { EspecialidadesService } from '../especialidades.service';

@Component({
  selector: 'app-especialidades-details',
  templateUrl: './especialidades-details.component.html',
  styleUrls: ['./especialidades-details.component.scss']
})
export class EspecialidadesDetailsComponent implements OnInit {

  @Input() especialidadesForm: FormGroup;
  editMode: boolean = false;
  title: string;
  creating: boolean = false;
  loading: boolean = false;
  especialidade$: Observable<any>;
  especialidade: any;

  constructor(private _changeDetectorRef: ChangeDetectorRef, private _listItemComponent: ListItemsComponent,
    private _formBuilder: FormBuilder,
    public _snackBar: MatSnackBar,
    private _activateRoute: ActivatedRoute,
    private _especialidadeService: EspecialidadesService,
    private _router: Router,
    public dialog: MatDialog) {  }

  ngOnInit(): void {
     // Open the drawer
     this._listItemComponent.matDrawer.open();
     this._changeDetectorRef.markForCheck();

     if (this._activateRoute.snapshot.url[0].path === 'add') {
      this.creating = true;
      this.title = 'Nova Especialidade';
      this.createEspecialidadeForm();
    }

    if (this._activateRoute.snapshot.paramMap.get('id') !== 'add') {

      this.loading = true;
      this.especialidade$ = this._especialidadeService.especialidade$;

      this.especialidade$
        .subscribe((especialidade) => {

          // Open the drawer in case it is closed
          this._listItemComponent.matDrawer.open();
          this.createEspecialidadeForm();
          this.especialidadesForm.reset();
          this.especialidade = especialidade;
          // Get the Lista
          if (this.especialidade) {
            this.loading = false;
            this.especialidadesForm.patchValue(this.especialidade);
          }

          // Toggle the edit mode off
          this.toggleEditMode(false);

          // Mark for check
          this._changeDetectorRef.markForCheck();
        });


    }
  }

  createEspecialidadeForm(){
    this.especialidadesForm = this._formBuilder.group({
      lstEspDocDescricao: new FormControl(''),
    });
  }

  get especialidadeControls() {
    return this.especialidadesForm.controls;
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
      this.title = 'Editar Especialidade';
    }
    // Mark for check
    this._changeDetectorRef.markForCheck();
  }

  cancelEdit() {
    if(this.creating){
      this.closeDrawer();
      this._router.navigate(['/admin/listas/especialidades/list']);
    }
    this.editMode = false;
  }

  updateItem() {
    if (this.especialidadesForm.valid) {
      console.log(this.especialidadesForm.value);
    }
  }

  onSubmit(){
    if(this.especialidadesForm.valid){
     console.log(this.especialidadesForm.value);
    }
  }
}
