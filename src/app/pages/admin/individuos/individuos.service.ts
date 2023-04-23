import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, pipe } from 'rxjs';
import { Individuo } from '../../../models/individuo';
import { environment } from 'environments/environment';
import { catchError, map, first, tap, delay, switchMap, take, filter } from 'rxjs/operators';
import { Cidade } from 'app/models/cidade';
import { Estado } from 'app/models/estado';
import { Documento } from 'app/models/documento';
import { Sexo } from 'app/models/sexo';
import { Genero } from 'app/models/genero';
import { Escolaridade } from 'app/models/escolaridade';
import { Raca } from 'app/models/raca';
import { HandleError } from 'app/utils/handleErrors';
import { Telefone } from 'app/models/telefone';
import { Identificador } from 'app/models/identificador';
import { Endereco } from 'app/models/endereco';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSnackBarComponent } from 'app/shared/mat-snack-bar/mat-snack-bar.component';

@Injectable({
  providedIn: 'root'
})
export class IndividuosService {

  private _individuo: BehaviorSubject<Individuo | null> = new BehaviorSubject(null);
  private _individuos: BehaviorSubject<Individuo[] | null> = new BehaviorSubject(null);

  constructor(private _httpClient: HttpClient, private error: HandleError, public _snackBar: MatSnackBar,
    private snackBar: MatSnackBarComponent) { }


  /**
   *Getter for Indivíduo
   */
  get individuo$(): Observable<Individuo> {
    return this._individuo.asObservable();
  }

  /**
   *Getter for Indivíduos
   */
  get individuos$(): Observable<Individuo[]> {
    return this._individuos.asObservable();
  }

  /**
   *
   * @param page
   * @param size
   * @return a list of Indivíduos
   */
  getIndividuos(page = 0, size = 10): Observable<Individuo[]> {
    return this._httpClient.get<Individuo[]>(environment.apiCad + 'busca-todos-beneficiarios', {params: {page, size}})
      .pipe(
        delay(500),
        tap((result) => {
          let individuos = result['content'];
          individuos = individuos.sort((a, b) => a.indNome.localeCompare(b.indNome));
          this._individuos.next(individuos);
        }),
        catchError(this.error.handleError<Individuo[]>('getListIndividuos'))
      );
  }

  /**
   *
   * @param id
   * @return a indivíduo
   */
  getIndividuoById(id) {
    return this._httpClient
      .get<Individuo>(environment.apiCad + 'busca-beneficiario-por-id', {params:{id}})
      .pipe(
        first(),
        tap((individuo) => {
          this._individuo.next(individuo);
        }),
        catchError(this.error.handleError<Individuo>('getIndividuoById'))
      );
  }


  searchIndividuos(query: string) {
    return this.individuos$.pipe( );
  }

  /**
   *
   * @returns a list of Cidades
   */
  getCidadas(tipoLista='CIDADES') {
    return this._httpClient.get<Cidade[]>(environment.apiList + 'lista', {params:{tipoLista}})
      .pipe(
        first(),
        map(result => result['content']),
        catchError(this.error.handleError<Individuo[]>('getCidadas'))
      );
  }

  /**
   *
   * @param estId
   * @param cidade
   * @return a list of cidades base on estado id
   */
  getCidadeByEstadoId(estadoId, cidade, page=0, size=10) {
    return this._httpClient.get<Cidade[]>
      (environment.apiList +  'cidade-por-estado-with-auto-complete', {params: { estadoId, cidade, page, size}})
      .pipe(
        map(result => result['content']),
        catchError(this.error.handleError<Cidade[]>('getCidadeByEstadoId'))
      );
  }

  /**
   *
   * @return a list of estados
   */
  getEstados(tipoLista='ESTADOS', page=0, size=27) {
    return this._httpClient.get<Estado[]>(environment.apiList + 'lista', {params: {tipoLista, page, size}})
      .pipe(
        first(),
        map(result => result['content']),
        catchError(this.error.handleError<Individuo[]>('getEstados'))
      );
  }

  /**
   *
   * @return a list of Documentos
   */
  getListaDocumentos(tipoLista='DOCUMENTOS') {
    return this._httpClient.get<Documento[]>(environment.apiList + 'lista', {params: {tipoLista}})
      .pipe(
        first(),
        map(result => result['content']),
        catchError(this.error.handleError<Individuo[]>('getListaDocumentos'))
      );
  }

