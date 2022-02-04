import { Result, GoalAndArray } from './interfaces';

const parseArguments = (args: Array<string>) : GoalAndArray => {
  if (args.length < 4) throw new Error('Not enough arguments');
  const daily_exercises = args.slice(3).map(number => {
    const intHours = Number(number);
    if (isNaN(intHours) || intHours < 0) throw new Error('Number in array is invalid');
    else return intHours;
  });
  const target = Number(args[2]);
  if (!isNaN(target) && target > 0) {
    return {
      daily_exercises,
      target
    };
  } else {
    throw new Error('Provided values were not numbers!');
  }
};

// Function receives array of training days in hours per day and giving you
// result as an object of how you were able to manage the target goal (training hours per day).
export const calculateExercises = (daily_exercises: Array<number>, target: number): Result => {
  daily_exercises.map(hoursPerDay => {
    if (hoursPerDay < 0 || target < 0) {
      throw new Error('Provided values were negative!');
    } else if (isNaN(hoursPerDay) || isNaN(target)) {
      throw new Error('Provided values were not a numbers!');
    }
  });
  const trainingDays = daily_exercises.filter(number => number !== 0).length;
  const periodLength = daily_exercises.length;
  const average = daily_exercises.reduce((a,b) => a + b, 0) / periodLength;
  const success = average > target;
  let ratingDescription;
  let rating;
  const ratingProcent = Number(((average / target) * 100).toFixed(1));
  if (ratingProcent <= 65) {
    ratingDescription = 'simply awful';
    rating = 1;
  } else if (ratingProcent < 99.9 && ratingProcent > 65.1) {
    ratingDescription = 'not too bad but could be better';
    rating = 2;
  } else {
    ratingDescription = 'excellent work';
    rating = 3;
  }

  return {
    periodLength,
    trainingDays,
    success,
    rating,
    ratingDescription,
    target,
    average
  };
};

try {
  const { daily_exercises, target } = parseArguments(process.argv);
  console.log(calculateExercises(daily_exercises, target));
} catch (error: unknown) {
  let errorMessage = 'Something bad happened.';
  if (error instanceof Error) {
    errorMessage += ' Error: ' + error.message;
  }
  console.log(errorMessage);
}
// console.log(calculateExercises([3, 0, 2, 4.5, 0, 3, 1], 2))