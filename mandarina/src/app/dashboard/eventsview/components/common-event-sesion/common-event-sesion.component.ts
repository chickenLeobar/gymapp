import { CommentService } from './../../../../@core/modules/comments/services/comment.service';
import { EBreakpoints } from './../../../../@core/breakPointCheck/model';
import { checkBreakPoint } from './../../../../@core/breakPointCheck/checkBreakPoint';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { untilDestroyed, UntilDestroy } from '@ngneat/until-destroy';
@Component({
  selector: 'app-common-event-sesion',
  template: ``,
  styles: []
})
@UntilDestroy({ checkProperties: true })
export class CommonEventSesionComponent {
  constructor(
    public changueDetector: ChangeDetectorRef,
    public commentService: CommentService
  ) {}

  sizeComments = this.commentService.lengthComments();

  stylesCommentBodyDrawer = {} as CSSStyleDeclaration;

  visibleDrawerComments = false;
  visibleSesions = false;
  drawerWidth = '500px';
  widthComments = '50%';

  public openComments() {
    this.visibleDrawerComments = true;
  }
  public closeSesionDrawer = () => {
    this.visibleSesions = false;
    this.changueDetector.markForCheck();
  };
  @checkBreakPoint(EBreakpoints.xs)
  changueSizeDrawer() {
    this.drawerWidth = '100%';
    this.widthComments = '90%';
  }
  @checkBreakPoint(EBreakpoints.gtXs)
  moreMobile() {
    this.drawerWidth = '500px';
    this.widthComments = '50%';
  }
  closeCommentsDrawer = () => {
    this.visibleDrawerComments = false;
    this.changueDetector.markForCheck();
  };
}
