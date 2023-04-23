import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HandleError } from 'app/utils/handleErrors';
import { environment } from 'environments/environment';
import { tap, take, map, filter } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CustomersService {

  private _cliente: BehaviorSubject<any | null> = new BehaviorSubject(null);
  private _clientes: BehaviorSubject<any[] | null> = new BehaviorSubject(null);

  constructor(private _httpClient: HttpClient, private error: HandleError) { }



   get cliente$(): Observable<any> {
    return this._cliente.asObservable();
  }


  get clientes$(): Observable<any[]> {
    return this._clientes.asObservable();
  }


  getAllClientes(page = 0, size=10): Observable<any[]>{
    return this._httpClient.get<any[]>(environment.apiManager+'clientes/find', {
      params:{page, size}
    }).
    pipe(
    tap((result) => {
          let clientes = result['content'];
          clientes = clientes.sort((a, b) => a.nome.localeCompare(b.nome));
          this._clientes.next(clientes);
      }),
      catchError(this.error.handleError<any[]>('getAllClientes'))
    );
  }

  searchCliente(id): Observable<any[]>
    {
        return this._httpClient.get<any[]>(environment.apiManager+ 'clientes/find', {
            params: id
        }).pipe(
            tap((contracts) => {
                this._clientes.next(contracts);
            })
        );
    }

  getClienteById(id): Observable<any>
    {
        return this._httpClient.get<any>(environment.apiManager + 'clientes/find',
         { params:{id} })
        .pipe(
            tap((contract) => {
                this._cliente.next(contract['content'][0]);
              }),
            catchError(this.error.handleError<any>('getClienteById'))
        );
    }

  addCliente(contract): Observable<any>{
    return this._httpClient.post(environment.apiManager+'clientes/add-cliente', contract)
    .pipe(
      tap((newContract) => {

        // Update the contract if it's selected
        this._cliente.next(newContract);

        // Return the new contract
        return newContract;
      }),
      catchError(this.error.handleError<any>('addCliente'))
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
    return this.clientes$.pipe(
      take(1),
      switchMap(clientes => this._httpClient.patch<any>(environment.apiManager + 'clientes/edit', clienteContrato)
        .pipe(
          map((updatedCliente) => {

            // Find the index of the updated Cliente
            const index = clientes.findIndex(item => item.recId === clienteContrato.recId);

            // Update the Cliente
            clientes[index] = updatedCliente;

            // Update the Cliente
            this._clientes.next(clientes);

            // Return the updated Cliente
            return updatedCliente;
          }),
          switchMap(updatedCliente => this.cliente$.pipe(
            take(1),
            filter(item => item && item.recId === clienteContrato.recId),
            tap(() => {
              // Update the Cliente if it's selected
              this._cliente.next(updatedCliente);

              // Return the Cliente
              return updatedCliente;
            })
          )),
          catchError(this.error.handleError<any>('editClienteContrato'))
        ))
    );
  }

}
