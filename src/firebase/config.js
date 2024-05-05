import * as firebase from 'firebase';
import '@firebase/auth';
import '@firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDqlrhrAHOlzuosRJfLj0I4sWCPwRb4jtQ",
    authDomain: "volta-7c456.firebaseapp.com",
    projectId: "volta-7c456",
    storageBucket: "volta-7c456.appspot.com",
    messagingSenderId: "334324747912",
    appId: "1:334324747912:web:f1d88b2afe74302f8dd93d"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

export { firebase };