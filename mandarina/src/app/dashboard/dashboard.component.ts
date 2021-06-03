import { StatusUserService } from './services/status-user.service';
import { JwtService } from './../services/jwt.service';
import { SidebarService, Imenu } from './services/sidebar.service';
import { MediaObserver, MediaChange } from '@angular/flex-layout';
import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AlertService } from '@core/modules/alert/alert.service';
import { ActivatedRoute, Params } from '@angular/router';

import { ConfirmEmailService } from './services/confirm-email.service';
import { Router } from '@angular/router';
import { StyleUtils } from '@angular/flex-layout';
import {
  checkBreakPoint,
  BreakPointCheck,
  EBreakpoints
} from '@core/breakPointCheck/public-api';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  providers: [ConfirmEmailService]
})
@BreakPointCheck({ nameObserver: 'media' })
export class DashboardComponent implements OnInit, OnDestroy {
  collapsableWidth = 0;
  widthSidebar = '256px';
  isCollapsed = true;
  menu: Imenu[];
  mediaObserbable: Subscription;
  constructor(
    private media: MediaObserver,
    public sidebarSesvice: SidebarService,
    private alertService: AlertService,
    private jwtService: JwtService,
    private activateRoute: ActivatedRoute,
    private emailService: ConfirmEmailService,
    private router: Router,
    private statusUser: StatusUserService
  ) {
    this.menu = sidebarSesvice.getSidebar;
  }

  unsuscribe() {
    this.statusUser.sub.unsubscribe();
  }
  ngOnInit(): void {
    // this.sidebarChangue();
    this.prepareDashboardAlerts();
    this.listeRoutes();
  }

  private prepareDashboardAlerts(): void {
    const confirmEmail = () => {
      const user = this.jwtService.getUserOfToken();
      if (!user.comfirmed) {
        this.alertService.addAlert({
          message: 'Su email todavía no esta confirmado',
          description: 'Puedes encontrar más información en tu perfil',
          type: 'warning',
          icon: true,
          closable: true,
          id: 'emailconfirm'
        });
      }
    };
    confirmEmail();
  }

  private listeRoutes() {
    const user = this.jwtService.getUserOfToken();
    if (!user.comfirmed) {
      this.activateRoute.queryParams.subscribe((params: Params) => {
        if ('confirmation' in params) {
          this.emailService.confirmUser(params.confirmation).subscribe({
            next: () => {
              this.alertService.addAlert({
                id: 'emailconfirm',
                type: 'success',
                message: 'Su email ha sido confirmado',
                closable: true,
                icon: true
              });
              this.router.navigate([]);
            }
          });
        }
      });
    }
  }

  private sidebarChangue() {
    this.mediaObserbable = this.media
      .asObservable()
      .subscribe((data: MediaChange[]) => {
        console.log(data);

        const existMd = data.some(
          ({ mqAlias }) => mqAlias.toLocaleLowerCase() === 'gt-xs'
        );
        if (existMd) {
          this.collapsableWidth = 80;
          this.widthSidebar = '256px';
        } else {
          this.collapsableWidth = 0;
          this.widthSidebar = '180px';
        }
      });
  }
  ngOnDestroy(): void {
    if (this.mediaObserbable) {
      this.mediaObserbable.unsubscribe();
    }
    // this.mediaObserbable.unsubscribe();
  }

  /*=============================================
  =            lISTENS            =
  =============================================*/

  @checkBreakPoint(EBreakpoints.gtXs)
  desktopBreakPoint() {
    this.collapsableWidth = 80;
    this.widthSidebar = '256px';
  }

  @checkBreakPoint(EBreakpoints.xs)
  tabletBreakPoint() {
    this.collapsableWidth = 0;
    this.widthSidebar = '240px';
  }

  // @checkBreakPoint(EBreakpoints.xs)
  // mobileBreakPoint() {
  //   console.log('mobile active');
  //   this.collapsableWidth = 0;
  //   this.widthSidebar = '180px';
  // }
}
