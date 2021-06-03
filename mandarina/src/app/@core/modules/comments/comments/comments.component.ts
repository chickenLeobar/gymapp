import { tap, filter } from 'rxjs/operators';

import { CommentService } from './../services/comment.service';
import { Comment } from '../models/comment.class';
import {
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
  AfterViewInit,
  Input,
  ViewEncapsulation,
  ChangeDetectionStrategy
} from '@angular/core';
import { JwtService } from '@services/jwt.service';
import { IComment, ICommentDisplay } from '../model';

import { Subscription, Observable, of } from 'rxjs';
@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss', '../style.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommentsComponent implements OnInit, AfterViewInit {
  @Input() private idBootrapComment: number;
  @ViewChild('customTpl') customEmptyTpl: TemplateRef<any>;

  data: ICommentDisplay[] = [];

  comments$: Observable<Comment[]>;

  constructor(
    private JwtService: JwtService,
    private commentsService: CommentService // private utilsService: UtilsService
  ) {}

  /*=============================================
  =            LIFECYCLE            =
  =============================================*/
  public ngAfterViewInit(): void {}

  public ngOnInit(): void {
    this.commentsService.init(this.idBootrapComment);

    this.comments$ = this.commentsService.comments$;
  }

  /*=============================================
  =            DOM EVENTS            =
  =============================================*/
  public sendPrincipalComment(content: string): void {
    const resolvePromises = async () => {
      const user = this.JwtService.getUserOfToken();
      await this.commentsService
        .addComment({
          id_user: user.id,
          id_bootstrap: 1,
          comment: content
        } as IComment)
        .toPromise();
    };
    resolvePromises();
  }
}