  /**
   *
   * @return a list of Sexos
   */
  getListaSexos(tipoLista='SEXOS') {
    return this._httpClient.get<Sexo[]>(environment.apiList + 'lista', {params: {tipoLista}})
      .pipe(
        first(),
        map(result => result['content']),
        catchError(this.error.handleError<Individuo[]>('getListaSexos'))
      );
  }

  /**
   *
   * @return a list of Genêros
   */
  getListaGeneros(tipoLista='GENEROS') {
    return this._httpClient.get<Genero[]>(environment.apiList + 'lista', {params: {tipoLista}})
      .pipe(
        first(),
        map(result => result['content']),
        catchError(this.error.handleError<Individuo[]>('getListaGeneros'))
      );
  }

  /**
   *
   * @return a list of Escolaridades
   */
  getListaEscolaridades(tipoLista='ESCOLARIDADES') {
    return this._httpClient.get<Escolaridade[]>(environment.apiList + 'lista', {params: {tipoLista}})
      .pipe(
        first(),
        map(result => result['content']),
        catchError(this.error.handleError<Individuo[]>('getListaEscolaridades'))
      );

  }


  associateIndividuoCliente(individuoCliente){
    return this._httpClient.post(environment.apiManager + 'individuo-cliente/associa-individuo-cliente', individuoCliente)
    .pipe(
      tap((result) => {
          console.log(result);
          this.snackBar.openSnackBar('Indivíduo Associado ao Cliente com Sucesso!', 'X', 'green-snackbar');
      }),
      catchError(this.error.handleError<any>('associateIndividuoCustomer'))
    );
  }


  /**
   *
   * @return a list of Raças
   */
  getListaRacas(tipoLista='RACAS') {
    return this._httpClient.get<Raca[]>(environment.apiList + 'lista', {params:{tipoLista}})
      .pipe(
        first(),
        map(result => result['content']),
        catchError(this.error.handleError<Individuo[]>('getListaRacas'))
      );
  }

  /**
   *
   * @param individuo
   * @returns
   */
  addIndividuo(individuo: Individuo): Observable<any> {
    if (individuo !== null) {
      return this._httpClient.post(environment.apiCad + 'cadastra-novo-beneficiario', individuo)
        .pipe(
          catchError(this.error.handleError<Individuo>('addIndividuo'))
        );
    }
  }

  addIndividuoRole(role){
    return this._httpClient.put<any>(environment.apiCad + 'add-roles-individuo', role)
    .pipe(
      tap((roleIndividuo) => {
          console.log(roleIndividuo);
          return roleIndividuo;
        }),
      catchError(this.error.handleError<any>('addIndividuoRole'))
    );
  }

  /**
   *
   * @param documentos
   * @returns
   */
  addIndividuoDocumentos(documentos) {
    return this._httpClient.post<Individuo>(environment.apiCad + 'add-documento-beneficiario', documentos)
      .pipe(
        tap((docs) => {

          // Update the indivíduo if it's selected
          this._individuo.next(docs);

          // Return the updated indivíduo
          return docs;
        }),
        catchError(this.error.handleError<Individuo>('addIndividuoDocumentos'))
      );

  }

  /**
   *
   * @param telefones
   * @returns
   */
  addIndividuoTelefones(telefones) {
    return this._httpClient.post<Individuo>(environment.apiCad + 'add-telefone-beneficiario', telefones)
      .pipe(
        tap((phone) => {

          // Update the indivíduo if it's selected
          this._individuo.next(phone);

          // Return the updated indivíduo
          return phone;
        }),
        catchError(this.error.handleError<Individuo>('addIndividuoTelefones'))
      );
  }

  /**
   *
   * @param enderecos
   * @returns
   */
  addIndividuoEnderecos(enderecos) {
    return this._httpClient.post<Individuo>(environment.apiCad + 'add-endereco-beneficiario', enderecos)
      .pipe(
        tap((address) => {

          // Update the indivíduo if it's selected
          this._individuo.next(address);

          // Return the updated indivíduo
          return address;
        }),
        catchError(this.error.handleError<Individuo>('addIndividuoEnderecos'))
      );
  }


  /**
   *
   * @param identicadores
   * @returns
   */
  addIndividuoIdentificadores(identicadores) {
    return this._httpClient.post<Individuo>(environment.apiCad + 'add-identificador-beneficiario', identicadores)
      .pipe(
        tap((idtf) => {

          // Update the indivíduo if it's selected
          this._individuo.next(idtf);

          // Return the updated indivíduo
          return idtf;
        }),
        catchError(this.error.handleError<Individuo>('addIndividuoIdentificadores'))
      );
  }


