import { Component, OnDestroy, OnInit } from '@angular/core';
import { ApplicationState, IUserModel } from '@app/generic/fdx.models';
import {
  HANDLE_USER_SIGNOUT_ERROR,
  HANDLE_USER_SIGNUP_ERROR,
  HANDLE_USER_SIGNUP_SUCCESS,
  IFdxAction,
} from '@app/store/appState.actions';
import { userModelSelector, viewFeedbackSelector } from '@app/store/appstate.selectors';
import { ActionsSubject, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit, OnDestroy {
  public userModelObs$: Observable<IUserModel>;
  public userModel: IUserModel;
  public viewFeedbackError: boolean;
  public success: boolean;
  viewFeedback$: Observable<any>;

  private userModelSubscription: Subscription;

  constructor(private store: Store<{ appStoreState: ApplicationState }>, private actionsSubject: ActionsSubject) {
    this.viewFeedback$ = this.store.select(viewFeedbackSelector);

    this.actionsSubject.subscribe((action: IFdxAction) => {});

    this.userModelObs$ = this.store.select(userModelSelector);
    this.userModelSubscription = this.store.select(userModelSelector).subscribe((state: IUserModel) => {
      this.userModel = state;
    });
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.userModelSubscription.unsubscribe();
  }
}
