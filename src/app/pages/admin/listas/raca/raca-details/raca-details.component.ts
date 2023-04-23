import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, UntypedFormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'app/core/auth/auth.service';
import { Raca } from 'app/models/raca';
import { User } from 'app/models/user';
import { ListItemsComponent } from 'app/shared/list-items/list-items.component';
import { Observable, Subject } from 'rxjs';
import { takeUntil, delay } from 'rxjs/operators';
import { RacaService } from '../raca.service';

@Component({
  selector: 'app-raca-details',
  templateUrl: './raca-details.component.html',
  styleUrls: ['./raca-details.component.scss']
})
export class RacaDetailsComponent implements OnInit {

  @Input() racaForm: UntypedFormGroup;
  editMode: boolean = false;
  title: string;
  user: User;
  creating: boolean = false;
  loading: boolean = false;
  raca$: Observable<Raca>;
  raca: Raca;

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(private _changeDetectorRef: ChangeDetectorRef, private _listComponent: ListItemsComponent,
    private _formBuilder: UntypedFormBuilder,
    public _snackBar: MatSnackBar,
    private _authService: AuthService,
    private _route: ActivatedRoute,
    private _racaService: RacaService,
    private _router: Router,
    public dialog: MatDialog) {  }

  ngOnInit(): void {
     // Open the drawer
     this._listComponent.matDrawer.open();
     this._changeDetectorRef.markForCheck();

     if (this._route.snapshot.url[0].path === 'add') {
      this.creating = true;
      this.title = 'Nova Raça';
      this.createRacaForm();
    }

    if (this._route.snapshot.paramMap.get('id') !== 'add') {

      this.loading = true;
      this.raca$ = this._racaService.raca$;

      this._racaService.raca$
        .subscribe((raca: Raca) => {

          // Open the drawer in case it is closed
          this._listComponent.matDrawer.open();
          this.createRacaForm();
          this.racaForm.reset();

          // Get the Lista
          this.raca = raca;
          if (this.raca) {
            this.racaForm.patchValue(this.raca);
            this.loading = false;
          }

          // Toggle the edit mode off
          this.toggleEditMode(false);

          // Mark for check
          this._changeDetectorRef.markForCheck();
        });


    }
  }

  createRacaForm(){
    this.racaForm = this._formBuilder.group({
      recId: new UntypedFormControl(''),
      raca: new UntypedFormControl('', Validators.required),
      lstRacaLoginInclusao: new UntypedFormControl(''),
      lstRacaLoginAlteracao: new UntypedFormControl(''),
      lstRacaLoginExclusao: new UntypedFormControl('')
    });
  }

  get racaControls() {
    return this.racaForm.controls;
  }

  compareFn(c1: any, c2: any): boolean {
    return c1 && c2 ? c1.recId === c2.recId : c1 === c2;
  }


    /**
     * Close the drawer
     */
     async closeDrawer(): Promise<MatDrawerToggleResult> {
      return this._listComponent.matDrawer.close();
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
      this.title = 'Editar Raça';
    }
    // Mark for check
    this._changeDetectorRef.markForCheck();
  }

  cancelEdit() {
    if(this.creating){
      this.closeDrawer();
      this._router.navigate(['/listas/racas']);
    }
    this.editMode = false;
  }

  async updateRaca() {
    await this._authService.getUser().then((user) => {
      this.user = new User(user);
    });
    if (this.racaForm.valid && this.user) {
      if (this.racaForm.updateOn === 'change' && !this.racaForm.pristine) {
        this.racaForm.value.lstRacaLoginAlteracao = this.user.getFullName();
        const raca = new Raca(this.racaForm.value);
        this._racaService.editRaca(raca).subscribe(
          () => {
          this._snackBar.open('Raça Atualizada com Sucesso!', ' ' + 200, { duration: 6000 });
        });
      }
    }
  }

  async onSubmit(){
    await this._authService.getUser().then((user) =>{
      this.user = new User(user);
    });
    if(this.racaForm.valid && this.user){
      this.racaForm.value.lstRacaLoginInclusao = this.user.getFullName();
      const raca = new Raca(this.racaForm.value);
      this._racaService.addRaca(raca).subscribe(()=>{
        this._snackBar.open('Raça Adicionado com Sucesso!', ' ' + 200, { duration: 6000 });
        this.racaForm.reset();
      });
    }
  }
}
