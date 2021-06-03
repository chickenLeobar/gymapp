import { ERol } from 'src/app/services/rol.service';
import { Injectable } from '@angular/core';

export interface Imenu {
  name: string;
  route?: string;
  items?: Imenu[];
  icon?: string;
  roles?: ERol[];
  isFont?: boolean;
}
@Injectable()
export class SidebarService {
  data: Imenu[] = [
    {
      name: 'cuenta',
      icon: 'user',
      roles: [ERol.USER, ERol.ADMIN],
      isFont: false,
      items: [
        { name: 'Perfil', route: 'account/profile', icon: 'user' },
        { name: 'Referidos', route: 'account/referreals', icon: 'user' }
      ]
    },
    // {
    //   name: 'Mis eventos',
    //   icon: 'fas fa-calendar-week pr-2 icon_sidebar',
    //   route: 'm/events',
    //   isFont: true,
    //   roles: [ERol.USER]
    // }
    {
      name: 'Mis Programas',
      icon: 'fas fa-indent pr-2 icon_sidebar',
      route: 'm/programs',
      isFont: true,
      roles: [ERol.USER]
    },
    {
      name: 'Control de usuarios',
      icon: 'fas fa-users-cog pr-2 icon_sidebar',
      isFont: true,
      route: 'ctrlus',
      roles: [ERol.ADMIN, ERol.ASESOR],
      items: [
        { name: 'Usuarios', route: 'ctrlus/list' },
        { name: 'Solictitudes', route: 'ctrlus/request' }
      ]
    },
    // {
    //   name: 'apps',
    //   route: 'calendar',
    //   isFont: false,
    //   roles: [ERol.USER, ERol.CREATOR, ERol.ADMIN],
    //   icon: 'appstore',
    //   items: [{ name: 'calendario', route: 'apps/calendar' }]
    // },
    // {
    //   name: 'Administrar Eventos',
    //   icon: 'profile',
    //   isFont: false,
    //   roles: [ERol.CREATOR, ERol.ADMIN],
    //   items: [
    //     { name: 'Agregar Evento', route: 'events' },
    //     {
    //       name: 'Lista de eventos',
    //       route: 'events/list/event'
    //     }
    //   ]
    // },
    {
      name: 'Administrar Programas',
      icon: 'profile',
      isFont: false,
      roles: [ERol.CREATOR, ERol.ADMIN],
      items: [
        { name: 'Agregar Programa', route: 'events/program' },
        {
          name: 'Lista de Programas',
          route: 'events/list/program'
        }
      ]
    },
    {
      name: 'Categorias',
      icon: 'bars',
      isFont: false,
      route: 'categorie',
      roles: [ERol.ADMIN]
    },
    {
      name: 'Configuración',
      icon: 'setting',
      isFont: false,
      route: 'config',
      roles: [ERol.USER]
    }
  ];
  constructor() {}

  get getSidebar() {
    return this.data;
  }
}
