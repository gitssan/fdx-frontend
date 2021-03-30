import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store, Action } from '@ngrx/store';
import { EMPTY, of } from 'rxjs';
import { map, mergeMap, catchError, concatMap, finalize, delay } from 'rxjs/operators';
import { FdxService } from '../services/fdx.service';
import * as _ from 'lodash';
import {
  IFdxAction,
  HANDLE_USER_SIGNUP,
  HANDLE_USER_SIGNUP_SUCCESS,
  APP_INIT_FLOW,
  HANDLE_USER_SIGN_OUT,
  HANDLE_USER_SIGNUP_ERROR,
  HANDLE_USER_SIGNOUT_ERROR,
  WAKE_UP_APP,
  HANDLE_USER_SIGNOUT_SUCCESS,
} from './appState.actions';
import {
  ApplicationState,
  IFdxResult,
  IFdxServerMessageWrapper,
  IUserModel,
  ISignupFlow,
} from '@app/generic/fdx.models';
import { AuthenticationService } from '@app/auth';
import { Router } from '@angular/router';
import { userModelSelector } from './appstate.selectors';
import { ROUTE_MAIN, ROUTE_SIGN_UP } from '@app/generic/fdx.constants';

@Injectable()
export class AppStateEffects {
  wakeUpApp$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WAKE_UP_APP),
      mergeMap((action: IFdxAction) => {
        return this.fdxService.wakeUpApp().pipe(
          map((result: IFdxResult) => {
            const payload = {
              appLoading: false,
            } as ISignupFlow;
            this.router.navigate([ROUTE_MAIN]);
            return { type: APP_INIT_FLOW, payload };
          })
        );
      })
      // delay(3000) // testing purposes
    )
  );

  handleUserSignUp$ = createEffect(() =>
    this.actions$.pipe(
      ofType(HANDLE_USER_SIGNUP),
      mergeMap((action: IFdxAction) => {
        const userModel: IUserModel = action.payload.userModel;
        return this.fdxService.handleUserSignUp(userModel).pipe(
          concatMap((serverResponse: IFdxResult) => {
            return this.authenticationService.login(serverResponse.userModel).pipe(
              map((obj) => {
                const payload = {
                  userLoggedIn: true,
                } as ISignupFlow;
                this.store.dispatch({ type: APP_INIT_FLOW, payload });
                return serverResponse;
              })
            );
          }),
          map((result: IFdxResult) => {
            const payload: IUserModel = result.userModel as IUserModel;
            this.router.navigate([ROUTE_MAIN]);
            return { type: HANDLE_USER_SIGNUP_SUCCESS, payload };
          }),
          catchError((effectError) => {
            const serverMessageWrapper: IFdxServerMessageWrapper = effectError.error;
            return of({ type: HANDLE_USER_SIGNUP_ERROR, payload: serverMessageWrapper.message });
          })
        );
      })
    )
  );

  handleUserSignOut$ = createEffect(() =>
    this.actions$.pipe(
      ofType(HANDLE_USER_SIGN_OUT),
      mergeMap((action: IFdxAction) => {
        return this.fdxService.handleUserSignOut(this.userModel).pipe(
          concatMap((serverResponse: IFdxResult) => {
            return this.authenticationService.logout().pipe(
              map((obj) => {
                const payload = {
                  userLoggedIn: false,
                } as ISignupFlow;
                this.store.dispatch({ type: APP_INIT_FLOW, payload });
                return serverResponse;
              })
            );
          }),
          map((result: IFdxResult) => {
            const payload: IUserModel = result.userModel as IUserModel;
            this.router.navigate([ROUTE_SIGN_UP]);
            return { type: HANDLE_USER_SIGNOUT_SUCCESS, payload };
          }),
          catchError((effectError) => {
            return of({ type: HANDLE_USER_SIGNOUT_ERROR, payload: { success: false } });
          })
        );
      })
    )
  );

  private userModel: IUserModel;

  constructor(
    private actions$: Actions,
    private fdxService: FdxService,
    private router: Router,
    private authenticationService: AuthenticationService,
    private store: Store<{ appStoreState: ApplicationState }>
  ) {
    this.store.select(userModelSelector).subscribe((state: IUserModel) => {
      this.userModel = state;
    });
  }
}
