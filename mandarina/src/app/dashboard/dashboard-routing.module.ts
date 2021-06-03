import { RoleGuard } from './../@core/guards/role.guard';
import { AuthGuard } from './../@core/guards/auth.guard';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardComponent } from './dashboard.component';
import { ERol } from '@services/rol.service';

const childrenRoutes: Routes = [
  {
    path: 'account',
    loadChildren: () =>
      import('./profile/profile.module').then((m) => m.ProfileModule)
  },
  {
    path: 'events',
    loadChildren: () =>
      import('./events/events.module').then((m) => m.EventsModule),
    canLoad: [RoleGuard],
    data: {
      roles: [ERol.CREATOR, ERol.ADMIN]
    }
  },
  {
    path: 'view',
    loadChildren: () =>
      import('./eventsview/eventsview.module').then((m) => m.EventsviewModule)
  },
  {
    path: 'apps',
    loadChildren: () => import('./apps/apps.module').then((m) => m.AppsModule)
  },
  {
    path: 'categorie',
    loadChildren: () =>
      import('./categorie/categorie.module').then((m) => m.CategorieModule),
    canLoad: [RoleGuard],
    data: {
      roles: [ERol.ADMIN]
    }
  },
  {
    path: 'ctrlus',
    loadChildren: () =>
      import('./ctrlusers/ctrlusers.module').then((m) => m.CtrlusersModule)
  },
  {
    path: 'm',
    loadChildren: () =>
      import('./me-events/me-events.module').then((m) => m.MeEventsModule)
  },
  {
    path: 'config',
    loadChildren: () =>
      import('./config/config.module').then((m) => m.ConfigModule)
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: 'view/explorer?type=events'
  }
];

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: childrenRoutes,
    canActivateChild: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule {}
