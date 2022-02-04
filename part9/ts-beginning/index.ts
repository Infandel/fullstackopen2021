import express from 'express';
import { calculateBmi } from './bmiCalculator';
import { calculateExercises } from './exerciseCalculator';
import { GoalAndArray } from './interfaces';
const app = express();

app.use(express.json());

app.post('/exercises', (request, response) => {
  const { daily_exercises, target } = request.body as GoalAndArray;
  if (!daily_exercises || !target) {
    response.json({ error: "parameters missing" });
  }
  if (Array.isArray(daily_exercises) && !isNaN(target)) {
    const calcsResult = calculateExercises(daily_exercises, target);
    response.json(calcsResult);
  } else {
    response.json({ error: "malformatted parameters" });
  }
});

app.get('/bmi', (req, res) => {
  if (req.query) {
    const height = Number(req.query.height);
    const weight = Number(req.query.weight);
    if (height && weight && height > 0 && weight > 0) {
      const bmi = calculateBmi(height, weight);
      res.json({
        weight,
        height,
        bmi
      });
    } else {
      res.json({ error: "malformatted parameters" });
    }
  }
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});