import diagnoses from '../../data/diagnoses';

import { DiagnoseEntry } from '../types';

const getEntries = (): DiagnoseEntry[] => {
  return diagnoses;
}

const addDiagnose = () => {
  return [];
};

export default {
  getEntries,
  addDiagnose
};