import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ApplicationState } from '../generic/fdx.models';
import * as _ from 'lodash';

const getAppStoreState = createFeatureSelector<ApplicationState>('appStoreState');

export const signupFlowSelector = createSelector(getAppStoreState, (state: ApplicationState) => {
  return state.signupFlow;
});

export const viewFeedbackSelector = createSelector(getAppStoreState, (state: ApplicationState) => {
  return state ? state.viewFeedback : null;
});

export const userModelSelector = createSelector(getAppStoreState, (state: ApplicationState) => {
  return state.userModel;
});
