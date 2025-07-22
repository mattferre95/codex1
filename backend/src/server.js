const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/users');
const stageRoutes = require('./routes/stages');
const checklistRoutes = require('./routes/checklists');
const reminderRoutes = require('./routes/reminders');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/stages', stageRoutes);
app.use('/api/checklists', checklistRoutes);
app.use('/api/reminders', reminderRoutes);

app.get('/', (_, res) => res.send('FNEK API'));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
