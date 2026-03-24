const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

let courses = [
  { id: 1, title: "Database Systems", instructor: "Dr Kamran", creditHours: 3 },
  { id: 2, title: "Operating Systems", instructor: "Dr Sara", creditHours: 4 }
];

let nextId = 3; 

app.post('/courses', (req, res) => {
  const { title, instructor, creditHours } = req.body;

  if (!title || typeof title !== 'string' || title.trim() === '') {
    return res.status(400).json({ error: "Invalid course data" });
  }
  if (!instructor || typeof instructor !== 'string' || instructor.trim() === '') {
    return res.status(400).json({ error: "Invalid course data" });
  }
  if (!Number.isInteger(creditHours) || creditHours < 1 || creditHours > 4) {
    return res.status(400).json({ error: "Invalid course data" });
  }

  const newCourse = {
    id: nextId++,
    title,
    instructor,
    creditHours
  };

  courses.push(newCourse);
  res.status(201).json(newCourse);
});

app.put('/courses/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { title, instructor, creditHours } = req.body;
  const notify = req.query.notify === 'true';

  const courseIndex = courses.findIndex(c => c.id === id);
  if (courseIndex === -1) {
    return res.status(404).json({ error: "Course not found" });
  }

  if (title) courses[courseIndex].title = title;
  if (instructor) courses[courseIndex].instructor = instructor;
  if (creditHours) courses[courseIndex].creditHours = creditHours;

  if (notify) {
    console.log("Instructor notified");
  }

  res.json(courses[courseIndex]);
});

app.delete('/courses/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const role = req.headers.role;

  if (role !== 'admin') {
   return res.status(403).json({ error: "Only admin can delete courses" });
  }

  const courseIndex = courses.findIndex(c => c.id === id);
  if (courseIndex === -1) {
    return res.status(404).json({ error: "Course not found" });
  }

  courses.splice(courseIndex, 1);
  res.json({ message: "Course deleted" });
});

app.delete('/courses', (req, res) => {
  const { ids } = req.body;

  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ error: "Invalid ids" });
  }

  courses = courses.filter(c => !ids.includes(c.id));

  res.json({ message: "Courses deleted" });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});