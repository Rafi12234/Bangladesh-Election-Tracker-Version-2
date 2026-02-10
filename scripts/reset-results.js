/**
 * Reset all declared results and summary in Firestore.
 * Run with: node scripts/reset-results.js
 */

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, deleteDoc, doc, setDoc, serverTimestamp } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: 'AIzaSyAAArfD_jceLHDYjxXOe2cZtcNzfAfHT94',
  authDomain: 'bd-election-live-tracker.firebaseapp.com',
  projectId: 'bd-election-live-tracker',
  storageBucket: 'bd-election-live-tracker.firebasestorage.app',
  messagingSenderId: '896769840318',
  appId: '1:896769840318:web:bb2e717b7e321e50b0baef',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function resetResults() {
  console.log('Resetting all declared results...');

  // 1. Delete all documents in 'results' collection
  const resultsSnap = await getDocs(collection(db, 'results'));
  let deleted = 0;
  for (const d of resultsSnap.docs) {
    await deleteDoc(doc(db, 'results', d.id));
    deleted++;
  }
  console.log(`Deleted ${deleted} result documents.`);

  // 2. Reset the summary document
  const emptySummary = {
    totalSeats: 300,
    declaredSeats: 0,
    requiredMajority: 151,
    partySeatCounts: [],
    totalVotesCast: 0,
    totalRegisteredVoters: 127711414,
    nationalTurnout: 0,
    lastUpdated: serverTimestamp(),
  };
  await setDoc(doc(db, 'summary', 'current'), emptySummary);
  console.log('Summary document reset.');

  console.log('Done! All results have been cleared.');
  process.exit(0);
}

resetResults().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
