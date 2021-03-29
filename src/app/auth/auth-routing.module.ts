import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';

import { SignupComponent } from '../views/signup/signup.component';

const routes: Routes = [{ path: 'signup', component: SignupComponent, data: { title: marker('Sign-up') } }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [],
})
export class AuthRoutingModule {}
