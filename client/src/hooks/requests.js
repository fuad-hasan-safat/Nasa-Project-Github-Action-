const API_URL = 'http://localhost:8000';

async function httpGetPlanets() {
  const response = await fetch(`${API_URL}/planets`);
  const fetchedLaunches = await response.json();
  console.log(fetchedLaunches);
  return fetchedLaunches.sort((a,b) => {
    return a.flightNumber - b.flightNumber;
  });
}

async function httpGetLaunches() {
  const response = await fetch(`${API_URL}/launches`);
  const data = await response.json();
  console.log("Launches data --> ",data);
  return data;
}

async function httpSubmitLaunch(launch) {

  try{
    const response = await fetch(`${API_URL}/launches`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(launch),
    });
    return response;
   
  }catch (error) {
    console.error('Error submitting launch:', error);
    return {
      ok: false,
    };
  }

}

// Delete launch with given ID.
async function httpAbortLaunch(id) {
  try{
    return await fetch(`${API_URL}/launches/${id}`, {
      method: 'DELETE',
    });

  }catch (error) {
    console.error('Error aborting launch:', error);
    return {
      ok: false,
    };
  }
}

export {
  httpGetPlanets,
  httpGetLaunches,
  httpSubmitLaunch,
  httpAbortLaunch,
};