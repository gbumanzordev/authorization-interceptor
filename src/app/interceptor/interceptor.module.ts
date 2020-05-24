import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TestComponent } from './components/test/test.component';
import { JwtHelperService, JwtModule } from '@auth0/angular-jwt';
import { AuthorizationInterceptor } from './interceptors/authorization.interceptor';
import { AuthRequestsService } from './services/auth-requests.service';
import { AuthService } from './services/auth.service';

@NgModule({
  declarations: [TestComponent],
  imports: [
    CommonModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: () => localStorage.getItem('token'),
        whitelistedDomains: [],
      },
    })
  ],
  providers: [
    JwtHelperService,
    AuthService,
    AuthRequestsService
  ]
})
export class InterceptorModule { }
