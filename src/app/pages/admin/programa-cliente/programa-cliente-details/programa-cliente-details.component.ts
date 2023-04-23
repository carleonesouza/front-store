import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { ProgramaCliente } from 'app/models/programaCliente.model';
import { ListItemsComponent } from 'app/shared/list-items/list-items.component';
import { DialogMessage } from 'app/utils/dialog-message ';
import { Observable } from 'rxjs';
import { ProgramaClienteService } from '../programa-cliente.service';

@Component({
  selector: 'app-programa-cliente-details',
  templateUrl: './programa-cliente-details.component.html',
  styleUrls: ['./programa-cliente-details.component.scss']
})
export class ProgramaClienteDetailsComponent implements OnInit {

  @Input() programaClienteForm: FormGroup;
  @Input() checked: boolean;
  editMode: boolean = false;
  title: string;
  creating: boolean = false;
  loading: boolean = false;
  programaCliente$: Observable<any>;
  programaCliente: any;

  constructor(private _changeDetectorRef: ChangeDetectorRef, private _listItemComponent: ListItemsComponent,
    private _formBuilder: FormBuilder,
    public _snackBar: MatSnackBar,
    private _activateRoute: ActivatedRoute,
    private _programaClienteService: ProgramaClienteService,
    private _router: Router,
    public _dialog: DialogMessage,
    public dialog: MatDialog) {  }

  ngOnInit(): void {
     // Open the drawer
     this._listItemComponent.matDrawer.open();
     this._changeDetectorRef.markForCheck();

     if (this._activateRoute.snapshot.url[0].path === 'add') {
      this.creating = true;
      this.title = 'Novo Programa Cliente';
      this.createProgramaClienteForm();
    }

    if (this._activateRoute.snapshot.paramMap.get('id') !== 'add') {

      this.loading = true;
      this.programaCliente$ = this._programaClienteService.programaCliente$;

      this.programaCliente$
        .subscribe((programa) => {

          // Open the drawer in case it is closed
          this._listItemComponent.matDrawer.open();
          this.createProgramaClienteForm();
          this.programaClienteForm.reset();
          this.programaCliente = programa;
          // Get the Lista
          if (this.programaCliente) {
            this.loading = false;
            this.programaClienteForm.patchValue(this.programaCliente);
          }

          // Toggle the edit mode off
          this.toggleEditMode(false);

          // Mark for check
          this._changeDetectorRef.markForCheck();
        });


    }
  }

  createProgramaClienteForm(){
    this.programaClienteForm = this._formBuilder.group({
      recId: new FormControl(''),
      progCliDescricao: new FormControl('', Validators.required),
    });
  }

  get programaClienteControls() {
    return this.programaClienteForm.controls;
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
      this.title = 'Editar Programa Cliente';
    }
    // Mark for check
    this._changeDetectorRef.markForCheck();
  }

  cancelEdit() {
    if(this.creating){
      this.closeDrawer();
      this._router.navigate(['/admin/programa-cliente/lista']);
    }
    this.editMode = false;
  }

  updateItem() {
    if (this.programaClienteForm.valid) {
      const programaCliente = new ProgramaCliente(this.programaClienteForm.value);
      this._programaClienteService.editPrograma(programaCliente)
      .subscribe(() => {
        this._dialog.showMessageResponse('Atualizado com Sucesso!', 'OK');
      });
    }
  }

  desativaPrograma(event) {
    const ativaDesativa = this.programaCliente.progCliStatus === true ? 'Inativar' : 'Ativar';
    const dialogRef = this._dialog.showDialog( `${ativaDesativa} Programa Cliente`, `Certeza que deseja ${ativaDesativa} esse Programa?`,
      this.programaCliente, event?.checked);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const programa = new ProgramaCliente(result.item);
        programa.progCliStatus = programa.progCliStatus === true ? false : true;
        this._programaClienteService.deactivateActiveProgramaCliente(programa)
          .subscribe(
            () => {
              this._router.navigate(['/admin/programa-cliente/lista']);
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

  onSubmit(){
    if(this.programaClienteForm.valid){
      const programaCliente = new ProgramaCliente(this.programaClienteForm.value);
      delete programaCliente.recId;
      this._programaClienteService.addProgramaCliente(programaCliente)
      .subscribe(() => {
        this.closeDrawer().then(() => true);
        this._router.navigate(['/admin/programa-cliente/lista']);
      });
    }
  }
}


