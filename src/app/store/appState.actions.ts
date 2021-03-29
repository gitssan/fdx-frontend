import { IFdxPayload } from '@app/generic/fdx.models';
import { Action } from '@ngrx/store';

export const WAKE_UP_APP = 'wakeUpApp';
export const APP_INIT_FLOW = 'appInitFlow';
export const APP_RESET = 'appReset';

export const HANDLE_USER_SIGNUP = 'handleUserSignUp';
export const HANDLE_USER_SIGNUP_SUCCESS = 'handleUserSignUpSuccess';
export const HANDLE_USER_SIGNUP_ERROR = 'handleUserSignUpError';
export const HANDLE_USER_IN_SESSION = 'handleUserInSession';
export const HANDLE_USER_SIGN_OUT = 'handleUserSignOut';
export const HANDLE_USER_SIGNOUT_ERROR = 'handleUserSignOutError';
export const HANDLE_USER_SIGNOUT_SUCCESS = 'handleUserSignOutSuccess';

export interface IFdxAction extends Action {
  payload: IFdxPayload;
}
