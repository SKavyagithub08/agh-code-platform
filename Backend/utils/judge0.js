const axios = require('axios');

const JUDGE0_BASE_URL = 'https://judge0-ce.p.rapidapi.com';
const RAPIDAPI_KEY = process.env.JUDGE0_API_KEY; // You need to store this in .env

const headers = {
  'Content-Type': 'application/json',
  'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
  'X-RapidAPI-Key': RAPIDAPI_KEY
};

/**
 * Submits code to Judge0 and returns a token.
 */
const submitToJudge0 = async ({ source_code, language_id, stdin = '' }) => {
  try {
    const response = await axios.post(
      `${JUDGE0_BASE_URL}/submissions?base64_encoded=false&wait=false`,
      {
        source_code,
        language_id,
        stdin
      },
      { headers }
    );

    return response.data.token;
  } catch (error) {
    throw new Error('Judge0 submission failed: ' + error.message);
  }
};

module.exports = { submitToJudge0 };
