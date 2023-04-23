import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RoutesModel } from 'app/models/route.model';
import { HandleError } from 'app/utils/handleErrors';
import { environment } from 'environments/environment';
import { tap, take, map, filter } from 'rxjs/operators';
import { BehaviorSubject, Observable, throwError, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ContractsService {

  private _contract: BehaviorSubject<any | null> = new BehaviorSubject(null);
  private _contracts: BehaviorSubject<any[] | null> = new BehaviorSubject(null);

  constructor(private _httpClient: HttpClient, private error: HandleError) { }



   get contract$(): Observable<any> {
    return this._contract.asObservable();
  }


  get contracts$(): Observable<any[]> {
    return this._contracts.asObservable();
  }


  getAllContracts(page = 0, size=10): Observable<any[]>{
    return this._httpClient.get<any[]>(environment.apiManager+'clientes/find', {
      params:{page, size}
    }).
    pipe(
    tap((result) => {
          this._contracts.next(result['content']);
      }),
      catchError(this.error.handleError<any[]>('getAllContracts'))
    );
  }

  searchContracts(id): Observable<any[]>
    {
        return this._httpClient.get<any[]>(environment.apiManager+ 'clientes/find', {
            params: id
        }).pipe(
            tap((contracts) => {
                this._contracts.next(contracts);
            })
        );
    }

  getContractById(id): Observable<any>
    {
        return this._httpClient.get<any>(environment.apiManager + 'clientes/find',
         { params:{id} })
        .pipe(
            tap((contract) => {
                this._contract.next(contract['content'][0]);
              }),
            catchError(this.error.handleError<any>('getContractById'))
        );
    }

  addContract(contract): Observable<any>{
    return this._httpClient.post(environment.apiManager+'clientes/add-cliente', contract)
    .pipe(
      tap((newContract) => {

        // Update the contract if it's selected
        this._contract.next(newContract);

        // Return the new contract
        return newContract;
      }),
      catchError(this.error.handleError<any>('addContract'))
    );
  }

  deactivateActiveCliente(cliente){
    return this._httpClient.patch(environment.apiManager + 'clientes/ativa-desativa', cliente)
    .pipe(
      tap((result) =>{
        console.log(result);
      }),
      catchError(this.error.handleError<any>('deactivateActiveCliente'))
    );
  }

  deactivateActiveContrato(contrato){
    return this._httpClient.patch(environment.apiManager + 'contratos/ativa-desativa', contrato)
    .pipe(
      tap((result) =>{
        console.log(result);
      }),
      catchError(this.error.handleError<any>('deactivateActiveContrato'))
    );
  }

  vinculaContratoProduto(contratoProduto){
    return this._httpClient.post(environment.apiManager +'contratos/vincula-contrato-produto', contratoProduto)
    .pipe(
      catchError(this.error.handleError<any>('vinculaContratoProduto'))
    );
  }

  editClienteContrato(clienteContrato): Observable<any> {
    return this.contracts$.pipe(
      take(1),
      switchMap(clientes => this._httpClient.patch<any>(environment.apiManager + 'clientes/edit', clienteContrato)
        .pipe(
          map((updatedCliente) => {

            // Find the index of the updated Cliente
            const index = clientes.findIndex(item => item.recId === clienteContrato.recId);

            // Update the Cliente
            clientes[index] = updatedCliente;

            // Update the Cliente
            this._contracts.next(clientes);

            // Return the updated Cliente
            return updatedCliente;
          }),
          switchMap(updatedCliente => this.contract$.pipe(
            take(1),
            filter(item => item && item.recId === clienteContrato.recId),
            tap(() => {
              // Update the Cliente if it's selected
              this._contract.next(updatedCliente);

              // Return the Cliente
              return updatedCliente;
            })
          )),
          catchError(this.error.handleError<any>('editClienteContrato'))
        ))
    );
  }

}
