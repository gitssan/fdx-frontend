import { Injectable } from '@angular/core';
import { IUserModel } from '@app/generic/fdx.models';
import { Observable, of } from 'rxjs';

import { AuthenticatedUserModelService } from './authenticatedUserModel.service';

/**
 * Provides a base for authentication workflow.
 * The login/logout methods should be replaced with proper implementation.
 */
@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  constructor(private credentialsService: AuthenticatedUserModelService) {}

  /**
   * Authenticates the user.
   * @param context The login parameters.
   * @return The user credentials.
   */
  login(userModel: IUserModel): Observable<IUserModel> {
    this.credentialsService.setCredentials(userModel);
    return of(userModel);
  }

  /**
   * Logs out the user and clear credentials.
   * @return True if the user was logged out successfully.
   */
  logout(): Observable<boolean> {
    // Customize credentials invalidation here
    this.credentialsService.setCredentials();
    return of(true);
  }
}