  updateIndividuoPass(individuo){
    return this._httpClient.put<any>(environment.apiCad + 'troca-senha-individuo', individuo)
    .pipe(
      tap((result) =>{
        console.log(result);
      }),
      catchError(this.error.handleError<any>('updateIndividuoPass'))
    );
  }

  /**
   *
   * @param individuo
   * @returns
   */
  updateIndividuo(individuo: any) {
    return this.individuos$.pipe(
      take(1),
      switchMap(individuos => this._httpClient.patch<any>(environment.apiCad + 'edita-beneficiario', individuo)
        .pipe(
          map((updatedIndividuo) => {

            // Find the index of the updated indivíduo
            const index = individuos.findIndex(item => item.recId === individuo.recId);

            // Update the indivíduo
            individuos[index] = updatedIndividuo?.user;

            // Update the indivíduos
            this._individuos.next(individuos);

            // Return the updated indivíduo
            return updatedIndividuo?.user;
          }),
          switchMap(updatedIndividuo => this.individuo$.pipe(
            take(1),
            filter(item => item && item.recId === individuo.recId),
            tap(() => {
              // Update the indivíduo if it's selected
              this._individuo.next(updatedIndividuo?.user);

              // Return the indivíduo
              return updatedIndividuo?.user;
            })
          )),
          catchError(this.error.handleError<Individuo>('updateIndividuo'))
        ))
    );

  }


  /**
   *
   * @param status
   * @returns
   */
  changeIndividuoStatus(individuo: Individuo) {
    return this._httpClient.put<Individuo>(environment.apiCad + 'ativa-desativa-beneficiario', individuo)
      .pipe(
        tap((indStatus) => {

          // Update the indivíduo if it's selected
          this._individuo.next(indStatus);

          // Return the updated indivíduo
          return indStatus;
        }),
        catchError(this.error.handleError<Individuo>('changeIndividuoStatus'))
      );
  }

  /**
   *
   * @param endereco
   * @returns
   */
  changeEnderecoStatus(endereco: Endereco) {
    return this._httpClient.put(environment.apiCad + 'ativa-desativa-endereco-beneficiario', [endereco])
      .pipe(
        tap(() => {
          this._snackBar.open('Endereco do Individuo Atualizado com Sucesso!', '', { duration: 4000 });
        }),
        catchError(this.error.handleError<Individuo>('changeEnderecoStatus'))
      );
  }

  /**
   *
   * @param identificador
   * @returns
   */
  changeIdentificadorStatus(identificador: Identificador) {
    return this._httpClient.put(environment.apiCad + 'ativa-desativa-identificador-beneficiario', [identificador])
      .pipe(
        tap(() => {
          this._snackBar.open('Identificador do Individuo Atualizado com Sucesso!', '', { duration: 4000 });
        }),
        catchError(this.error.handleError<Individuo>('changeIdentificadorStatus'))
      );
  }

  /**
   *
   * @param telefone
   * @returns
   */
  changeTelefoneStatus(telefone: Telefone) {
    return this._httpClient.put(environment.apiCad + 'ativa-desativa-telefone-beneficiario', [telefone])
      .pipe(
        tap(() => {
          this._snackBar.open('Telefone do Atualizado com Sucesso!', '', { duration: 4000 });
        }),
        catchError(this.error.handleError<Individuo>('changeTelefoneStatus'))
      );
  }

  /**
   *
   * @param documento
   * @returns
   */
  changeDocumentoStatus(documento: Documento) {
    return this._httpClient.put(environment.apiCad + 'ativa-desativa-documento-beneficiario', [documento])
      .pipe(
        tap(() => {
          this._snackBar.open('Documento do Individuo Atualizado com Sucesso!', '', { duration: 4000 });
        }),
        catchError(this.error.handleError<Individuo>('changeDocumentoStatus'))
      );
  }

  buscaIndividuoCliente(individuoId='', clienteId=''){
    return this._httpClient.get(environment.apiManager + 'individuo-cliente/busca-associacoes', {params:
    {clienteId:clienteId, individuoId: individuoId}}).pipe(
      tap((result)=>{
        console.log(result);
      }),
      catchError(this.error.handleError<Individuo>('buscaIndividuoCliente'))
    );
  }
}
