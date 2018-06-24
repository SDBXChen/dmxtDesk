import { NgModule } from '@angular/core';
import {Router, RouterModule, Routes} from '@angular/router';
import {WelcomeComponent} from '../page/welcome/welcome.component';
import {LoginComponent} from '../page/login/login.component';
import {HomepageComponent} from '../page/homepage/homepage.component';
import {RegisterComponent} from '../page/register/register.component';
import {LocalStorage} from '../serve/local.storage';
import {ForgetpswComponent} from '../page/forgetpsw/forgetpsw.component';


const appRoutes: Routes = [
  { path: '', redirectTo: '/welcome', pathMatch: 'full' },
  { path: 'welcome', component: WelcomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'homepage', component: HomepageComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forgetpsw', component: ForgetpswComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
  currentUser = null;
  constructor( private localStorage: LocalStorage, private router: Router) {
    console.log(this.localStorage.getObject('currentUser').hasOwnProperty('rolename'));
    this.currentUser = this.localStorage.getObject('currentUser');
    // console.log(this.currentUser);
    if (this.currentUser.hasOwnProperty('rolename')) {
      this.router.navigate(['/homepage', this.currentUser]);
    } else {
      this.router.navigate(['/welcome']);
    }
  }
}
