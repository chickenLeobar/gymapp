import { BehaviorSubject } from 'rxjs';
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  SimpleChanges,
  OnChanges,
  HostBinding
} from '@angular/core';

import { css, cx } from '@emotion/css';
import { untilDestroyed, UntilDestroy } from '@ngneat/until-destroy';
type Mode = 'small' | 'normal' | 'fluid';

@Component({
  selector: 'container',
  template: `
    <ng-content></ng-content>
  `,
  styleUrls: ['./layout.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
@UntilDestroy()
export class ContainerComponent implements OnInit, OnChanges {
  @Input() mode!: Mode;

  public className$ = new BehaviorSubject<string>('container');

  @HostBinding('class') classes: string;
  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    const { mode } = changes;

    this.applySizeOnContainer(mode.currentValue);
  }
  private applySizeOnContainer(mode: Mode) {
    this.className$.next(cx(this.resolveSizeOnContainer(mode), 'container'));
  }

  ngOnInit(): void {
    this.className$.pipe(untilDestroyed(this)).subscribe(classes => {
      this.classes = classes;
    });
  }

  private resolveSizeOnContainer(mode: Mode) {
    switch (mode) {
      case 'small':
        return css`
          max-width: 1200px !important;
          width: 1200px;
        `;
      case 'normal':
        return css`
          max-width: 1400px !important;
          width: 1400px;
        `;
      case 'fluid':
        return css`
          max-width: 1500px !important;
          width: 1500px;
        `;
      default:
        break;
    }
    return css``;
  }
}
