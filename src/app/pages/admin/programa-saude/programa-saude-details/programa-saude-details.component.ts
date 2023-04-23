import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, UntypedFormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { ProgramaSaude } from 'app/models/programaSaude.model';
import { ListItemsComponent } from 'app/shared/list-items/list-items.component';
import { DialogMessage } from 'app/utils/dialog-message ';
import { Observable } from 'rxjs';
import { ProgramaSaudeService } from '../programa-saude.service';

@Component({
  selector: 'app-programa-saude-details',
  templateUrl: './programa-saude-details.component.html',
  styleUrls: ['./programa-saude-details.component.scss']
})
export class ProgramaSaudeDetailsComponent implements OnInit {

  @Input() programaSaudeForm: UntypedFormGroup;
  @Input() checked: boolean;
  editMode: boolean = false;
  title: string;
  creating: boolean = false;
  loading: boolean = false;
  programaSaude$: Observable<any>;
  programaSaude: any;

  constructor(private _changeDetectorRef: ChangeDetectorRef, private _listItemComponent: ListItemsComponent,
    private _formBuilder: UntypedFormBuilder,
    public _snackBar: MatSnackBar,
    private _activateRoute: ActivatedRoute,
    private _programaSaudeService: ProgramaSaudeService,
    private _router: Router,
    public _dialog: DialogMessage,
    public dialog: MatDialog) {  }

  ngOnInit(): void {
     // Open the drawer
     this._listItemComponent.matDrawer.open();
     this._changeDetectorRef.markForCheck();

     if (this._activateRoute.snapshot.url[0].path === 'add') {
      this.creating = true;
      this.title = 'Novo Programa Saúde';
      this.createProgramaSaudeForm();
    }

    if (this._activateRoute.snapshot.paramMap.get('id') !== 'add') {

      this.loading = true;
      this.programaSaude$ = this._programaSaudeService.programaSaude$;

      this.programaSaude$
        .subscribe((programa) => {

          // Open the drawer in case it is closed
          this._listItemComponent.matDrawer.open();
          this.createProgramaSaudeForm();
          this.programaSaudeForm.reset();
          this.programaSaude = programa;
          // Get the Lista
          if (this.programaSaude) {
            this.loading = false;
            this.programaSaudeForm.patchValue(this.programaSaude);
          }

          // Toggle the edit mode off
          this.toggleEditMode(false);

          // Mark for check
          this._changeDetectorRef.markForCheck();
        });


    }
  }

  createProgramaSaudeForm(){
    this.programaSaudeForm = this._formBuilder.group({
      recId: new UntypedFormControl(''),
      progSauDescricao: new UntypedFormControl('', Validators.required),
    });
  }

  get programaSaudeControls() {
    return this.programaSaudeForm.controls;
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
      this.title = 'Editar Programa Saúde';
    }
    // Mark for check
    this._changeDetectorRef.markForCheck();
  }

  cancelEdit() {
    if(this.creating){
      this.closeDrawer();
      this._router.navigate(['/admin/programa-saude/lista']);
    }
    this.editMode = false;
  }

  updateItem() {
    if (this.programaSaudeForm.valid) {
      const programaSaude = new ProgramaSaude(this.programaSaudeForm.value);
      this._programaSaudeService.editPrograma(programaSaude)
      .subscribe(() => {
        this._router.navigate(['/admin/programa-saude/lista']);
      });
    }
  }

  desativaPrograma(event) {
    const ativaDesativa = this.programaSaude.progSauStatus === true ? 'Inativar' : 'Ativar';
    const dialogRef = this._dialog.showDialog(`${ativaDesativa}  Programa Saúde`, `Certeza que deseja ${ativaDesativa} esse Programa?`,
      this.programaSaude, event?.checked);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const programa = new ProgramaSaude(result.item);
        programa.progSauStatus = programa.progSauStatus === true ? false : true;
        this._programaSaudeService.deactivateActiveProgramaSaude(programa)
          .subscribe(
            () => {
              this._router.navigate(['/admin/programa-saude/lista']);
              this.checked = true;
              this.closeDrawer();
              this._dialog.showMessageResponse('Atualizado com Sucesso!', 'OK');
            }
          );
      }else{
        this.checked = false;
      }
    });
  }

  onSubmit(){
    if(this.programaSaudeForm.valid){
      const programaSaude = new ProgramaSaude(this.programaSaudeForm.value);
      delete programaSaude.recId;
      this._programaSaudeService.addProgramaSaude(programaSaude)
      .subscribe(() => {
        this._router.navigate(['/admin/programa-saude/lista']);
      });
    }
  }
}


