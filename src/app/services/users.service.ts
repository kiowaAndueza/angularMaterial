import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API } from 'src/environments/api-route';
import { UserModel } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private readonly BASE: string = API.base
  constructor(private http: HttpClient) { }

  create(user: UserModel): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.post<any>(this.BASE, user)
        .subscribe({
          next: (user) => resolve(user),
          error: (error) => reject(error)
        })
    })
  }

  update(user: UserModel): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.put<any>(`${this.BASE}/${user.id}`, user)
        .subscribe({
          next: (user) => resolve(user),
          error: (error) => reject(error)
        })
    })
  }

  getUser(userId: number): Promise<UserModel> {
    return new Promise((resolve, reject) => {
      this.http.get<any>(`${this.BASE}/${userId}`)
        .subscribe({
          next: (user) => resolve(user),
          error: (error) => reject(error)
        })
    })
  }

  getUsers(): Promise<UserModel[]> {
    return new Promise((resolve, reject) => {
      this.http.get<any>(`${this.BASE}`)
        .subscribe({
          next: (users) => resolve(users),
          error: (error) => reject(error)
        })
    })
  }

  
  delete(id: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.delete<any>(`${this.BASE}/${id}`)
        .subscribe({
          next: () => resolve(undefined),
          error: (error) => reject(error)
        })
    })
  }
}
