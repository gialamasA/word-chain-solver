const redisClient = require('../utils/redisClient');

exports.findWordChain = async (req, res) => {
  const { start, target } = req.body;

  const startTime = Date.now(); // Start timing the request

  try {
    const dictionary = new Set(await redisClient.sMembers('dictionary'));

    if (!dictionary.has(start.toLowerCase()) || !dictionary.has(target.toLowerCase())) {
      console.log(`Word missing: start=${start}, target=${target}`);
      return res.status(404).json({ success: false, message: 'Start or target word is not in the dictionary.' });
    }

    const wordLength = start.length;
    const queue = [[start]];
    const visited = new Set([start]);

    while (queue.length > 0) {
      const path = queue.shift();
      const word = path[path.length - 1].split('');

      for (let pos = 0; pos < wordLength; pos++) {
        const originalChar = word[pos];

        for (let c = 'a'.charCodeAt(0); c <= 'z'.charCodeAt(0); c++) {
          word[pos] = String.fromCharCode(c);
          const newWord = word.join('');

          if (newWord === target.toLowerCase()) {
            const elapsedTime = Date.now() - startTime; // Calculate elapsed time

            // Log the request details to Redis
            const logEntry = {
              timestamp: new Date().toISOString(),
              userInput: { start, target },
              serverResponse: {
                status: 'success',
                message: 'Word chain found.',
                chain: [...path, newWord],
              },
              elapsedTime: `${elapsedTime}ms`,
              statusCode: 200,
            };
            await redisClient.rPush('logs', JSON.stringify(logEntry));

            return res.json({ success: true, chain: [...path, newWord] });
          }

          if (!dictionary.has(newWord) || visited.has(newWord)) continue;

          queue.push([...path, newWord]);
          visited.add(newWord);
        }

        word[pos] = originalChar;
      }
    }

    // Case: no word chain found
    const elapsedTime = Date.now() - startTime; // Calculate elapsed time

    // Log the request details to Redis
    const logEntry = {
      timestamp: new Date().toISOString(),
      userInput: { start, target },
      serverResponse: {
        status: 'error',
        message: 'No valid word chain found.',
        chain: [],
      },
      elapsedTime: `${elapsedTime}ms`,
      statusCode: 404,
    };
    await redisClient.rPush('logs', JSON.stringify(logEntry));

    res.status(404).json({ success: false, message: 'No valid word chain found.' });
  } catch (error) {
    console.error('Error fetching dictionary from Redis:', error);

    const elapsedTime = Date.now() - startTime; // Calculate elapsed time

    // Log the request details to Redis
    const logEntry = {
      timestamp: new Date().toISOString(),
      userInput: { start, target },
      serverResponse: {
        status: 'error',
        message: 'Internal server error.',
        chain: [],
      },
      elapsedTime: `${elapsedTime}ms`,
      statusCode: 500,
    };
    await redisClient.rPush('logs', JSON.stringify(logEntry));

    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};