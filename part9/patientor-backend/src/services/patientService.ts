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
  return patients.map(({ id, name, dateOfBirth, gender, occupation, entries }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation,
    entries
  }));
};

const addPatient = ( entry: NewPatientEntry ): PatientEntry => {

  const newPatientEntry: PatientEntry = {
    id: uuidv4(),
    entries: [],
    ...entry
  }

  patients.push(newPatientEntry);
  return newPatientEntry;
};

const findById = (id: string): PatientEntry | undefined => {
  const entry = patients.find(p => p.id === id);
  console.log(entry)
  return entry;
};

export default {
  getEntries,
  addPatient,
  getNonSensetivePatientEntries,
  findById
};
