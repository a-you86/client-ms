import { Routes } from '@angular/router';
import {HomeComponent} from './home/home.component';
import {NAVBAR} from './layouts/navbar/navbar.routes';

export const routes: Routes = [
  ...NAVBAR,
  {
    path: '',
    component: HomeComponent,
  },
];
export default routes;
