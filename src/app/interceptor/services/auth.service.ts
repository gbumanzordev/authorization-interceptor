import { Injectable } from '@angular/core';
import { AuthRequestsService } from './auth-requests.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private authRequestService: AuthRequestsService) {}

  refreshAuthStatus() {
    const token = localStorage.getItem('refreshToken');
    return this.authRequestService
      .getUpdatedTokens(token)
      .pipe(map((response) => response.data));
  }
}
