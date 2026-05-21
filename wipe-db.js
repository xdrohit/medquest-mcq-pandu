const fs = require('fs');
const mongoose = require('mongoose');

const env = fs.readFileSync('.env.local', 'utf-8');
const lines = env.split(/\r?\n/);
let uri = '';
for(let line of lines) {
  if (line.startsWith('MONGODB_URI=')) {
    uri = line.substring(12).trim();
    break;
  }
}

async function wipe() {
  await mongoose.connect(uri);
  console.log('Connected to DB...');
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    if (collection.collectionName === 'users') continue; // keep admin and students!
    console.log(`Dropping ${collection.collectionName}...`);
    await collection.drop();
  }
  console.log('Wipe complete!');
  process.exit(0);
}
wipe();
