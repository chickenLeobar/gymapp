import { Component, OnDestroy } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {
  constructor(private activatedRoute: ActivatedRoute) {}

  // actions

  ngOnDestroy(): void {}
}
