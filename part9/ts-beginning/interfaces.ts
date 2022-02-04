export interface BMIObject {
  height: number,
  weight: number
}

export interface Result {
  periodLength: number,
  trainingDays: number,
  success: boolean,
  rating: number,
  ratingDescription: string,
  target: number,
  average: number
}

export interface GoalAndArray {
  daily_exercises: Array<number>,
  target: number
}
