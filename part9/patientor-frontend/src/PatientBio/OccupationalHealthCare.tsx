import React from 'react';
import { OccupationalHealthcareEntry } from '../types';
import { Icon, Header, Segment, Card, } from 'semantic-ui-react';

const OccupationalHealthCare: React.FC<{ entry: OccupationalHealthcareEntry }> = ({ entry }) => {

  return (
    <Segment>
      <Header as='h3'>
        {entry.date + ' '}

        <Icon name='stethoscope' size="big" />
        {entry.employerName}
      </Header>
      <i>{entry.description}</i>
      {entry.sickLeave && (
        <Card>
          <Card.Content>
            <Card.Header>Sick leave</Card.Header>
          </Card.Content>
          <Card.Content>
            {'Started: '}{entry.sickLeave?.startDate}
            <br />
            {'Ended: '}{entry.sickLeave?.endDate}
          </Card.Content>
        </Card>
      )}
    </Segment>
  );
};

export default OccupationalHealthCare;