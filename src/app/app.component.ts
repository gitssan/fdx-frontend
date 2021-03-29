import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { merge } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';

import { environment } from '@env/environment';
import { Logger, UntilDestroy, untilDestroyed } from '@core';
import { I18nService } from '@app/i18n';
import { ActionsSubject, Store } from '@ngrx/store';
import { ApplicationState, ISignupFlow, signupFlowStrategyEnum } from './generic/fdx.models';
import { signupFlowSelector } from './store/appstate.selectors';
import { APP_INIT_FLOW, WAKE_UP_APP } from './store/appState.actions';
import { FdxService } from './services/fdx.service';

// import { getLastCommit } from 'git-last-commit';

@UntilDestroy()
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  public signupFlow: ISignupFlow;

  constructor(
    private router: Router,
    private store: Store<{ appStoreState: ApplicationState }>,
    private actionsSubject: ActionsSubject,
    private activatedRoute: ActivatedRoute,
    private titleService: Title,
    private translateService: TranslateService,
    private i18nService: I18nService
  ) {
    console.log('env', '20:15, 27-03-2021', environment);

    const payload = {
      appLoading: true,
    } as ISignupFlow;
    this.store.dispatch({ type: WAKE_UP_APP, payload });

    this.actionsSubject.subscribe((action) => {
      if (action.type === '') {
      }
    });

    this.store.select(signupFlowSelector).subscribe((state) => {
      if (state.signupFlowStrategy && !state.appInitialized) {
        this.store.dispatch({
          type: APP_INIT_FLOW,
          payload: {
            cloudConnected: state.signupFlowStrategy === signupFlowStrategyEnum.PLAIN ? false : true,
            appInitialized: true,
          } as ISignupFlow,
        });
      }
      this.signupFlow = state;
    });
  }

  ngOnInit() {
    //ngg-rocket boiler plate base functionality
    this.i18nService.init(environment.defaultLanguage, environment.supportedLanguages);
    const onNavigationEnd = this.router.events.pipe(filter((event) => event instanceof NavigationEnd));
    merge(this.translateService.onLangChange, onNavigationEnd)
      .pipe(
        map(() => {
          let route = this.activatedRoute;
          while (route.firstChild) {
            route = route.firstChild;
          }
          return route;
        }),
        filter((route) => route.outlet === 'primary'),
        switchMap((route) => route.data),
        untilDestroyed(this)
      )
      .subscribe((event) => {
        const title = event.title;
        if (title) {
          this.titleService.setTitle(this.translateService.instant(title));
        }
      });
  }

  ngOnDestroy() {
    this.i18nService.destroy();
  }
}
