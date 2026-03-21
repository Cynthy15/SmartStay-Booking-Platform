const axios = require('axios');
const fs = require('fs');

const sleep = ms => new Promise(r => setTimeout(r, ms));

const api = axios.create({
  baseURL: 'https://airbnb19.p.rapidapi.com',
  timeout: 10000,
  headers: {
    'x-rapidapi-key': 'fd31f45be5msh8a17df19bd6bd2bp16b6acjsn525b54d714bb',
    'x-rapidapi-host': 'airbnb19.p.rapidapi.com',
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  r => r,
  async (error) => {
    if (error.response?.status === 429) {
      console.log('rate limit, sleeping 3s');
      await sleep(3000);
      return api(error.config);
    }
    return Promise.reject(error);
  }
);

async function run() {
  try {
    console.log('fetching listings...');
    const listRes = await api.get('/api/v2/searchPropertyByPlaceId', { params: { placeId: 'ChIJD7fiBh9u5kcRYJSMaMOCCwQ', adults: 1 } });
    fs.writeFileSync('./list.json', JSON.stringify(listRes.data, null, 2));
    console.log('list fetched.');
  } catch(e) {
    if(e.response) {
       console.error(e.response.status, e.response.statusText);
       console.error(JSON.stringify(e.response.data, null, 2));
    } else {
       console.error(e.message);
    }
  }
}
run();
