import { Component, Inject, OnInit, TemplateRef } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
  selector: 'app-modal-edit',
  template: `
    <ng-container
      *ngTemplateOutlet="data.tpl; context: data.context"
    ></ng-container>
  `,
  styles: [``],
})
export class ModalEditComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { tpl: TemplateRef<{ $implicit: boolean }>; context: any }
  ) {}
  ngOnInit(): void {}
}
