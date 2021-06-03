import { ERol } from './../../../../services/rol.service';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  AfterViewInit,
  AfterViewChecked,
  ChangeDetectorRef,
  Input,
  Output,
  EventEmitter
} from '@angular/core';
import { NzSafeAny } from 'ng-zorro-antd/core/types';

@Component({
  selector: 'app-role-check',
  template: `
    <div class="">
      <p class="subtitle">Roles:</p>
      <label
        nz-checkbox
        [(ngModel)]="allchecked"
        (ngModelChange)="updateAllChecked()"
      >
        Seleccionar todos
      </label>
    </div>
    <nz-checkbox-group
      [(ngModel)]="options"
      (ngModelChange)="updateSingleChecked()"
    ></nz-checkbox-group>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoleCheckComponent
  implements OnInit, AfterViewInit, AfterViewChecked {
  allchecked = false;
  indeterminate = true;
  @Input() roles: ERol[];
  @Output() eventRoles = new EventEmitter<ERol[]>();

  constructor(private detection: ChangeDetectorRef) {
    this.detection.markForCheck();
  }
  ngAfterViewChecked(): void {}
  ngAfterViewInit(): void {}
  ngOnInit(): void {
    this.updateDefaultChecke();
    // this.updateSingleChecked();
  }

  private emitRoles() {
    const roles = new Set(this.roles);
    this.options.forEach((el) => el.checked && roles.add(el.value));
    this.eventRoles.next(Array.from(roles));
  }

  options: { label: string; value: ERol; checked?: boolean }[] = [
    {
      label: 'Administrador',
      value: ERol.ADMIN
    },
    {
      label: 'Asesor',
      value: ERol.ASESOR
    },
    {
      label: 'Creador',
      value: ERol.CREATOR
    }
  ];
  updateDefaultChecke() {
    const roles = new Set(this.roles);
    this.options = this.options.map((el) => {
      return {
        ...el,
        checked: roles.has(el.value)
      };
    });
  }

  updateAllChecked() {
    this.indeterminate = false;
    if (this.allchecked) {
      this.options = this.options.map((item) => {
        return {
          ...item,
          checked: true
        };
      });
    } else {
      this.options = this.options.map((item) => {
        return {
          ...item,
          checked: false
        };
      });
    }
    this.emitRoles();
  }
  updateSingleChecked(): void {
    this.emitRoles();
    if (this.options.every((item) => !item.checked)) {
      this.allchecked = false;
      this.indeterminate = false;
    } else if (this.options.every((item) => item.checked)) {
      this.allchecked = true;
      this.indeterminate = false;
    } else {
      this.indeterminate = true;
    }
  }
}
