import React from 'react';
import {
  useParams
} from "react-router-dom";
import { useStateValue } from "../state";
import { Icon, Header } from 'semantic-ui-react';
import { Patient, Entry } from "../types";
import axios from 'axios';
import { apiBaseUrl } from '../constants';
import { getCurrentPatient} from '../state/reducer';
import EntryDetails from './EntryDetails';


const PatientBio = () => {
  const [{ visitedPatients, diagnoses }, dispatch] = useStateValue();
  const { id } = useParams<{ id: string }>();

  const fetchCurrentPatient = async (id: string) => {
    try {
      const { data: currentPatient } = await axios.get<Patient>(`${apiBaseUrl}/patients/${id}`);
      if (currentPatient) {
        // dispatch({ type: "GET_CURRENT_PATIENT", payload: currentPatient });
        dispatch(getCurrentPatient(currentPatient));
      }

    } catch (e) {
      return console.error(e.response?.data || 'Unknown Error');
    }
  };

  const getCurrentGenderIcon = (gender: string) : JSX.Element | null => {
    switch(gender) {
      case 'male':
        return (
          <Icon name='mars' />
        );
      case 'female':
        return (
          <Icon name='venus' />
        );
      case 'other':
        return (
          <Icon name='genderless' />
        );
      default:
        return null;
    }
  };

  const currentPatient = Object.values(visitedPatients).find(p => p.id === id);
  // Checking for current patient, so if it visited already we are not going
  // to fetch data from API.
  if (!currentPatient) {
    void fetchCurrentPatient(id);
    return null;
  }
  if (Object.keys(diagnoses).length === 0) {
    return null;
  }

  return (
    <div>
      <h2>{currentPatient.name} {getCurrentGenderIcon(currentPatient.gender)}</h2>
      <p>ssn: {currentPatient.ssn}</p>
      <p>occupation: {currentPatient.occupation}</p>
      {currentPatient.entries.length > 0 && <Header as='h3'>Entries</Header>}
        {currentPatient.entries?.map((entry : Entry) =>
          <EntryDetails key={entry.id} entry={entry} />
        )}
    </div>
  );
};

export default PatientBio;