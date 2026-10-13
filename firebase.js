import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
};

let db = null;

if (!getApps().length) {
  try {
    if (serviceAccount.projectId && serviceAccount.clientEmail && serviceAccount.privateKey) {
      initializeApp({
        credential: cert(serviceAccount),
      });
    } else {
      initializeApp({
        projectId: serviceAccount.projectId || "demo-project",
      });
    }
  } catch (error) {
    console.warn("Firebase no pudo inicializarse; las operaciones de base de datos quedarán deshabilitadas.", error.message);
  }
}

try {
  db = getFirestore();
} catch (error) {
  console.warn("Firestore no está disponible en este entorno.", error.message);
}

export default db;