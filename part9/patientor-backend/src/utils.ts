import { NewPatientEntry, Gender, Entry } from './types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const toNewPatientEntry = (object: any): NewPatientEntry => {
  const newEntry = {
    name: isStringValueExists(object.name, 'name'),
    dateOfBirth: parseDate(object.dateOfBirth),
    gender: parseGender(object.gender),
    ssn: isStringValueExists(object.ssn, 'SSN'),
    occupation: isStringValueExists(object.occupation, 'occupation'),
    entries: object.entries as Entry[] || new Array()
  };

  return newEntry;
};

const isString = (text: unknown): text is string => {
  return typeof text === 'string' || text instanceof String;
};

const isDate = (dateOfBirth: string): boolean => {
  return Boolean(Date.parse(dateOfBirth));
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isGender = (param: any): param is Gender => {
  return Object.values(Gender).includes(param);
};

const parseDate = (dateOfBirth: unknown): string => {
  if (!dateOfBirth || !isString(dateOfBirth) || !isDate(dateOfBirth)) {
      throw new Error('Incorrect or missing date: ' + dateOfBirth);
  }
  return dateOfBirth;
};

const parseGender = (gender: unknown): Gender => {
  if (!gender || !isGender(gender)) {
      throw new Error('Incorrect or missing Gender: ' + Gender);
  }
  return gender;
};

const isStringValueExists = (entry: unknown, fieldName: string): string => {
  if (!entry || !isString(entry)) {
    throw new Error(`Incorrect or missing ${fieldName}`)
  }

  return entry
}

export default toNewPatientEntry;