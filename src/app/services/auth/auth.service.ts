import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from 'src/app/interfaces/User';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable()
export class AuthService {

  constructor(private httpClient: HttpClient) { }

  createUser (user: User): Observable<User> {
    return this.httpClient.post<User>(`${environment.apiUrl}/users`, user);
  }

  deleteUser (id: string) {
    this.httpClient.delete(`${environment.apiUrl}/users/${id}`);
  }

  getUsers(): Observable<User[]> {
    return this.httpClient.get<User[]>(`${environment.apiUrl}/users`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }
}
