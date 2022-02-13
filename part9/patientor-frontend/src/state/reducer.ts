import { State } from "./state";
import { Diagnosis, Patient } from "../types";

export type Action =
  | {
      type: "SET_PATIENT_LIST";
      payload: Patient[];
    }
  | {
      type: "ADD_PATIENT";
      payload: Patient;
    }
  | {
      type: "GET_CURRENT_PATIENT";
      payload: Patient;
    }
  | {
      type: "GET_DIAGNOSES_LIST";
      payload: Diagnosis[];
    };

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_PATIENT_LIST":
      return {
        ...state,
        patients: {
          ...action.payload.reduce(
            (memo, patient) => ({ ...memo, [patient.id]: patient }),
            {}
          ),
          ...state.patients
        }
      };
    case "ADD_PATIENT":
      return {
        ...state,
        patients: {
          ...state.patients,
          [action.payload.id]: action.payload
        }
      };
    case "GET_CURRENT_PATIENT":
      return {
        ...state,
        patients: {
          ...state.patients,
          [action.payload.id]: action.payload
        },
        visitedPatients: {
          ...state.visitedPatients,
          [action.payload.id]: action.payload
        }
      };
    case "GET_DIAGNOSES_LIST":
      return {
        ...state,
        diagnoses: {
          ...action.payload.reduce(
            (memo, diagnose) => ({ ...memo, [diagnose.code]: diagnose }),
            {}
          ),
          ...state.diagnoses
        }
      };
    default:
      return state;
  }
};

export const setPatientList = (payload : Patient[]) => {
  return {
    type: 'SET_PATIENT_LIST',
    payload,
  } as Action;
};

export const addPatient = (payload : Patient) => {
  return {
    type: 'ADD_PATIENT',
    payload,
  } as Action;
};

export const getCurrentPatient = (payload : Patient) => {
  return {
    type: 'GET_CURRENT_PATIENT',
    payload,
  } as Action;
};

export const getDiagnosesList = (payload : Diagnosis[]) => {
  return {
    type: 'GET_DIAGNOSES_LIST',
    payload,
  } as Action;
};
