import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthRequestsService {

  constructor(private httpClient: HttpClient) { }

  getUpdatedTokens(token: string) {
    return this.httpClient.post('la-url-del-refresh-token', { token });
  }
}
