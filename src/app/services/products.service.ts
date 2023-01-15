import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { retry, retryWhen, catchError, map } from "rxjs/operators";
import { environment } from "../../environments/environment"
import { throwError, zip } from "rxjs";
import { checkTime } from "../interceptors/time.interceptor";

import { CreateProductDTO, Product, UpdateProductDTO } from './../models/product.model';
import { pipe } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  // private apiURL = `${environment.API_URL}/api/products`;
  // private apiURL = "/api/products"; // Proxy en proxy.config.json
  // private apiURL = "https://young-sands-07814.herokupppapp.com/api/products";
  private apiURL = "https://young-sands-07814.herokuapp.com/api/products";

  constructor(
    private http: HttpClient
  ) { }

  getAllProducts(limit?: number, offset?: number) {
    let params = new HttpParams();
    if (limit !== undefined && offset !== undefined) {
      params = params.set('limit', limit);
      params = params.set('offset', limit);
    }
    return this.http.get<Product[]>(this.apiURL, {
      params,
      context: checkTime()
    }).pipe(
      retry(3), // Para reintentar la petición
      map(products => products.map(item => {
        return {
          ...item,
          taxes: .19 * item.price
        }
      }))
    );
  }

  fetchReadAndUpdate(id: string, dto: UpdateProductDTO) {
    return zip(
      this.getProduct(id),
      this.update(id, dto),
    )
  }

  getProduct(id: string) {
    return this.http.get<Product>(this.apiURL + "/" + id)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === HttpStatusCode.InternalServerError) {
            return throwError('Algo está fallando en el backend');
          } else if (error.status === HttpStatusCode.NotFound) {
            return throwError('El producto no existe');
          } else if (error.status === HttpStatusCode.Unauthorized) {
            return throwError('No estás autorizado');
          }
          return throwError('Ups! Algo salió mal :C');
        })
      )
  }

  getProductsByPage(limit: number, offset: number) {
    return this.http.get<Product[]>(this.apiURL, {
      params: { limit, offset }
    })
  }

  create(dto: CreateProductDTO) {
    return this.http.post<Product>(this.apiURL, dto);
  }

  // Este método funciona como un patch, pero estamos usando el verbo put
  update(id: string, dto: UpdateProductDTO) {
    //return this.http.patch<Product>(this.apiURL + "/" + id, dto);
    return this.http.put<Product>(this.apiURL + "/" + id, dto);
  }

  delete(id: string) {
    return this.http.delete<boolean>(this.apiURL + "/" + id);
  }
}
