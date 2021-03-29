import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

import * as _ from 'lodash';
import { UntilDestroy } from '@core';
import { signupFlowSelector, viewFeedbackSelector } from '../../store/appstate.selectors';
import { ActionsSubject, Store } from '@ngrx/store';
import {
  ApplicationState,
  IControlState,
  IUserModel,
  ISignupFlow,
  signupFlowStrategyEnum,
} from '@app/generic/fdx.models';
import {
  APP_INIT_FLOW,
  HANDLE_USER_SIGNOUT_SUCCESS,
  HANDLE_USER_SIGNUP,
  HANDLE_USER_SIGNUP_ERROR,
  IFdxAction,
} from '@app/store/appState.actions';
import {
  REGEX_ALPHA_SPACES,
  REGEX_EMAIL,
  REGEX_ALPHA_DIGITS_SPACES_SPECIAL,
  FIRST_NAME,
  LAST_NAME,
  PASSWORD,
  CONFIRM_PASSWORD,
  SEGMENT_UPPER_CASE,
  SEGMENT_LOWER_CASE,
  REGEX_LOWER_CASE,
  SEGMENT_MIN_CHARS,
  REGEX_MIN_CHARS,
  SEGMENT_LAST_NAME,
  REGEX_UPPER_CASE,
  SEGMENT_FIRST_NAME,
  EMPTY_STRING,
} from '@app/generic/fdx.constants';
import { Observable } from 'rxjs';

