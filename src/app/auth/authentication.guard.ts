import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { HANDLE_USER_IN_SESSION } from '@app/store/appState.actions';
import { ApplicationState, IUserModel } from '@app/generic/fdx.models';

import { Logger } from '@core';
import { Store } from '@ngrx/store';
import { AuthenticatedUserModelService } from './authenticatedUserModel.service';
import { ROUTE_SIGN_UP } from '@app/generic/fdx.constants';

const log = new Logger('AuthenticationGuard');

@Injectable({
  providedIn: 'root',
})
export class AuthenticationGuard implements CanActivate {
  constructor(
    private router: Router,
    private authenticatedUserModelService: AuthenticatedUserModelService,
    private store: Store<{ appStoreState: ApplicationState }>
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.authenticatedUserModelService.isAuthenticated()) {
      const userModel: IUserModel = this.authenticatedUserModelService.userModel;
      this.store.dispatch({ type: HANDLE_USER_IN_SESSION, payload: userModel });
      return true;
    }

    console.log('Not authenticated, redirecting and adding redirect url...');
    this.router.navigate([ROUTE_SIGN_UP]);
    return false;
  }
}
