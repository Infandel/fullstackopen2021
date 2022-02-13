import React from 'react';
import { Entry } from '../types';
import { useStateValue } from "../state";

const HospitalSegment: React.FC<{ entry: Entry }> = ({ entry }) => {
  const [{ diagnoses } ] = useStateValue();
  return (
    <div>
      <p>{entry.date} <i>{entry.description}</i></p>
      <ul>
        {entry.diagnosisCodes?.map(diCo => {
          console.log(diagnoses[diCo].name);
          return (
            <li key={diCo}>
              {diagnoses[diCo].code} {diagnoses[diCo].name}
            </li>
          );
        }
        )}
      </ul>
    </div>
  );
};

export default HospitalSegment;