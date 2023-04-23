import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, UntypedFormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'app/core/auth/auth.service';
import { Sexo } from 'app/models/sexo';
import { User } from 'app/models/user';
import { ListItemsComponent } from 'app/shared/list-items/list-items.component';
import { Observable } from 'rxjs';
import { SexoService } from '../sexo.service';

@Component({
  selector: 'app-sexo-details',
  templateUrl: './sexo-details.component.html',
  styleUrls: ['./sexo-details.component.scss']
})
export class SexoDetailsComponent implements OnInit {

  @Input() sexoForm: UntypedFormGroup;
  editMode: boolean = false;
  title: string;
  user: User;
  creating: boolean = false;
  loading: boolean = false;
  sexo$: Observable<Sexo>;
  sexo: Sexo;

  constructor(private _changeDetectorRef: ChangeDetectorRef, private _listItemComponent: ListItemsComponent,
    private _formBuilder: UntypedFormBuilder,
    public _snackBar: MatSnackBar,
    private _authService: AuthService,
    private _activateRoute: ActivatedRoute,
    private _sexoService: SexoService,
    private _router: Router,
    public dialog: MatDialog) {  }

  ngOnInit(): void {
     // Open the drawer
     this._listItemComponent.matDrawer.open();
     this._changeDetectorRef.markForCheck();

     if (this._activateRoute.snapshot.url[0].path === 'add') {
      this.creating = true;
      this.title = 'Novo Sexo';
      this.createSexoForm();
    }

    if (this._activateRoute.snapshot.paramMap.get('id') !== 'add') {

      this.loading = true;
      this.sexo$ = this._sexoService.sexo$;

      this._sexoService.sexo$
        .subscribe((sexo: Sexo) => {

          // Open the drawer in case it is closed
          this._listItemComponent.matDrawer.open();
          this.createSexoForm();
          this.sexoForm.reset();
          this.sexo = sexo;
          // Get the Lista
          if (this.sexo) {
            this.loading = false;
            this.sexoForm.patchValue(this.sexo);
          }

          // Toggle the edit mode off
          this.toggleEditMode(false);

          // Mark for check
          this._changeDetectorRef.markForCheck();
        });


    }
  }

  createSexoForm(){
    this.sexoForm = this._formBuilder.group({
      recId: new UntypedFormControl(''),
      sexo: new UntypedFormControl('', Validators.required),
      lstSexoLoginExclusao: new UntypedFormControl(''),
      lstSexoLoginInclusao: new UntypedFormControl(''),
      lstSexoLoginAlteracao: new UntypedFormControl('')
    });
  }

  get sexoControls() {
    return this.sexoForm.controls;
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
      this.title = 'Editar Sexo';
    }
    // Mark for check
    this._changeDetectorRef.markForCheck();
  }

  cancelEdit() {
    if(this.creating){
      this.closeDrawer();
      this._router.navigate(['/listas/sexos']);
    }
    this.editMode = false;
  }

  async updateSexo() {
    await this._authService.getUser().then((user) => {
      this.user = new User(user);
    });
    if (this.sexoForm.valid && this.user) {
      if (this.sexoForm.updateOn === 'change' && !this.sexoForm.pristine) {
        this.sexoForm.value.lstSexoLoginAlteracao = this.user.getFullName();
        const sexo = new Sexo(this.sexoForm.value);
        this._sexoService.editSexo(sexo).subscribe(
          () => {
          this._snackBar.open('Sexo Atualizado com Sucesso!', ' ' + 200, { duration: 6000 });
        });
      }
    }
  }

  async onSubmit(){
    await this._authService.getUser().then((user) =>{
      this.user = new User(user);
    });
    if(this.sexoForm.valid && this.user){
      this.sexoForm.value.lstSexoLoginInclusao = this.user.getFullName();
      const sexo = new Sexo(this.sexoForm.value);
      this._sexoService.addSexo(sexo).subscribe(()=>{
        this._snackBar.open('Sexo Adicionado com Sucesso!', ' ' + 200, { duration: 6000 });
        this.sexoForm.reset();
      });
    }
  }
}
