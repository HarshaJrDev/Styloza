import firebase from '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyAw90t3974VT1TONPJgGlX99-FvHF616g0',
  projectId: 'styloza-ec15a',
  storageBucket: 'styloza-ec15a.firebasestorage.app',
  messagingSenderId: '506283884120',
  appId: '1:506283884120:android:c8e038238bdae1a333942d',
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
