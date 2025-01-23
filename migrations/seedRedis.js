const fs = require('fs');
const path = require('path');
const redisClient = require('../utils/redisClient');

// Load dictionary to Redis
const seedRedis = async () => {
  try {
    const dictionaryPath = path.join(__dirname, '../data/dictionary.txt');
    if (!fs.existsSync(dictionaryPath)) {
      console.error('Dictionary file not found at:', dictionaryPath);
      process.exit(1);
    }

    const data = fs.readFileSync(dictionaryPath, 'utf8');
    const words = data.split(/\r?\n/).filter(Boolean);

    console.log(`Seeding ${words.length} words into Redis...`);

    const multi = redisClient.multi(); // Start a batch operation

    words.forEach((word) => {
      multi.sAdd('dictionary', word.toLowerCase());
    });

    await multi.exec(); // Execute all commands in the batch
    console.log('Dictionary successfully seeded into Redis.');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding Redis:', error);
    process.exit(1);
  }
};

seedRedis();
