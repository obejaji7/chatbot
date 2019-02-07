import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from 'src/app/interfaces/User';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class AuthService {
  constructor(private httpClient: HttpClient) {}

  createUser(user: User): Observable<User> {
    return this.httpClient
      .post<User>(`${environment.apiUrl}/users`, user)
      .pipe(
        map(data => ({
          Id: data.Id || data['id'],
          Username: data.Username || data['username']
        }))
      );
  }

  deleteUser(id: string) {
    this.httpClient.delete(`${environment.apiUrl}/users/${id}`);
  }

  getUsers(): Observable<User[]> {
    return this.httpClient
      .get<User[]>(`${environment.apiUrl}/users`, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      })
      .pipe(
        map(users =>
          users.map(user => ({ Id: user.Id ||  user['id'], Username: user.Username ||  user['username'] }))
        )
      );
  }
}
