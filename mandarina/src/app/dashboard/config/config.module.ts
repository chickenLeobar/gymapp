import { PriceConfigService } from './services/price-config.service';
import { ConfigService } from './services/config.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConfigRoutingModule } from './config-routing.module';
import { ConfigComponent } from './config.component';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { PriceCreditComponent } from './components/price-credit/price-credit.component';
import { WelcomeCreditsComponent } from './components/welcome-credits/welcome-credits.component';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { MatListModule } from '@angular/material/list';
import { ReactiveFormsModule } from '@angular/forms';
import { NzMessageServiceModule } from 'ng-zorro-antd/message';
import { WelcomeCreditsService } from './services/welcome-credits.service';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { MatExpansionModule } from '@angular/material/expansion';
const zorro = [
  NzIconModule,
  NzTabsModule,
  NzCollapseModule,
  NzButtonModule,
  NzInputModule,
  NzFormModule,
  NzSpaceModule,
  NzInputNumberModule,
  NzSelectModule,
  NzDividerModule,
  NzListModule,
  NzGridModule,
  NzDescriptionsModule,
  NzTableModule,
  NzModalModule,
  NzMessageServiceModule,
  NzTypographyModule
];

const material = [MatListModule, MatExpansionModule];
@NgModule({
  declarations: [
    ConfigComponent,
    PriceCreditComponent,
    WelcomeCreditsComponent
  ],
  imports: [
    ...zorro,
    ...material,
    CommonModule,
    ReactiveFormsModule,
    ConfigRoutingModule
  ],
  providers: [ConfigService, PriceConfigService, WelcomeCreditsService]
})
export class ConfigModule {}
