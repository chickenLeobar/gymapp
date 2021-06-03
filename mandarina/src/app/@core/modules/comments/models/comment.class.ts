import { UtilsService } from './../../../../services/utils.service';
import { IUser } from './../../../models/User';
import es from 'date-fns/locale/es';
import { IComment, IInteractionItem } from '../model';

import { formatDistance } from 'date-fns';
import { AppModule } from 'src/app/app.module';
import _, { isNull } from 'lodash';
import { JwtService } from '@services/jwt.service';

/**
 * Instancia un arrar de interfaces en un tipo objecto
 */
export class Comment implements IComment {
  id!: string;
  time!: string;
  message!: string;

  replies!: Comment[];

  id_bootstrap!: number;
  updateComment!: Date;
  comment!: string;
  id_comment!: string;
  id_user!: number;
  interaction!: IInteractionItem[];
  createComment!: Date;
  user!: IUser;
  /**
   * if  you get some service=>
   * const analyticsService = AppModule.injector.get(AnalyticsService);
   */
  public get displayTime() {
    return formatDistance(new Date(), new Date(this.createComment), {
      locale: es
    });
  }

  public get displayName() {
    // CommentsModule.injector.get()
    return this.user.name;
  }

  get hasAvatar() {
    return isNull(this.user.image) ? false : true;
  }

  get isReply() {
    return _.isNull(this.id_bootstrap);
  }

  // determine if it is my comment
  get isMe() {
    return this.userLocal.id == this.user.id;
  }

  get hasReplies() {
    return this.replies.length > 0;
  }

  get instaceReplies() {
    if (this.isReply) {
      return [];
    } else {
      return this.replies.map((el) => Comment.instance(el));
    }
    // return
  }
  public get displayAvatar() {
    const utilsService = AppModule.injector.get(UtilsService);
    return utilsService.resolveNormalPathImage(this.user.image);
  }

  get userLocal() {
    const jwtService = AppModule.injector.get(JwtService);
    const user = jwtService.getUserOfToken();
    return user;
  }
  /**
   * indicate if existe me like in iunteractions
   */
  public get isYourLike(): boolean {
    const isYourLike = this.interaction.some(
      (el) => el.id_user == this.userLocal.id
    );
    return isYourLike;
  }

  /**
   * show when image no exist
   */
  public get getInitials() {
    return this.user.name.charAt(0) + this.user.lastName.charAt(0);
  }

  public get likes() {
    return this.interaction.length;
  }
  static instance(comment: IComment) {
    let obj = new this();
    obj = Object.assign(obj, comment);
    if (comment.replies) {
      obj.replies = comment.replies.map((el) => Comment.instance(el));
    } else {
      obj.replies = [];
    }
    return obj;
  }
}
