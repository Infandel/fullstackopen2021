interface getYourBMI {
  height: number,
  weight: number
}

const calculateBmi = (height: number, weight: number) : string => {
  if (height === 0) return 'Please input actual height in centimeteres'
  const heightInMeters = height * 0.01
  const index = Number((weight / heightInMeters ** 2).toFixed(1))
  if (index < 16) {
    return 'Underweight (Severe thinness)';
  } else if (index <= 16.9 && index >= 16) {
    return 'Underweight (Moderate thinness)';
  } else if (index <= 18.4 && index >= 17.0) {
    return 'Underweight (Mild thinness)';
  } else if (index <= 24.9 && index >= 18.5) {
    return 'Normal (healthy weight)';
  } else if (index <= 29.9 && index >= 25.0) {
    return 'Overweight (Pre-obese)';
  } else if (index <= 34.9 && index >= 30.0) {
    return 'Obese (Class I)';
  } else if (index <= 39.9 && index >= 35.0) {
    return 'Obese (Class II)';
  } else if (index >= 40.0) {
    return 'Obese (Class III)';
  } else throw new Error ('Had not managed to calculate BMI')
}

const parseArgumentsHere = (args: Array<string>): getYourBMI => {
  if (args.length < 4) throw new Error('Not enough arguments');
  if (args.length > 4) throw new Error('Too many arguments');

  if (!isNaN(Number(args[2])) && !isNaN(Number(args[3]))) {
    return {
      height: Number(args[2]),
      weight: Number(args[3])
    }
  } else {
    throw new Error('Provided values were not numbers!');
  }
}

try {
  const { height, weight } = parseArgumentsHere(process.argv);
  console.log(calculateBmi(height, weight));
} catch (error: unknown) {
  let errorMessage = 'Something bad happened.'
  if (error instanceof Error) {
    errorMessage += ' Error: ' + error.message;
  }
  console.log(errorMessage);
}