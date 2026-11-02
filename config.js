/* Explore / Identify — class configuration.
   Both pages read this file: index.html (students) and dashboard.html (instructor).

   Live collection of results uses the same Firebase project as the Week 2 bean-counting exercise
   (bean-counting0722). The web API key below is meant to be public: access is controlled by the Firestore
   rules (firestore.rules in this folder, which also keeps the bean-counting rules), not by the key.
   The rules must be published once in the Firebase console: Build → Firestore Database → Rules → paste → Publish.

   Without a working Firebase setup the pages still work: students press "Copy result code" on their results
   page and you paste the codes into the dashboard (Import results).
*/
window.LAB_CONFIG = {
  firebaseConfig: {
    apiKey: "AIzaSyA53NV98pMCg2tI03rIN8eLoRfdamSi33Y",
    authDomain: "bean-counting0722.firebaseapp.com",
    projectId: "bean-counting0722",
    storageBucket: "bean-counting0722.firebasestorage.app",
    messagingSenderId: "575544640458",
    appId: "1:575544640458:web:97eb61e3db258f94114533"
  },

  // Firestore collection that holds one document per finished game (document id = Run ID).
  collection: "bandit_results",

  // Asked once per dashboard visit before deleting results from the database. A deterrent, not security:
  // keep the dashboard link to yourself (students only need index.html).
  adminPin: "1234",

  // Shown in the dashboard header.
  title: "Explore / Identify",
  footer: "SNU College of Business · Innovation Strategy"
};
