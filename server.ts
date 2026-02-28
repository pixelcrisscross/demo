import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import Database from 'better-sqlite3';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  const PORT = 3000;
  const MONGODB_URI = process.env.MONGODB_URI;
  let isUsingMongoDB = false;

  // Connect to MongoDB with fallback
  try {
    if (MONGODB_URI) {
      await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
      console.log('Connected to MongoDB Atlas');
      isUsingMongoDB = true;
    } else {
      throw new Error('No MONGODB_URI provided');
    }
  } catch (err) {
    console.warn('MongoDB connection failed, falling back to local SQLite:', err instanceof Error ? err.message : String(err));
    console.info('Tip: To use MongoDB Atlas, ensure 0.0.0.0/0 is whitelisted in your Atlas Network Access settings.');
  }

  // Define Schemas & Models (Mongoose)
  const JobSchema = new mongoose.Schema({
    title: String,
    company: String,
    location: String,
    salary: String,
    type: String,
    description: String,
    matchScore: Number,
    recruiterId: String,
    skillsRequired: [String],
    experienceLevel: String,
    benefits: String,
    deadline: Date,
    postedAt: { type: Date, default: Date.now }
  });

  const UserSchema = new mongoose.Schema({
    uid: { type: String, required: true, unique: true },
    name: String,
    email: { type: String, required: true, unique: true },
    role: { type: String, enum: ['student', 'college', 'recruiter'], default: 'student' },
    collegeId: String, // For students belonging to a college
    skills: [String],
    profileStrength: { type: Number, default: 0 },
    bio: String,
    applications: [{ jobId: String, status: String, appliedAt: Date }],
    createdAt: { type: Date, default: Date.now }
  });

  const Job = mongoose.model('Job', JobSchema);
  const User = mongoose.model('User', UserSchema);

  // SQLite Fallback Setup (keeping as safety)
  const db = new Database('nexusai.db');
  
  // Initialize SQLite tables if needed
  db.exec(`
    CREATE TABLE IF NOT EXISTS jobs (
      id TEXT PRIMARY KEY,
      title TEXT,
      company TEXT,
      location TEXT,
      salary TEXT,
      type TEXT,
      description TEXT,
      matchScore INTEGER,
      recruiterId TEXT,
      skillsRequired TEXT,
      experienceLevel TEXT,
      benefits TEXT,
      deadline TEXT,
      postedAt TEXT
    );
    CREATE TABLE IF NOT EXISTS users (
      uid TEXT PRIMARY KEY,
      email TEXT,
      name TEXT,
      role TEXT,
      profileStrength INTEGER,
      collegeId TEXT,
      bio TEXT,
      createdAt TEXT
    );
    CREATE TABLE IF NOT EXISTS applications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      jobId TEXT,
      uid TEXT,
      status TEXT,
      appliedAt TEXT
    );
  `);

  app.use(cors());
  app.use(express.json());

  // API Routes with Fallback Logic
  app.get('/api/jobs', async (req, res) => {
    try {
      if (isUsingMongoDB) {
        const jobs = await Job.find().sort({ postedAt: -1 });
        return res.json(jobs);
      } else {
        const jobs = db.prepare('SELECT * FROM jobs ORDER BY postedAt DESC').all() as any[];
        res.json(jobs.map(j => ({ 
          ...j, 
          _id: j.id,
          skillsRequired: j.skillsRequired ? j.skillsRequired.split(',') : []
        })));
      }
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch jobs' });
    }
  });

  app.post('/api/jobs', async (req, res) => {
    try {
      const jobData = { ...req.body, postedAt: new Date() };
      if (isUsingMongoDB) {
        const job = new Job(jobData);
        await job.save();
        io.emit('job:created', job);
        res.status(201).json(job);
      } else {
        const id = Math.random().toString(36).substr(2, 9);
        const stmt = db.prepare(`
          INSERT INTO jobs (id, title, company, location, salary, type, description, matchScore, recruiterId, skillsRequired, experienceLevel, benefits, deadline, postedAt) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        stmt.run(
          id, 
          jobData.title, 
          jobData.company, 
          jobData.location, 
          jobData.salary, 
          jobData.type, 
          jobData.description, 
          jobData.matchScore || 95, 
          jobData.recruiterId || 'system',
          Array.isArray(jobData.skillsRequired) ? jobData.skillsRequired.join(',') : '',
          jobData.experienceLevel || 'Entry Level',
          jobData.benefits || '',
          jobData.deadline || '',
          jobData.postedAt.toISOString()
        );
        const job = { ...jobData, _id: id, id };
        io.emit('job:created', job);
        res.status(201).json(job);
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to create job' });
    }
  });

  app.delete('/api/jobs/:id', async (req, res) => {
    try {
      if (isUsingMongoDB) {
        await Job.findByIdAndDelete(req.params.id);
      } else {
        db.prepare('DELETE FROM jobs WHERE id = ?').run(req.params.id);
      }
      io.emit('job:deleted', req.params.id);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: 'Failed to delete job' });
    }
  });

  app.get('/api/users/:uid', async (req, res) => {
    try {
      if (isUsingMongoDB) {
        const user = await User.findOne({ uid: req.params.uid });
        res.json(user);
      } else {
        const user = db.prepare('SELECT * FROM users WHERE uid = ?').get(req.params.uid) as any;
        if (user) {
          const apps = db.prepare('SELECT * FROM applications WHERE uid = ?').all(req.params.uid) as any[];
          user.applications = apps.map(a => ({ jobId: a.jobId, status: a.status, appliedAt: a.appliedAt }));
        }
        res.json(user);
      }
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch user' });
    }
  });

  app.post('/api/users', async (req, res) => {
    try {
      if (isUsingMongoDB) {
        const user = new User(req.body);
        await user.save();
        res.status(201).json(user);
      } else {
        const stmt = db.prepare('INSERT INTO users (uid, email, name, role, profileStrength, collegeId, bio, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
        stmt.run(req.body.uid, req.body.email, req.body.name, req.body.role, req.body.profileStrength || 0, req.body.collegeId || null, req.body.bio || '', new Date().toISOString());
        res.status(201).json(req.body);
      }
    } catch (err) {
      res.status(500).json({ error: 'Failed to create user' });
    }
  });

  app.put('/api/users/:uid', async (req, res) => {
    try {
      if (isUsingMongoDB) {
        const user = await User.findOneAndUpdate({ uid: req.params.uid }, req.body, { new: true });
        res.json(user);
      } else {
        const { name, bio } = req.body;
        db.prepare('UPDATE users SET name = ?, bio = ? WHERE uid = ?').run(name, bio, req.params.uid);
        const user = db.prepare('SELECT * FROM users WHERE uid = ?').get(req.params.uid) as any;
        if (user) {
          const apps = db.prepare('SELECT * FROM applications WHERE uid = ?').all(req.params.uid) as any[];
          user.applications = apps.map((a: any) => ({ jobId: a.jobId, status: a.status, appliedAt: a.appliedAt }));
        }
        res.json(user);
      }
    } catch (err) {
      res.status(500).json({ error: 'Failed to update user' });
    }
  });

  app.post('/api/jobs/:id/apply', async (req, res) => {
    try {
      const { uid } = req.body;
      const jobId = req.params.id;
      const application = { jobId, status: 'Applied', appliedAt: new Date() };
      
      if (isUsingMongoDB) {
        await User.findOneAndUpdate(
          { uid },
          { $push: { applications: application } }
        );
        res.json({ success: true });
      } else {
        const stmt = db.prepare('INSERT INTO applications (jobId, uid, status, appliedAt) VALUES (?, ?, ?, ?)');
        stmt.run(jobId, uid, 'Applied', application.appliedAt.toISOString());
        res.json({ success: true });
      }
    } catch (err) {
      console.error('Apply error:', err);
      res.status(500).json({ error: 'Failed to apply for job' });
    }
  });

  app.put('/api/jobs/:id', async (req, res) => {
    try {
      if (isUsingMongoDB) {
        const job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
        io.emit('job:updated', job);
        res.json(job);
      } else {
        const { title, location, description, salary, type, skillsRequired, experienceLevel, benefits, deadline } = req.body;
        db.prepare(`
          UPDATE jobs 
          SET title = ?, location = ?, description = ?, salary = ?, type = ?, skillsRequired = ?, experienceLevel = ?, benefits = ?, deadline = ? 
          WHERE id = ?
        `).run(
          title, 
          location, 
          description, 
          salary, 
          type, 
          Array.isArray(skillsRequired) ? skillsRequired.join(',') : skillsRequired,
          experienceLevel,
          benefits,
          deadline,
          req.params.id
        );
        const job = db.prepare('SELECT * FROM jobs WHERE id = ?').get(req.params.id) as any;
        io.emit('job:updated', { ...job, _id: job.id });
        res.json({ ...job, _id: job.id });
      }
    } catch (err) {
      res.status(500).json({ error: 'Failed to update job' });
    }
  });

  app.get('/api/colleges/:collegeId/students', async (req, res) => {
    try {
      if (isUsingMongoDB) {
        const students = await User.find({ collegeId: req.params.collegeId, role: 'student' });
        res.json(students);
      } else {
        const students = db.prepare('SELECT * FROM users WHERE collegeId = ? AND role = "student"').all(req.params.collegeId) as any[];
        const enrichedStudents = students.map(student => {
          const apps = db.prepare('SELECT * FROM applications WHERE uid = ?').all(student.uid) as any[];
          return {
            ...student,
            applications: apps.map(a => ({ jobId: a.jobId, status: a.status, appliedAt: a.appliedAt }))
          };
        });
        res.json(enrichedStudents);
      }
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch college students' });
    }
  });

  // Socket.io logic
  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
