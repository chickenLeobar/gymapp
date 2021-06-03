import { gql } from 'apollo-angular';
export const RESOURCEFRAGMENT = gql`
  fragment resourceFragment on Resource {
    id
    key
    access
    bucket
    updateResource
    type
    url
    instace
  }
`;
