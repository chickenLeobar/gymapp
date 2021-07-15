import { gql } from 'apollo-angular';
export const SEDE_FRAGMENT = gql`
  fragment sedeFragment on Sede {
    id
    name
    description
    direction
  }
`;

export const CREATE_SEDE = gql`
  ${SEDE_FRAGMENT}
  mutation createSede($sede: SedeInput!) {
    createSede(sede: $sede) {
      ...sedeFragment
    }
  }
`;

export const DELETE_SEDE = gql`
  ${SEDE_FRAGMENT}
  mutation deleteSede($id: Int!) {
    deleteSede(id: $id) {
      ...sedeFragment
    }
  }
`;

export const UPDATE_SEDE = gql`
  ${SEDE_FRAGMENT}
  mutation updateSede($sede: SedeInput!, $id: Int!) {
    updateSede(sede: $sede, id: $id) {
      ...sedeFragment
    }
  }
`;

export const GET_SEDES = gql`
  ${SEDE_FRAGMENT}
  query getSedes($id: Int) {
    sedes(id: $id) {
      ...sedeFragment
    }
  }
`;
