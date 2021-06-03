import { tap, pluck } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { RESOURCEFRAGMENT } from '@fragments/resource';
import { ResourceResponse } from '@models/reponses/response';
import { IResource } from '@models/eventmodels/resource.model';

import { Observable } from 'rxjs';
const CREATE_RESOURCE = gql`
  ${RESOURCEFRAGMENT}
  mutation addResource($resource: InputResource!) {
    createResource(resource: $resource) {
      ...resourceFragment
    }
  }
`;

const EDIT_RESOURCE = gql`
  ${RESOURCEFRAGMENT}
  mutation editResource($resource: InputResource!, $idResource: Int!) {
    editResource(resource: $resource, idResource: $idResource) {
      resp
      resource {
        ...resourceFragment
      }
    }
  }
`;

const UPLOAD_LOCAL_RESOURCE = gql`
  mutation addLocalResource($file: Upload!) {
    addLocalResource(file: $file) {
      key
      instance
    }
  }
`;
@Injectable({
  providedIn: 'root',
})
export class ResourceService {
  constructor(private apollo: Apollo) {}

  public createResource(resource: IResource) {
    return this.apollo
      .mutate<{ createResource: IResource }>({
        mutation: CREATE_RESOURCE,
        variables: {
          resource: {
            ...resource,
          },
        },
      })
      .toPromise();
  }

  public uploadlocalResource(
    file: File
  ): Observable<{ key: string; instance: 'LOCAL' | 'S3' }> {
    return this.apollo
      .mutate({
        mutation: UPLOAD_LOCAL_RESOURCE,
        variables: {
          file,
        },
        context: {
          useMultipart: true,
        },
      })
      .pipe(tap(console.log), pluck('data', 'addLocalResource'));
  }
  public editResource(resource: IResource, idResource: number) {
    console.log('edit');

    console.log('resource', resource);
    console.log('id', idResource);

    return this.apollo
      .mutate<{ editResource: ResourceResponse }>({
        mutation: EDIT_RESOURCE,
        variables: {
          resource: {
            ...resource,
          },
          idResource: idResource,
        },
      })
      .toPromise();
  }
}
