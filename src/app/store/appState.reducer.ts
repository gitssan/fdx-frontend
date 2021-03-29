import { ApplicationState, ISignupFlow } from '@app/generic/fdx.models';
import {
  APP_INIT_FLOW,
  APP_RESET,
  HANDLE_USER_IN_SESSION,
  HANDLE_USER_SIGNOUT_ERROR,
  HANDLE_USER_SIGNUP_ERROR,
  HANDLE_USER_SIGNUP_SUCCESS,
  HANDLE_USER_SIGNOUT_SUCCESS,
  WAKE_UP_APP,
} from './appState.actions';

export const initialState = {
  userModel: null,
  viewFeedback: null,
  signupFlow: {
    appLoading: false,
    appInitialized: false,
    cloudConnected: false,
    signupFlowStrategy: null,
  } as ISignupFlow,
} as ApplicationState;

export const appStateReducer = (state: ApplicationState = initialState, action: any) => {
  switch (action.type) {
    case APP_INIT_FLOW:
      return { ...state, signupFlow: { ...state.signupFlow, ...action.payload } };

    case WAKE_UP_APP:
      return { ...state, signupFlow: { ...state.signupFlow, ...action.payload } };

    case HANDLE_USER_SIGNUP_ERROR:
      return { ...state, viewFeedback: { ...state.viewFeedback, ...action.payload } };

    case HANDLE_USER_SIGNOUT_ERROR:
      return { ...state, viewFeedback: { ...state.viewFeedback, ...action.payload, error: true } };

    case HANDLE_USER_SIGNUP_SUCCESS:
      return {
        ...state,
        viewFeedback: { success: true },
        userModel: { ...state.userModel, ...action.payload },
      };

    case HANDLE_USER_SIGNOUT_SUCCESS:
      return initialState;

    case HANDLE_USER_IN_SESSION:
      return { ...state, userModel: { ...state.userModel, ...action.payload } };

    case APP_RESET:
      return initialState;

    default:
      return state;
  }
};
