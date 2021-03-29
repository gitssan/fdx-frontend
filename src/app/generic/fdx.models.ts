export interface IUserModel {
  _id: string;
  firstName: string;
  lastName: string;
  emailAddress: string;
  password: string;
  createdAt: Date;
  modifiedAt: Date;
}

export interface ISignupFlow {
  userLoggedIn: boolean;
  appLoading: boolean;
  cloudConnected: boolean;
  signupFlowStrategy: signupFlowStrategyEnum;
  appInitialized: boolean;
}

export enum signupFlowStrategyEnum {
  PLAIN = 'plain',
  CLOUD = 'cloud', // e.g. MICROSOFT_CLOUD = 'microsoftCloud', GOOGLE_CLOUD = 'googleCloud',
}

export interface IFdxPayload {
  userModel: IUserModel;
}

export interface IFdxResult {
  payload: {};
  message: string;
  success: boolean;
  userModel: IUserModel;
  httpStatus: number;
}

export interface Credentials {
  username: string;
  token: string;
}

export interface ApplicationState {
  userModel: IUserModel;
  signupFlow: ISignupFlow;
  viewFeedback: {};
}

export interface IFdxServerMessageWrapper {
  message: IFdxServerMessage;
}

export interface IFdxServerMessage {
  feedback: string;
  log: string[];
}

export interface IControlState {
  key: string;
  initModifiedBlurred: boolean;
  focused: boolean;
  blurred: boolean;
}
