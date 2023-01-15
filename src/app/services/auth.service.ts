import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { switchMap, tap } from 'rxjs/operators';

import { environment } from './../../environments/environment';
import { Auth } from './../models/auth.model';
import { User } from './../models/user.model';
import { TokenService } from "../services/token.service";


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = "https://young-sands-07814.herokuapp.com/api";

  constructor(
    private http: HttpClient,
    private tokenService: TokenService
  ) { }

  login(email: string, password: string){
    return this.http.post<Auth>(this.apiUrl + "/auth/login", {email, password})
    .pipe(
      tap(response =>
        this.tokenService.saveToken(response.access_token) // el metodo saveToken no es asincrono
      )
    );
  }

  profile(token: string){
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + token);
    headers = headers.set('Content-type', 'application/json');

    // Se puede enviar de las dos formas. Esta sirve si queremos aplicar algun condicional
    return this.http.get<User>(this.apiUrl + "/auth/profile", {
      headers
    })

    // return this.http.get<User>(this.apiUrl + "/auth/profile", {
    //   headers: {
    //     Authorization: 'Bearer ' + token,
    //     'Content-type': 'application/json'
    //   }
    // })
  }




  //Copiado

  getProfile() {
    // const headers = new HttpHeaders();
    // headers.set('Authorization',  `Bearer ${token}`);
    return this.http.get<User>(this.apiUrl + "/auth/profile", {
      // headers: {
      //   Authorization: `Bearer ${token}`,
      //   // 'Content-type': 'application/json'
      // }
    });
  }

  loginAndGet(email: string, password: string) {
    return this.login(email, password)
    .pipe(
      // switchMap(rta => this.getProfile(rta.access_token))
      switchMap(() => this.getProfile())
    )
  }
}
