import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/storage";
import "firebase/messaging";

const config = {
  apiKey: "AIzaSyADFkseWaZoovM8Kqtbx20txJhAGNvBmmY",
  authDomain: "fiipracticproiect.firebaseapp.com",
  databaseURL: "https://fiipracticproiect.firebaseio.com",
  projectId: "fiipracticproiect",
  storageBucket: "gs://fiipracticproiect.appspot.com",
  messagingSenderId: "190137536547"
};

//un instance pt firebase
const firebaseProvider = firebase.initializeApp(config);

const storage = firebase.storage();
const database = firebase.database();
export { firebaseProvider, storage, database as default };
