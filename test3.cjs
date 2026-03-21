const axios = require('axios');
async function run() {
  try {
    const res = await axios.get('https://airbnb19.p.rapidapi.com/api/v1/searchPropertyByPlace', {
      params: { id: 'ChIJD7fiBh9u5kcRYJSMaMOCCwQ' },
      headers: {
        'x-rapidapi-key': 'fd31f45be5msh8a17df19bd6bd2bp16b6acjsn525b54d714bb',
        'x-rapidapi-host': 'airbnb19.p.rapidapi.com'
      }
    });
    console.log("Status:", res.status);
    console.log("Keys:", Object.keys(res.data));
    console.log("Data details:", JSON.stringify(res.data).slice(0, 100));
  } catch (e) {
    console.log("Error status:", e.response?.status, e.response?.data);
  }
}
run();
