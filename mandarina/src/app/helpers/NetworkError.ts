import { Inject, Injectable } from '@angular/core';
import { ErrorResponse } from '@apollo/client/link/error';
import { NzModalService } from 'ng-zorro-antd/modal';
import { SERVER_ERRORS } from '@core/data/errors';
import { Router } from '@angular/router';
@Injectable()
export class MangeErrors {
  constructor(private modalService: NzModalService, private router: Router) {}
  public receivedErrors({
    graphQLErrors,
    networkError,
    response
  }: ErrorResponse) {
    const error = graphQLErrors[0].extensions.code;

    const message = SERVER_ERRORS.get(error);
    if (error == 'TOKEN_EXPIRED') {
      this.router.navigateByUrl('/login');
    }
    if (error == 'SCHEMA_ERRROR') {
      this.modalService.error({
        nzTitle: 'Error',
        nzContent: message.message
      });
    }
    if (message) {
      this.modalService.error({
        nzTitle: message.title,
        nzContent: message.message
      });
    }
  }
}
