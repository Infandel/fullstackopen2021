import React from 'react';
import { HospitalEntry } from '../types';
import { Card, Header, Icon, Segment } from 'semantic-ui-react';

const HospitalSegment: React.FC<{ entry: HospitalEntry }> = ({ entry }) => {
  return (
    <Segment>
      <Header as='h3'>{entry.date} <Icon name='hospital' size="big" /></Header>
      <i>{entry.description}</i>
      {entry.discharge && (
        <Card>
          <Card.Content>
            <Card.Header>Discharge</Card.Header>
          </Card.Content>
          <Card.Content>
            {'Date: '}{entry.discharge?.date}
            <br />
            {'Criteria: '}{entry.discharge?.criteria}
          </Card.Content>
        </Card>
      )}
    </Segment>
  );
};

export default HospitalSegment;