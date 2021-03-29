import { Component, OnInit } from '@angular/core';

import { ApplicationState } from '@app/generic/fdx.models';
import { Store } from '@ngrx/store';
import { HANDLE_USER_SIGN_OUT } from '@app/store/appState.actions';
import { AuthenticatedUserModelService } from '@app/auth/authenticatedUserModel.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  menuHidden = true;
  loggingOut = false;

  constructor(
    private store: Store<{ appStoreState: ApplicationState }>,
    private credentialsService: AuthenticatedUserModelService
  ) {}

  ngOnInit() {}

  toggleMenu() {
    this.menuHidden = !this.menuHidden;
  }

  logout() {
    this.loggingOut = true;
    this.store.dispatch({ type: HANDLE_USER_SIGN_OUT });
  }

  get emailAddress(): string | null {
    const userModel = this.credentialsService.userModel;
    return userModel ? userModel.emailAddress : null;
  }
}
