import { Routes } from '@angular/router';
import {NavbarComponent} from './navbar.component';


export const NAVBAR: Routes = [
  {
    path: '',
    component: NavbarComponent,
    outlet: 'navbar',
  },
];
