import express from 'express';
import patientRouter from './routes/patient';
import diagnoseRouter from './routes/diagnose';
import cors from 'cors';

const app = express();

app.use(express.json());
app.use(cors())

app.get('/api/ping', (_req, res) => {
  console.log('someone pinged here');
  res.send('pong');
});

app.use('/api/patients', patientRouter);
app.use('/api/diagnoses', diagnoseRouter);

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});