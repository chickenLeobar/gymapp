import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProfileComponent } from './profile.component';
import { ProfileComponent as ProfilePage } from './pages/profile/profile.component';
import { ReferrealsComponent } from './pages/referreals/referreals.component';
const routes: Routes = [
  {
    path: '',
    component: ProfileComponent,
    children: [
      { path: 'profile', component: ProfilePage },
      { path: 'referreals', component: ReferrealsComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfileRoutingModule {}
