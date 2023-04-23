import { OverlayRef } from '@angular/cdk/overlay';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef,
  Component, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { AbstractControl, UntypedFormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Cidade } from 'app/models/cidade';
import { Escolaridade } from 'app/models/escolaridade';
import { Estado } from 'app/models/estado';
import { Genero } from 'app/models/genero';
import { Individuo } from 'app/models/individuo';
import { Raca } from 'app/models/raca';
import { Documento } from 'app/models/documento';
import * as _moment from 'moment';
_moment.locale('pt-br');
import { Observable, Subject } from 'rxjs';
import { Sexo } from 'app/models/sexo';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { delay, takeUntil } from 'rxjs/operators';
import _ from 'lodash';
import { MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, NativeDateAdapter } from '@angular/material/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MatDialog } from '@angular/material/dialog';
import { IndividuosService } from '../individuos.service';
import { Telefone } from 'app/models/telefone';
import { Endereco } from 'app/models/endereco';
import { Identificador } from 'app/models/identificador';
import { RolesService } from '../../settings/roles/roles.service';
import { DialogMessage } from 'app/utils/dialog-message ';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';




@Component({
  selector: 'app-individuos-details',
  templateUrl: './individuos-details.component.html',
  styleUrls: ['./individuos-details.component.scss'],
  providers: [{ provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
    {provide: DateAdapter, useClass: NativeDateAdapter}],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IndividuosDetailsComponent implements OnInit, OnDestroy, AfterViewInit {

  @Input() individuoForm: UntypedFormGroup;

  editMode: boolean = false;
  saving: boolean = false;
  docCPF: string;
  title: string;
  hide = true;
  creating: boolean = false;
  loading: boolean = false;
  isLoadingCidades: boolean = false;
  checkedIdt;
  individuo: Individuo;
  individuo$: Observable<Individuo>;
  tipoDoc: boolean = false;
  documentos$: Observable<Documento[]>;
  sexos$: Observable<Sexo[]>;
  cidades$: Observable<Cidade[]>;
  cidadeSelected: any;
  estados$: Observable<Estado[]>;
  escolaridades$: Observable<Escolaridade[]>;
  racas$: Observable<Raca[]>;
  useDefault = false;
  events: string[] = [];
  generos$: Observable<Genero[]>;
  roles$: Observable<any[]>;
  private _tagsPanelOverlayRef: OverlayRef;
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _formBuilder: UntypedFormBuilder,
    public _snackBar: MatSnackBar,
    private _route: ActivatedRoute,
    private _router: Router,
    private _rolesService: RolesService,
    public dialog: MatDialog,
    public _dialog: DialogMessage,
    private _individuosService: IndividuosService) {

      this.sexos$ = this._individuosService.getListaSexos();
      this.estados$ = this._individuosService.getEstados();
      this.generos$ = this._individuosService.getListaGeneros();
      this.racas$ = this._individuosService.getListaRacas();
      this.escolaridades$ = this._individuosService.getListaEscolaridades();
      this.documentos$ = this._individuosService.getListaDocumentos();
      this.roles$ = this._rolesService.getAllRoles();

  }

  ngOnInit() {

    // Open the drawer
    //this._listItemsComponent.matDrawer.open();

    if (this._route.snapshot.paramMap.get('id') === 'add') {
      this.creating = true;
      this.createIndividuoForm();
      this.title = 'Novo Indivíduo';
    }

    if (this._route.snapshot.paramMap.get('id') !== 'add') {

      this.loading = true;

      this.individuo$ = this._individuosService.individuo$;

      this._individuosService.individuo$
        .pipe(
          delay(1000),
          takeUntil(this._unsubscribeAll))
        .subscribe((individuo) => {

          // Open the drawer in case it is closed
         // this._listItemsComponent.matDrawer.open();
          //create FormGroup
          this.createIndividuoForm();

          // Clear the form arrays
          (this.individuoForm.get('telefones') as UntypedFormArray).clear();
          (this.individuoForm.get('enderecos') as UntypedFormArray).clear();
          (this.individuoForm.get('documentos') as UntypedFormArray).clear();
          (this.individuoForm.get('identificadores') as UntypedFormArray).clear();

          // Get the Indivíduo
          this.individuo = individuo;

            if (this.individuo) {
            this.loading = false;

            const indDate = _moment(this.individuo?.dataNascimento).local();

            // Patch values to the form
            this.individuo.dataNascimento = new Date(indDate.format('L'));

           // const cliente = this._individuosService.buscaIndividuoCliente(this.individuo.recId).subscribe();

            //this.individuoForm.controls['cliente'].setValue();

            this.individuoForm.patchValue(this.individuo);
            this.useDefault = individuo?.status === 2 ? true : false;

            //Get the cidade by Estado Id
            if(this.individuo.enderecos){
              this.individuo.enderecos.map((endereco) => {
                this._individuosService.getCidadeByEstadoId(endereco?.cidade['estado']['recId'], endereco?.cidade['lstCidDescricao'])
                  .subscribe((cidades) => {
                    cidades?.forEach((cidade) => {
                      if (cidade?.recId === endereco?.cidade['recId']) {
                        const formAdd = this.createEnderecosForms();
                        formAdd.patchValue({
                          recId: endereco?.recId,
                          cidade: cidade,
                          estado: cidade?.estado,
                          logradouro: endereco?.logradouro,
                          bairro: endereco?.bairro,
                          cep: endereco?.cep,
                          indEndStatus: endereco?.indEndStatus
                        });
                        this.enderecos.push(formAdd);
                      }
                    });
                  });
              });
            }



            if (this.individuo?.identificadores?.length > 0) {

              this.individuo.identificadores.forEach((idt) => {
                const formId = this.createIdentificadoresForms();
                formId.patchValue({
                  recId: idt?.recId,
                  identificador: idt?.identificador,
                  indIdeStatus: idt?.indIdeStatus
                });
                this.identificadores.push(formId);
              });
            }

            if (this.individuo?.documentos?.length > 0) {
              this.individuo.documentos.forEach((documentos) => {
                const formDocs = this.createDocForms();
                formDocs.patchValue({
                  recId: documentos?.recId,
                  tipoDocId: documentos?.tipoDocId,
                  indDocNumero: documentos?.tipoDocId.tipoDocumento === 'CPF' ? this.applyingMask(documentos?.indDocNumero) : documentos?.indDocNumero,
                  indDocStatus: documentos?.indDocStatus
                });
                this.documentos.push(formDocs);
              });
            }


            if (this.individuo?.telefones?.length > 0) {
              // Iterate through them
              individuo.telefones.forEach((telefones) => {
                const formTel = this.createTelefoneForms();
                formTel.patchValue({
                  recId: telefones?.recId,
                  telefone: telefones.telefone,
                  indTelStatus: telefones.indTelStatus
                });
                this.telefones.push(formTel);
              });
            }

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

    // Dispose the overlays if they are still on the DOM
    if (this._tagsPanelOverlayRef) {
      this._tagsPanelOverlayRef.dispose();
    }
  }

  ngAfterViewInit(): void {
    this.onChanges();
  }

  addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
    if(this.individuoForm){
      this.events.push(_moment(event.value).format('L'));
      console.log(this.events);
    }
  }

  onChanges() {
    if (this.individuoForm) {
      this.individuoForm.get('enderecos')?.valueChanges
        .subscribe((enderecos) => {
          if (enderecos.filter(e => e?.estado !== '')) {
            let estado: any;
            let cidade: any;

            for (let i = 0; i <= enderecos.length; i++) {
              if (enderecos[i]?.estado !== undefined) {
                estado = enderecos[i]?.estado;
              }

              if (enderecos[i]?.cidade !== undefined && String(enderecos[i]?.cidade).length === 3) {
                cidade = enderecos[i]?.cidade;
              }
              this.isLoadingCidades = false;
              if (estado && cidade) {
                this.isLoadingCidades = true;
                this.cidades$ = this._individuosService.getCidadeByEstadoId(estado?.recId, cidade);
              }
            }
          }
        });
    }
  }

  get telefonesControls() {
    return (this.individuoForm.get('telefones') as UntypedFormArray).controls;
  }

  get identificadoresControls() {
    return (this.individuoForm.get('identificadores') as UntypedFormArray).controls;
  }

  get individuoControlsForm(): { [key: string]: AbstractControl } {
    return this.individuoForm.controls;
  }

  get enderecosControls() {
    return (this.individuoForm.get('enderecos') as UntypedFormArray).controls;
  }

  get documentosControls() {
    return (this.individuoForm.get('documentos') as UntypedFormArray).controls;
  }


  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Close the drawer
   */
  closeDrawer() {
    this._router.navigate(['/admin/individuo/lista']);
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
      this.title = 'Editar Indivíduo';
    }
    // Mark for check
    this._changeDetectorRef.markForCheck();
  }

  applyingMask(value) {
    return value
      .replace(/\D/g, '') //substituir qualquer valor que não seja número de modo global por vazio
      .replace(/(\d{3})(\d)/, '$1.$2') //pegar 3 digitos dentro de 4 digitos ou um () grupo de captura e atribiu o ponto no primeiro grupo
      .replace(/(\d{3})(\d)/, '$1.$2') // acontece o mesmo que o acima
      .replace(/(\d{3})(\d{1,2})/, '$1-$2') // se tiver 3 digitos seguidos de 1 ou 2 digitos
      .replace(/(-\d{2})\d+?$/, '$1'); //pega um - seguido de 2 digitos, pegar o minímo possivel no final da string substitui pelo final do cpf
  }

  docSelected(event) {
    if (event.value?.tipoDocumento === 'CPF') {
      this.tipoDoc = true;
      this.docCPF = event.value?.tipoDocumento;
    }else{
      this.tipoDoc = false;
    }
  }

  /**
   *
   * @param event
   */
  getDocValue(event) {
    if (this.tipoDoc) {
      event.target.value = this.applyingMask(event.target.value);
    }

  }

/**
 *
 * @param event
 */
  desativaIndividuo(event: MatSlideToggleChange) {
    const dialogRef = this._dialog.showDialog('Inativar Indivíduo', 'Certeza que deseja Inativar Indivíduo?', this.individuo ,event?.checked);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const indiv = new Individuo(result?.item);
        indiv.status = indiv?.status === 1 ? 2 : 2;
        this._individuosService.changeIndividuoStatus(indiv).subscribe(
          () => {
            this._router.navigate(['/individuos']);
            this.closeDrawer();
            this._dialog.showMessageResponse(`Status de ${indiv?.indNome} Atualizado com Sucesso!`, 201);
          },
          (error) => { this._dialog.showMessageResponse(error.message, error.status); });
      }else{
        event.source.checked = !(event.source.checked);
      }
    });
  }

  /**
   *
   * @param event
   * @param documento
   */
  desativaDocumento(event: MatSlideToggleChange, documento: any) {

    if (documento) {
      const dialogRef = this._dialog.showDialog('Inativar Documento', 'Certeza que deseja Inativar Documento?', documento?.value, event?.checked);

      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          const doc = new Documento(result?.item);
          doc.indDocStatus = doc?.indDocStatus === 1 ? 2 : 2;
          //Desativa/Ativa documento
          this._individuosService.changeDocumentoStatus(doc);
        }
        else{
          event.source.checked = !(event.source.checked);
        }
      });
    }

  }

  /**
   *
   * @param event
   * @param identicador
   */
  desativaIdentificador(event: MatSlideToggleChange, identicador: any) {

    if (identicador) {
      const dialogRef = this._dialog.showDialog('Inativar Identificador', 'Certeza que deseja Inativar Identificador?', identicador?.value,event?.checked);

      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          const ident = new Identificador(result?.item);
          ident.indIdeStatus = ident?.indIdeStatus === 1 ? 2 : 2;
          //Desativa/Ativa Identificador
          this._individuosService.changeIdentificadorStatus(ident).subscribe();
        }else{
          event.source.checked = !(event.source.checked);
        }
      });
    }
  }

  /**
   *
   * @param event
   * @param telefone
   */
  desativaTelefone(event: MatSlideToggleChange, telefone: any) {

    if (telefone) {
      const dialogRef = this._dialog.showDialog('Inativar Telefone', 'Certeza que deseja Inativar Telefone?', telefone?.value, event?.checked);

      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          const telef = new Telefone(result?.item);
          telef.indTelStatus = telef?.indTelStatus === 1 ? 2 : 2;
          //Desativa/Ativa Telefone
          this._individuosService.changeTelefoneStatus(telef);
        }else{
          event.source.checked = !(event.source.checked);
        }
      });
    }
  }

