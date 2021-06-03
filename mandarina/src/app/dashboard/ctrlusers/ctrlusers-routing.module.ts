import { RequestCreditsComponent } from './request-credits/request-credits.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CtrlusersComponent } from './ctrlusers.component';
import { UsersComponent } from './users/users.component';

const routes: Routes = [
  {
    path: '',
    component: CtrlusersComponent,
    children: [
      {
        component: UsersComponent,
        path: 'list'
      },
      {
        component: RequestCreditsComponent,
        path: 'request'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CtrlusersRoutingModule {}
