import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

import { User, CreateUserDTO } from "../models/user.model";

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private apiUrl = "https://young-sands-07814.herokuapp.com/api";

  constructor(
    private http: HttpClient
  ) { }

  create(dto: CreateUserDTO){
    return this.http.post<User>(this.apiUrl + "/users", dto);
  }

  getAll(){
    return this.http.get<User[]>(this.apiUrl);
  }
}
