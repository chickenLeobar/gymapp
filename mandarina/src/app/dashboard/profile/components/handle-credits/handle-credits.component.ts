import { tap } from 'rxjs/operators';
import { IReuestCredit } from './../../../../@core/models/credits.model';
import { HandleCreditService } from './handle-credit.service';
import { IUser } from '@core/models/User';
import { Component, OnInit, TemplateRef, ViewChildren } from '@angular/core';
import { ProfileService } from '../../services/profile.service';
import { IHistorialCredit } from '@core/models/credits.model';
import { Observable } from 'rxjs';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

interface IformPetitionCredits
  extends Pick<IReuestCredit, 'id_credit' | 'credits' | 'description'> {}
import { NzTabPosition, NzTabPositionMode } from 'ng-zorro-antd/tabs';

@Component({
  selector: 'app-handle-credits',
  templateUrl: './handle-credits.component.html',
  styleUrls: ['./handle-credits.component.scss'],
  providers: [HandleCreditService]
})
export class HandleCreditsComponent implements OnInit {
  currentUser: IUser;
  historial: Observable<IHistorialCredit[]>;
  showModalRequest = false;
  requestCredits: Observable<IReuestCredit>;
  formRequest: FormGroup;
  tplModal: TemplateRef<any>;
  postionTap: NzTabPosition = 'left';

  constructor(
    private profileService: ProfileService,
    private creditService: HandleCreditService,
    private fb: FormBuilder
  ) {}

  sendRequest() {
    this.showModalRequest = false;
    if (this.formRequest.valid) {
      const value = this.formRequest.value;
      this.creditService
        .requestCredits({ ...value, id_credit: this.currentUser.credit.id })
        .subscribe((_) => {
          this.creditService.refRequestCredits.refetch();
        });
    }
  }
  private buildForms() {
    this.formRequest = this.fb.group({
      credits: this.fb.control(0, Validators.min(1))
    });
  }
  ngOnInit(): void {
    this.buildForms();
    this.profileService.onlyUser().then((el) => {
      this.currentUser = el;
      this.creditService.initQueries(this.currentUser.credit.id);
      this.historial = this.creditService
        .valuechangueHistorial()
        .pipe(tap(console.log));
      this.requestCredits = this.creditService.valueChanguesRequestCredits();
    });
  }
}
