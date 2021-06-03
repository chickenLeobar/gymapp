import {
  Component,
  OnInit,
  ViewEncapsulation,
  ChangeDetectionStrategy
} from '@angular/core';

@Component({
  selector: 'app-principal-screen',
  template: ` <h1>hello</h1> `,
  styles: [],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PrincipalScreenComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
