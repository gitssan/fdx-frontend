import { Injectable } from '@angular/core';
import { IUserModel } from '@app/generic/fdx.models';

const userModelKey = 'userModel';

/**
 * Provides storage for authentication credentials.
 * The Credentials interface should be replaced with proper implementation.
 */
@Injectable({
  providedIn: 'root',
})
export class AuthenticatedUserModelService {
  private _userModel: IUserModel | null = null;

  constructor() {
    const savedCredentials = sessionStorage.getItem(userModelKey) || localStorage.getItem(userModelKey);
    if (savedCredentials) {
      this._userModel = JSON.parse(savedCredentials);
    }
  }

  /**
   * Checks is the user is authenticated.
   * @return True if the user is authenticated.
   */
  isAuthenticated(): boolean {
    return !!this.userModel;
  }

  /**
   * Gets the user credentials.
   * @return The user credentials or null if the user is not authenticated.
   */
  get userModel(): IUserModel | null {
    return this._userModel;
  }

  /**
   * Sets the user credentials.
   * The credentials may be persisted across sessions by setting the `remember` parameter to true.
   * Otherwise, the credentials are only persisted for the current session.
   * @param credentials The user credentials.
   * @param remember True to remember credentials across sessions.
   */
  setCredentials(credentials?: IUserModel) {
    this._userModel = credentials || null;

    if (credentials) {
      const storage = localStorage;
      storage.setItem(userModelKey, JSON.stringify(credentials));
    } else {
      sessionStorage.removeItem(userModelKey);
      localStorage.removeItem(userModelKey);
    }
  }
}
