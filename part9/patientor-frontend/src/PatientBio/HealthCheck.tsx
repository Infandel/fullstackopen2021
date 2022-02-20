import React from 'react';
import { HealthCheckEntry } from '../types';
import { Icon,  Header, Segment,  } from 'semantic-ui-react';

const HealthCheck: React.FC<{ entry: HealthCheckEntry }> = ({ entry }) => {

  const healthRatingColor = (healthCheckRating: number) => {
    switch(healthCheckRating) {
      case 0:
        return "red";
      case 1:
        return "orange";
      case 2:
        return "purple";
      case 3:
        return "black";
      default:
        break;
    }
  };

  return (
    <Segment>
      <Header as='h3'>{entry.date} <Icon name='doctor' size="big" /></Header>
      <i>{entry.description}</i>
      <br />
      <Icon name='heart' size="small" color={healthRatingColor(entry.healthCheckRating)} />
    </Segment>
  );
};

export default HealthCheck;