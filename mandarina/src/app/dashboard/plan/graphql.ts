import { gql } from 'apollo-angular';

export const PLAN_FRAGMENT = gql`
  fragment planFragment on Plan {
    id
    name
    price
    startDate
    endDate
    months
    avalaible
    description
  }
`;

export const CREATE_PLAN = gql`
  mutation createPlan($plan: InputPlan!) {
    createPlan(plan: $plan) {
      ...planFragment
    }
  }
`;

export const UPDATE_PLAN = gql`
  mutation updatePlan($plan: InputPlan!, $id: Int!) {
    updatePlan(plan: $plan, id: $id) {
      ...planFragment
    }
  }
`;

export const DELETE_PLAN = gql`
  mutation deletePlan($id: Int!) {
    deletePlan(id: $id) {
      ...planFragment
    }
  }
`;

export const GET_PLANS = gql`
  query plans($id: Int) {
    retrievePlans(id: $id) {
      ...planFragment
    }
  }
`;
