import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HandleError } from 'app/utils/handleErrors';
import { environment } from 'environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, switchMap, tap, take, map, filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private _products: BehaviorSubject<any[] | null> = new BehaviorSubject(null);
  private _product: BehaviorSubject<any | null> = new BehaviorSubject(null);

  constructor(private _httpClient: HttpClient, private error: HandleError, public _snackBar: MatSnackBar) { }


  get products$(): Observable<any[]> {
    return this._products.asObservable();
  }

  get product$(): Observable<any> {
    return this._product.asObservable();
  }


  getAllProducts(page = 0, size = 10) {
    return this._httpClient.get<any[]>(environment.apiManager + 'produtos/busca-produto', {params:{
      page, size
    }})
      .pipe(
        tap((result) => {
          let produtos = result['content'];
          produtos = produtos.sort((a, b) => a?.prodDescricao.localeCompare(b?.prodDescricao));
          this._products.next(produtos);
        }),
        catchError(this.error.handleError<any[]>('getAllProducts'))
      );
  }


  getProductById(id): Observable<any> {
      return this._httpClient.get<any>(environment.apiManager + 'produtos/busca-produto', {params: {id}})
      .pipe(
        tap((result) => {
          this._product.next(result);
        }),
        catchError(this.error.handleError<any>('getProductById'))
      );
  }

  editProduct(product): Observable<any> {
    return this.products$.pipe(
      take(1),
      switchMap(products => this._httpClient.patch<any>(environment.apiManager + 'edit-product', product)
        .pipe(
          map((updatedProduct) => {

            // Find the index of the updated product
            const index = products.findIndex(item => item.recId === product.recId);

            // Update the product
            products[index] = updatedProduct;

            // Update the products
            this._products.next(products);

            // Return the updated product
            return updatedProduct;
          }),
          switchMap(updatedProduct => this.product$.pipe(
            take(1),
            filter(item => item && item.recId === product.recId),
            tap(() => {
              // Update the product if it's selected
              this._product.next(updatedProduct);

              // Return the product
              return updatedProduct;
            })
          )),
          catchError(this.error.handleError<any>('editProduct'))
        ))
    );
  }

  deactivateActiveProduct(product: any): Observable<any>{
    return this._httpClient.patch(environment.apiManager + 'produtos/ativa-desativa', product)
    .pipe(
      catchError(this.error.handleError<any>('deactivateActiveProduct'))
    );
  }

  searchProductByContract(contratoId): Observable<any[]>{
      return this._httpClient.get<any[]>(environment.apiManager + 'produtos/busca-produtos-por-contrato', {params: contratoId})
      .pipe(
        tap((products) => {
          this._products.next(products);
        }),
        catchError(this.error.handleError<any>('searchProductByContract'))
      );
  }

  addProduct(product): Observable<any> {
    return this._httpClient.post(environment.apiManager + 'produtos/add-produto', product)
      .pipe(
        tap(result => this._product.next(result)),
        catchError(this.error.handleError<any>('addProduct'))
      );
  }

}
