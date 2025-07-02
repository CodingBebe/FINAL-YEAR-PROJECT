import express from 'express';
import { createSubmission, getAllSubmissions } from '../controllers/submissionController';

const router = express.Router();

router.post('/', createSubmission);
router.get('/', getAllSubmissions);

export default router; 