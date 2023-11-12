// db.js
import Dexie from 'dexie';

export const db = new Dexie('questions');
db.version(1).stores({
    questions: '++id, subject, question, answer',
    subjects: '++id, name'
});
