import React from 'react';
import { assertNever } from '../utils';
import { Entry } from '../types';
import HealthCheck from './HealthCheck';
import HospitalSegment from './HospitalSegment';
import OccupationalHealthCare from './OccupationalHealthCare';

const EntryDetails: React.FC<{ entry: Entry }> = ({ entry }) => {
  switch (entry.type) {
    case "Hospital":
      return <HospitalSegment entry={entry} />;
    case "HealthCheck":
      return <HealthCheck entry={entry} />;
    case "OccupationalHealthcare":
      return <OccupationalHealthCare entry={entry} />;
    default:
      return assertNever(entry);
  }
};

export default EntryDetails;