@UntilDestroy()
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent {
  error: string | null;
  signUpForm!: FormGroup;
  viewPassword = false;
  firstNamePattern: string = EMPTY_STRING;
  lastNamePattern: string = EMPTY_STRING;
  messages: string[];
  cols: any[] = [...Array(6).keys()];
  accumulatedPasswordErrors: number = 0;
  viewFeedback$: Observable<any>;

  SEGMENT_FIRST_NAME = SEGMENT_FIRST_NAME;
  SEGMENT_LAST_NAME = SEGMENT_LAST_NAME;
  SEGMENT_UPPER_CASE = SEGMENT_UPPER_CASE;
  SEGMENT_LOWER_CASE = SEGMENT_LOWER_CASE;
  SEGMENT_MIN_CHARS = SEGMENT_MIN_CHARS;

  public signupFlow: ISignupFlow;

  private controlsStateArray: IControlState[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private actionsSubject: ActionsSubject,
    private store: Store<{ appStoreState: ApplicationState }>
  ) {
    this.createForm();
    const payload = {
      signupFlowStrategy: signupFlowStrategyEnum.PLAIN,
    } as ISignupFlow;
    this.store.dispatch({ type: APP_INIT_FLOW, payload });

    this.viewFeedback$ = this.store.select(viewFeedbackSelector);

    this.store.select(signupFlowSelector).subscribe((state) => {
      this.signupFlow = { ...state };
    });

    this.actionsSubject.subscribe((action: IFdxAction) => {
      if (action.type === HANDLE_USER_SIGNUP_ERROR || action.type === HANDLE_USER_SIGNOUT_SUCCESS) {
      }
    });
  }

  public handleForm() {
    if (this.signUpForm.valid) {
      this.signupFlow.appLoading = true;
      const formValue = this.signUpForm.value;
      const userModel: IUserModel = formValue as IUserModel;
      this.store.dispatch({ type: HANDLE_USER_SIGNUP, payload: { userModel } });
    }
  }

  private createForm() {
    this.signUpForm = this.formBuilder.group({
      firstName: [EMPTY_STRING, [Validators.required, Validators.pattern(REGEX_ALPHA_SPACES)]],
      lastName: [EMPTY_STRING, [Validators.required, Validators.pattern(REGEX_ALPHA_SPACES)]],
      emailAddress: [EMPTY_STRING, [Validators.required, Validators.pattern(REGEX_EMAIL)]],
      password: [EMPTY_STRING, [Validators.required]],
      confirmPassword: [EMPTY_STRING, [Validators.pattern(REGEX_ALPHA_DIGITS_SPACES_SPECIAL)]],
    });

    this.signUpForm.setValidators(this.comparisonValidator());

    this.signUpForm.valueChanges.subscribe(() => {
      this.dynamicFormValidation();
    });
  }

  private comparisonValidator(): ValidatorFn {
    return (group: FormGroup): ValidationErrors => {
      const passwordControl = group.controls[PASSWORD];
      const confirmPasswordControl = group.controls[CONFIRM_PASSWORD];
      let passwordErrors: {} = null;
      if (passwordControl.value !== confirmPasswordControl.value) {
        passwordErrors = { ...passwordErrors, ...{ mismatch: true } };
      }
      if (confirmPasswordControl.value.length === 0) {
        passwordErrors = { ...passwordErrors, ...{ required: true } };
      }
      if (passwordErrors) {
        confirmPasswordControl.setErrors(passwordErrors);
      } else {
        confirmPasswordControl.setErrors(null);
      }
      return;
    };
  }

  private dynamicFormValidation(): void {
    this.firstNamePattern = this.stripAndToLower(this.signUpForm.get(FIRST_NAME).value);
    this.lastNamePattern = this.stripAndToLower(this.signUpForm.get(LAST_NAME).value);
    this.dynamicPasswordControlValidation();
  }

  private dynamicPasswordControlValidation(): void {
    const passwordErrors: object[] = this.segmentsValidation(PASSWORD);
    if (passwordErrors.length > 0) {
      const errorObj = passwordErrors.reduce((a, b) => Object.assign(a, b), {});
      this.getFormControl(PASSWORD).setErrors(errorObj);
      this.accumulatedPasswordErrors = passwordErrors.length;
    } else {
      this.getFormControl(PASSWORD).setErrors(null);
      this.accumulatedPasswordErrors = 0;
    }
  }

  private segmentsValidation(control: string): object[] {
    let errArray: object[] = [];
    errArray = this.composeErrorArray(
      errArray,
      control,
      SEGMENT_FIRST_NAME,
      this.isValid(this.getFormControl(FIRST_NAME)) ? this.returnRegEx(this.firstNamePattern) : null
    );
    errArray = this.composeErrorArray(
      errArray,
      control,
      SEGMENT_LAST_NAME,
      this.isValid(this.getFormControl(LAST_NAME)) ? this.returnRegEx(this.lastNamePattern) : null
    );
    errArray = this.composeErrorArray(errArray, control, SEGMENT_LOWER_CASE, REGEX_LOWER_CASE);
    errArray = this.composeErrorArray(errArray, control, SEGMENT_UPPER_CASE, REGEX_UPPER_CASE);
    errArray = this.composeErrorArray(errArray, control, SEGMENT_MIN_CHARS, REGEX_MIN_CHARS);
    return errArray;
  }

  private segmentValidation(control: string, segment: string, regEx: RegExp): object {
    let passwordErrors = null;
    if (regEx && !regEx.test(this.getFormControl(control).value)) {
      passwordErrors = { [segment]: true };
    }
    return passwordErrors;
  }

  private composeErrorArray(errArr: object[], control: string, segment: string, regEx: RegExp): object[] {
    const errObj: null | {} = this.segmentValidation(control, segment, regEx);
    if (errObj) {
      errArr.push(errObj);
    }
    return errArr;
  }

  /* helper functions */

  public hasError(key: string, identifier: string) {
    return this.getFormControl(key).hasError(identifier);
  }

  public displayValidationMessage(key: string) {
    const blurred = this.controlsStateArray.find((control: IControlState) => control.key === key && control.blurred);
    const control = this.getFormControl(key);
    return control.invalid && control.dirty && blurred;
  }

  public viewPasswordToggle() {
    this.viewPassword = !this.viewPassword;
  }

  public onBlurControl(key: string): void {
    if (!this.controlsStateArray.find((control: IControlState) => control.key === key && control.blurred === true)) {
      this.controlsStateArray.push({ key, blurred: true } as IControlState);
    }
  }

  public getFormControl(key: string): AbstractControl {
    return this.signUpForm.get(key);
  }

  private isValid(field: any): boolean {
    return field.value === '' || field.invalid ? false : true;
  }

  private stripAndToLower(value: string): string {
    return value.replace(/ /g, '').toLowerCase();
  }

  private returnRegEx(pattern: string): RegExp {
    const regexString = `^((?!${pattern}).)*$`;
    return new RegExp(regexString, 'i');
  }

  /* for development purpose */

  private developmentPurpose() {
    const signUpFormObj = [
      {
        key: 'firstName',
        value: 'San Jay',
      },
      {
        key: 'lastName',
        value: 'Fal Con',
      },
      {
        key: 'emailAddress',
        value: 'fdx36393639@gmail.com',
      },
      {
        key: 'password',
        value: 'Fdx36393639',
      },
    ];

    signUpFormObj.forEach((formElement) => {
      const key = `${formElement.key}`;
      const value = formElement.value;
      this.getFormControl(key).patchValue(value);
    });
  }
}
