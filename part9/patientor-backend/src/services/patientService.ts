import patients from '../../data/patients';
import { v4 as uuidv4 } from 'uuid';

import {
  PatientEntry,
  NonSensitivePatientEntry,
  NewPatientEntry, } from '../types';

const getEntries = (): Array<PatientEntry> => {
  return patients;
}

const getNonSensetivePatientEntries = (): NonSensitivePatientEntry[] => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation
  }));
};

const addPatient = ( entry: NewPatientEntry ): PatientEntry => {

  const newPatientEntry = {
    id: uuidv4(),
    ...entry
  }

  patients.push(newPatientEntry);
  return newPatientEntry;
};

const findById = (id: string): PatientEntry | undefined => {
  const entry = patients.find(p => p.id === id);
  return entry;
};

export default {
  getEntries,
  addPatient,
  getNonSensetivePatientEntries,
  findById
};
