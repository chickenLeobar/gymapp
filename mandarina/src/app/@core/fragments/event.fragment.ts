import { gql } from 'apollo-angular';
export const EVENTFRAGMENT = gql`
  fragment eventFragment on Event {
    name
    id
    published
    capacityAssistant
    publishedDate
    includeComments
    description
    includeVideo
    id_resource
    createEvent
    eventCover
    id_comment
    video {
      url
    }

    credits
    modeEvent
    category_id
    interactions {
      id_user
      id_event
    }
  }
`;
