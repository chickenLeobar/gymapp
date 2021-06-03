import { gql } from 'apollo-angular';

export const CREDIT_FRAGMENT = gql`
  fragment credit on CreditBootstrap {
    id
    currentCredits
    referrealCredits
    updateCredits
  }
`;
