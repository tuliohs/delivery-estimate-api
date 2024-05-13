import { getFirestore } from 'firebase/firestore/lite';
import firebase from './firebase';
const db = getFirestore(firebase) 
export default db
