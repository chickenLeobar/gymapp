import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NgModule } from '@angular/core';
import { APOLLO_OPTIONS } from 'apollo-angular';
import { ApolloClientOptions, InMemoryCache } from '@apollo/client/core';
import { HttpLink } from 'apollo-angular/http';
import { split, ApolloLink } from '@apollo/client/core';
import { WebSocketLink } from '@apollo/client/link/ws';

import { environment } from '../environments/environment';
import { OperationDefinitionNode } from 'graphql';
import { getMainDefinition } from '@apollo/client/utilities';

const uri = `${environment.apiUrl}/graphql`; // <-- add the URL of the GraphQL server here
const uriWs = `ws://${environment.hostSubs}/suscriptions`;
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { MangeErrors } from './helpers/NetworkError';
import { NzModalService } from 'ng-zorro-antd/modal';
export function createApollo(
  httpLink: HttpLink,
  manageErrors: MangeErrors
): ApolloClientOptions<any> {
  const ws = new WebSocketLink({
    uri: uriWs,
    options: {
      reconnect: true
    }
  });
  const http = httpLink.create({
    uri: uri
  });
  const link = split(
    // split based on operation type
    ({ query }) => {
      const { kind, operation } = getMainDefinition(
        query
      ) as OperationDefinitionNode;
      return kind === 'OperationDefinition' && operation === 'subscription';
    },
    // NOTE : be careful in the order
    ws,
    http
  );
  const errorHandler = onError((errResponse) => {
    manageErrors.receivedErrors(errResponse);
  });
  const tokenContext = setContext((operation, context) => {
    const token = localStorage.getItem('token');
    if (!token) {
      return null;
    }
    return {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
  });
  return {
    link: ApolloLink.from([errorHandler, tokenContext, link]),
    cache: new InMemoryCache({
      typePolicies: {
        Comment: {
          fields: {
            interaction: {
              merge: (existing, incomming) => {
                return incomming;
              }
            }
          }
        }
      }
    })
  };
}

@NgModule({
  providers: [
    NzModalService,
    MangeErrors,
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink, MangeErrors]
    }
  ]
})
export class GraphQLModule {}
