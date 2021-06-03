import { FetchResult, ApolloQueryResult } from '@apollo/client/core';
import { FileResponse } from '@core/models/reponses/response';
import { Isesion } from '@core/models/eventmodels/sesion.model';
import { Injectable } from '@angular/core';
import { ISesionResponse } from '@core/models/reponses/sesion.response';
import { Observable } from 'rxjs';
import { gql, Apollo, QueryRef } from 'apollo-angular';
import { getTimestamp } from '@helpers/helpers';

export const FRAGMENTSESION = gql`
  fragment sesionFragment on Sesion {
    id
    sesionCover
    startSesion
    nameSesion
    description
    duration
    createdSesion
    linkRoom
    includeVideo
    createdSesion
    id_resource
    id_comment
    video {
      id
      url
    }
    includeComments
  }
`;

const DELETE_SESION = gql`
  mutation deleteSesion($idSesion: ID!) {
    deleteSesion(idSesion: $idSesion) {
      resp
      sesion {
        sesionCover
      }
      sesions {
        id
      }
    }
  }
`;

const GETSESIONS = gql`
  ${FRAGMENTSESION}
  query getSesions($idEvent: ID!) {
    sesions(idEvent: $idEvent) {
      resp
      errors {
        message
        code
      }
      sesions {
        ...sesionFragment
      }
    }
  }
`;

const UPLOAD_COVER = gql`
  mutation addCover($idSesion: ID!, $picture: Upload!) {
    addCoverSesion(idSesion: $idSesion, picture: $picture) {
      resp
      errors {
        code
        message
      }
      path
    }
  }
`;

const ADD_SESION = gql`
  ${FRAGMENTSESION}
  mutation addSesion($idEvent: ID!, $sesion: InputSesion!) {
    addSesion(idEvent: $idEvent, sesion: $sesion) {
      resp
      errors {
        code
        message
      }
      sesions {
        ...sesionFragment
      }
      sesion {
        ...sesionFragment
      }
    }
  }
`;

const EDIT_SESION = gql`
  ${FRAGMENTSESION}
  mutation editSesion($idSesion: ID!, $sesion: InputSesion!) {
    updateSesion(idSesion: $idSesion, sesion: $sesion) {
      resp
      errors {
        code
        message
      }
      sesions {
        ...sesionFragment
      }
      sesion {
        ...sesionFragment
      }
    }
  }
`;

const GETSESION = gql`
  ${FRAGMENTSESION}
  query getSesion($idSesion: ID!) {
    sesion(id: $idSesion) {
      ...sesionFragment
    }
  }
`;

@Injectable()
export class SesionService {
  constructor(private apollo: Apollo) {}
  public addSesion(
    idEvent: number,
    sesion: Isesion
  ): Observable<FetchResult<{ addSesion: ISesionResponse }>> {
    return this.apollo.mutate({
      mutation: ADD_SESION,
      variables: {
        idEvent,
        sesion: this.buildSesion(sesion)
      }
    });
  }

  private buildSesion(sesion: Isesion) {
    return {
      includeComments: sesion.includeComments,
      duration: sesion.duration,
      nameSesion: sesion.nameSesion,
      linkRoom: sesion.linkRoom,
      // changue acording to mode
      ...() => {
        if (sesion.startSesion) {
          return {
            startSesion: getTimestamp(sesion.startSesion)
          };
        }
      },
      description: sesion.description,
      cloudinarySource: sesion.cloudinarySource,
      id_resource: Number(sesion?.id_resource),
      includeVideo: sesion.includeVideo
    };
  }
  public editSesion(
    idSesion: number,
    sesion: Isesion
  ): Observable<FetchResult<{ updateSesion: ISesionResponse }>> {
    return this.apollo.mutate({
      mutation: EDIT_SESION,
      variables: {
        idSesion,
        sesion: this.buildSesion(sesion)
      }
    });
  }

  public getSesions(
    id: number
  ): Observable<ApolloQueryResult<{ sesions: ISesionResponse }>> {
    return this.apollo.query({
      query: GETSESIONS,
      variables: {
        idEvent: Number(id)
      }
    });
  }

  public deleteSesion(idSesion: number) {
    /** se elimina la sesion tambien toca eliminar el recurso*/
    return this.apollo
      .mutate<{ deleteSesion: ISesionResponse }>({
        mutation: DELETE_SESION,
        variables: {
          idSesion: idSesion
        }
      })
      .toPromise();
  }

  public getSesion(idSesion?: number): QueryRef<{ sesion: Isesion }> {
    return this.apollo.watchQuery({
      query: GETSESION,
      variables: {
        idSesion: idSesion ?? null
      }
    });
  }

  public uploadCover(
    file: File,
    id: number
  ): Observable<FetchResult<{ addCoverSesion: FileResponse }>> {
    return this.apollo.mutate<{ addCoverSesion: FileResponse }>({
      mutation: UPLOAD_COVER,
      variables: {
        picture: file,
        idSesion: Number(id)
      },
      context: {
        useMultipart: true
      }
    });
  }
}
