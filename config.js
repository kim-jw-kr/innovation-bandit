/* Explore / Identify — class configuration.
   Both pages read this file: index.html (students) and dashboard.html (instructor).

   Live collection of results uses the Firebase project "innovation-bandit" (Spark plan, free).
   The web API key below is meant to be public: access is controlled by the Firestore rules
   (firestore.rules in this folder, published in the Firebase console), not by the key.

   Without a working Firebase setup the pages still work: students press "Copy result code" on their results
   page and you paste the codes into the dashboard (Import results).
*/
window.LAB_CONFIG = {
  firebaseConfig: {
    apiKey: "AIzaSyDjBgus_aR1q0Ggz4J7P5r8hdhIwSv4F3w",
    authDomain: "innovation-bandit.firebaseapp.com",
    projectId: "innovation-bandit",
    storageBucket: "innovation-bandit.firebasestorage.app",
    messagingSenderId: "572649515065",
    appId: "1:572649515065:web:562e17f0eb13cf6c46c5e8"
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
