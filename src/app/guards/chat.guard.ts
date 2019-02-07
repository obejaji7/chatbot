import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { Observable } from 'rxjs';
import { User } from '../interfaces/User';

@Injectable()
export class ChatGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const user: User = JSON.parse(localStorage.getItem('user'));
    if (user.Id && user.Username) {
      return true;
    }
    this.router.navigate(['login']);
    return false;
  }
}