/**
 *
 * @param event
 * @param endereco
 */
  desativaEndereco(event: MatSlideToggleChange, endereco: any) {

    if (endereco) {
      const dialogRef = this._dialog.showDialog('Inativar Endereco', 'Certeza que deseja Inativar Endereco?', endereco?.value ,event?.checked);

      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          const ender = new Endereco(result?.item);
          ender.indEndStatus = ender?.indEndStatus === 1 ? 2 : 2;
          //Desativa/Ativa Endereco
          this._individuosService.changeEnderecoStatus(ender);
        }
        else{
          event.source.checked = !(event.source.checked);
        }
      });
    }
  }

  createIndividuoForm() {
    this.individuoForm = this._formBuilder.group({
      recId: new UntypedFormControl(''),
      password: new UntypedFormControl(''),
      roles: new UntypedFormControl(['']),
      cns: new UntypedFormControl(['']),
      confirmPassword: new UntypedFormControl(''),
      indCpf: new UntypedFormControl('', [Validators.required]),
      indNome: new UntypedFormControl([''], [Validators.required]),
      indEmail: new UntypedFormControl([''], [Validators.required, Validators.email]),
      telefones: this._formBuilder.array([this.createTelefoneForms()]),
      dataNascimento: new UntypedFormControl({value: '', disabled: true}, Validators.required),
      enderecos: this._formBuilder.array([this.createEnderecosForms()]),
      sexo: new UntypedFormControl([''], [Validators.required]),
      raca: new UntypedFormControl([''], [Validators.required]),
      escolaridade: new UntypedFormControl([''], [Validators.required]),
      genero: new UntypedFormControl([''], [Validators.required]),
      documentos: this._formBuilder.array([this.createDocForms()]),
      identificadores: this._formBuilder.array([this.createIdentificadoresForms()]),
      cliente: new UntypedFormControl()
      // programaSaude: new FormControl(['']),
      // programaCliente: new FormControl(['']),
      // individuoEquipe: new FormControl([''])
    });
  }

  createDocForms() {
    return new UntypedFormGroup({
      tipoDocId: new UntypedFormControl('', Validators.required),
      indDocNumero: new UntypedFormControl('', [Validators.required]),
      indDocStatus: new UntypedFormControl('')
    }, {updateOn: 'blur'});
  }

  createIdentificadoresForms() {
    return new UntypedFormGroup({
      recId:new UntypedFormControl(''),
      identificador: new UntypedFormControl(''),
      indIdeStatus: new UntypedFormControl('')
    });
  }

  createTelefoneForms() {
    return new UntypedFormGroup({
      telefone: new UntypedFormControl('', [Validators.required, Validators.maxLength(11)]),
      indTelStatus: new UntypedFormControl('')
    });
  }

  createEnderecosForms() {
    return new UntypedFormGroup({
      logradouro: new UntypedFormControl([''], Validators.required),
      cep: new UntypedFormControl('', Validators.required),
      bairro: new UntypedFormControl('', Validators.required),
      cidade: new UntypedFormControl('', Validators.required),
      estado: new UntypedFormControl('', Validators.required),
      indEndStatus: new UntypedFormControl('')

    });
  }


  compareFn(c1: any, c2: any): boolean {
    return c1 && c2 ? c1.recId === c2.recId : c1 === c2;
  }

  itemDisplayFn(item: Cidade) {
    return item ? item.lstCidDescricao : '';
  }

  cancelEdit() {
      //this.closeDrawer();
      //this.location.back();
      this._router.navigate(['/admin/individuo/lista']);
    this.editMode = false;
  }


  addEnderecoField(): void {

    const addressFormGroup = this._formBuilder.group({ logradouro: [''], cep: [''], bairro: [''], cidade: [''], estado: [''] });

    (this.individuoForm.get('enderecos') as UntypedFormArray).push(addressFormGroup);
    // Mark for check
    this._changeDetectorRef.markForCheck();
  }


  removeEnderecoField(index: number): void {

    // Get form array for address
    const addressFormArray = this.individuoForm.get('enderecos') as UntypedFormArray;

    const endereco = addressFormArray.at(index);

    if (endereco.value?.recId) {
      const dialogRef = this._dialog.showDialog('Remover Endereço', 'Certeza que deseja Remover Endereço?', endereco.value, true);

      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          //Change status
          const end = new Endereco(result?.item);
          end.indEndStatus = end.indEndStatus === 1 ? 0 : 1;
          //Remove Endereço
          this._individuosService.changeEnderecoStatus(end).subscribe();
          // Remove the Endereço field
          addressFormArray.removeAt(index);
        }
      });
    } else {
      // Remove the Endereço field
      addressFormArray.removeAt(index);
    }

    // Mark for check
    this._changeDetectorRef.markForCheck();
  }

  /**
   * Add an empty phone number field
   */
  addTelefoneField(): void {
    // Create an empty phone number form group
    const phoneNumberFormGroup = this._formBuilder.group({ telefone: [''] });

    // Add the phone number form group to the phoneNumbers form array
    (this.individuoForm.get('telefones') as UntypedFormArray).push(phoneNumberFormGroup);
    // Mark for check
    this._changeDetectorRef.markForCheck();
  }

  /**
   * Remove the phone number field
   *
   * @param index
   */
  removeTelefoneField(index: number): void {
    // Get form array for phone
    const phoneNumbersFormArray = this.individuoForm.get('telefones') as UntypedFormArray;

    const telefone = phoneNumbersFormArray.at(index);

    if (telefone.value?.telefone) {
      const dialogRef = this._dialog.showDialog('Remover Telefone', 'Certeza que deseja Remover Telefone?', telefone.value, true);

      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          //Change status
          const tel = new Telefone(result?.item);
          tel.indTelStatus = tel.indTelStatus === 1 ? 0 : 1;
          //Remove telefone
          this._individuosService.changeTelefoneStatus(tel).subscribe();
          // Remove the phone number field
          phoneNumbersFormArray.removeAt(index);
        }
      });
    } else {
      // Remove the phone number field
      phoneNumbersFormArray.removeAt(index);
    }
    // Mark for check
    this._changeDetectorRef.markForCheck();
  }

  addIdentificadorField() {
    const identificadoresFormGroup = this._formBuilder.group({ identificador: new UntypedFormControl('', Validators.required) });

    (this.individuoForm.get('identificadores') as UntypedFormArray).push(identificadoresFormGroup);
    // Mark for check
    this._changeDetectorRef.markForCheck();
  }

  removeIdentificadorField(index: number): void {

    // Get form array for identificador
    const identificadoresFormGroup = this.individuoForm.get('identificadores') as UntypedFormArray;

    const identificador = identificadoresFormGroup.at(index);

    if (identificador.value?.recId) {
      const dialogRef = this._dialog.showDialog('Remover Identificador', 'Certeza que deseja Remover Identificador?', identificador.value, true);

      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          //Change status
          const ident = new Identificador(result?.item);
          ident.indIdeStatus = ident.indIdeStatus === 1 ? 0 : 1;
          //Remove identificador
          this._individuosService.changeIdentificadorStatus(ident).subscribe();
          // Remove the identificador field
          identificadoresFormGroup.removeAt(index);
        }
      });
    } else {
      // Remove the identificador field
      identificadoresFormGroup.removeAt(index);
    }

    // Mark for check
    this._changeDetectorRef.markForCheck();

  }

  addDocumentoField() {
    const tiposDocumentosFormGroup = this._formBuilder.group({
      tipoDocId: new UntypedFormControl('', Validators.required),
      indDocNumero: new UntypedFormControl('', Validators.required)
    });

    (this.individuoForm.get('documentos') as UntypedFormArray).push(tiposDocumentosFormGroup);

    // Mark for check
    this._changeDetectorRef.markForCheck();
  }

  removeDocumentoField(index: number): void {
    // Get form array for Documento
    const tiposDocumentosFormGroup = this.individuoForm.get('documentos') as UntypedFormArray;

    const documento = tiposDocumentosFormGroup.at(index);
    if (documento.value?.recId) {
      const dialogRef = this._dialog.showDialog('Remover Documento', 'Certeza que deseja Remover Documento?', documento.value, true);
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          //Change status
          const doc = new Documento(result?.item);
          doc.indDocStatus = doc.indDocStatus === 1 ? 0 : 1;
          //Remove documento
          this._individuosService.changeDocumentoStatus(doc).subscribe();
          // Remove the documento field
          tiposDocumentosFormGroup.removeAt(index);
        }
      });
    } else {
      // Remove the documento field
      tiposDocumentosFormGroup.removeAt(index);
    }

    // Mark for check
    this._changeDetectorRef.markForCheck();
  }


  /**
   * Track by function for ngFor loops
   *
   * @param index
   * @param item
   */
  trackByFn(index: number, item: any): any {
    return item.id || index;
  }

  get enderecos(): UntypedFormArray {
    return this.individuoForm.get('enderecos') as UntypedFormArray;
  }

  get documentos(): UntypedFormArray {
    return this.individuoForm.get('documentos') as UntypedFormArray;
  }

  get telefones(): UntypedFormArray {
    return this.individuoForm.get('telefones') as UntypedFormArray;
  }

  get identificadores(): UntypedFormArray {
    return this.individuoForm.get('identificadores') as UntypedFormArray;
  }

  editAddressSubmit(enderecos): any {
    for (let i = 0; i < enderecos.length; i++) {
      if (enderecos.at(i)?.value?.cidade) {
        enderecos.at(i).value.cidade = new Cidade(enderecos.at(i).value.cidade);
      }
      if (enderecos.at(i)?.value?.estado) {
        enderecos.at(i).value.estado = new Estado(enderecos.at(i)?.value?.estado);
      }
      if (enderecos.at(i).value.cep) {
        enderecos.at(i).value.cep = parseInt(enderecos.at(i)?.value?.cep, 10);
      }
      if (enderecos.at(i).value.bairro) {
        enderecos.at(i).value.bairro = enderecos.at(i)?.value?.bairro;
      }
    }
    return enderecos.value;
  }

  updateIndividuo() {
    if (this.individuoForm.valid) {
      this.individuoForm.value.enderecos = this.editAddressSubmit(this.enderecos);

      const individuoEditado = this.createIndividuoEdited(this.individuoForm.value);
      const individuoOriginal = this.createIndividuoEdited(this.individuo);

      if (!_.isEqual(individuoEditado, individuoOriginal)) {
        this.editaIndividuo(individuoEditado);
      }

      if (this.documentos.updateOn === 'change' && !this.documentos.pristine) {
        this.addIndividuoDocs(this.verifyFormUpdated(this.documentos, this.individuo));
      }

      if (this.telefones.updateOn === 'change' && !this.telefones.pristine) {
        this.addIndividuoTelefones(this.verifyFormUpdated(this.telefones, this.individuo));
      }

      if (this.enderecos.updateOn === 'change' && !this.enderecos.pristine) {
        this.addIndividuoEnderecos(this.verifyFormUpdated(this.enderecos, this.individuo));
      }

      if (this.identificadores.updateOn === 'change' && !this.identificadores.pristine) {
        this.addIndividuoIdentificadores(this.verifyFormUpdated(this.identificadores, this.individuo));
      }
    }
  }


  updatePassword() {
    if (this.individuoForm.value.password && this.individuoForm.value.confirmPassword) {
      const userIndiv = new Individuo(this.individuoForm.value);
      this._individuosService
      .updateIndividuoPass(userIndiv)
      .subscribe(()=>{
        this._dialog.showMessageResponse('Senha Alterada com Sucesso!', 200);
      });
    }
  }

  createIndividuoEdited(individuo) {
    const ind = {
      recId: individuo?.recId,
      indNome: individuo?.indNome,
      indEmail: individuo?.indEmail,
      dataNascimento: _moment(individuo?.dataNascimento).format('L'),
      roles: [individuo?.roles?.roleName]
    };
    return ind;
  }

  verifyFormUpdated(formArray: UntypedFormArray, individuo: Individuo) {
    const keys = Object.keys(individuo);
    let obj;
    for (const key of keys) {
      if (formArray?.parent.value?.[key]?.length > individuo?.[key]?.length) {
        formArray?.parent.value?.[key]?.splice(0, individuo?.[key]?.length);
        obj = { recId: individuo?.recId, [key]: formArray.parent?.get([key])?.value };
        break;
      }
    }
    return obj;
  }

  onSubmit() {
    if (this.individuoForm.valid) {
      this.individuoForm.value.dataNascimento = this.events[0];
      this.individuoForm.value.enderecos = this.editAddressSubmit(this.enderecos);

      const indiv = new Individuo(this.individuoForm.value);
      const role =  this.individuoForm.value.roles;
      indiv.roles = [role.roleName];
      this.saving = true;
      delete indiv?.confirmPassword;
      delete indiv?.recId;

      console.log(indiv);
      this._individuosService
        .addIndividuo(indiv)
        .subscribe(
          () => {
            this.saving = false;
            //this.closeDrawer();
            this._router.navigate(['/admin/individuo/lista']);
            this.individuoForm.reset();
            this._dialog.showMessageResponse('Indivíduo Salvo com Sucesso!', 200);
          },
          (error) => {
            this.saving = false;
            //this.closeDrawer();
            this._router.navigate(['/admin/individuo/lista']);
            this.individuoForm.reset();
            this._dialog.showMessageResponse(error.message, error.status);
          });
      this.individuoForm.reset();
    }
  }

  addIndividuoDocs(documentos) {
    this._individuosService.addIndividuoDocumentos(documentos).subscribe(
      () => this._dialog.showMessageResponse(`Documentos de ${this.individuo.indNome}  Atualizado com Sucesso!`, 201));
  }

  addIndividuoTelefones(telefones) {
    this._individuosService.addIndividuoTelefones(telefones).subscribe(
      () => this._dialog.showMessageResponse(`Telefones de ${this.individuo.indNome}  Atualizado com Sucesso!`, 201));
  }

  addIndividuoEnderecos(enderecos) {
    this._individuosService.addIndividuoEnderecos(enderecos)
      .subscribe(() => this._dialog.showMessageResponse(`Endereços de ${this.individuo.indNome}  Atualizado com Sucesso!`, 201));
  }

  addIndividuoIdentificadores(identicadores) {
    this._individuosService.addIndividuoIdentificadores(identicadores)
      .subscribe(() => this._dialog.showMessageResponse(`Identificadores de ${this.individuo.indNome}  Atualizado com Sucesso!`, 201));
  }

  editaIndividuo(individuo) {
    if (individuo) {
      this._individuosService.updateIndividuo(individuo)
        .subscribe(() => this._dialog.showMessageResponse(`${individuo?.indNome}  Atualizado com Sucesso!`, 201));
    }
  }

  removerIndividuo() {
    const dialogRef = this._dialog.showDialog('Remover Indivíduo', 'Certeza que deseja Remover Indivíduo?', this.individuo , true);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const indiv = new Individuo(result?.item);
        indiv.status = indiv?.status === 1 ? 0 : 0;
        this._individuosService.changeIndividuoStatus(indiv).subscribe(
          () => {
            this._router.navigate(['/admin/individuo/lista']);
            //this.closeDrawer();
            this._dialog.showMessageResponse(`${indiv?.indNome} Removido com Sucesso!`, 201);
          });
      }
    });
  }


}
