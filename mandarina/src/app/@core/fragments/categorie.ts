import { gql } from 'apollo-angular';
import { RESOURCEFRAGMENT } from '@fragments/resource';

export const CATEGORIE_FRAGMENT = gql`
  ${RESOURCEFRAGMENT}
  fragment categorieFragment on Categorie {
    name
    description
    id
    id_image
    countPrograms
    countEvents
    createCategorie
    image {
      ...resourceFragment
    }
  }
`;
