import { initializeApp } from 'firebase/app'
import firebaseConfig from '../../firebaseCredentials.json'
import * as dotenv from 'dotenv';
dotenv.config();

export default initializeApp({
    ...firebaseConfig,
    apiKey: process.env.FIREBASE_API_KEY
});