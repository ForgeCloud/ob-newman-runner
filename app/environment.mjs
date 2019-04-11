import axios from 'axios'

export async function getEnv(env) {
  const resp = await axios.get("https://api.getpostman.com/environments", {
    headers: {
      "X-Api-Key": process.env.POSTMAN_API_TOKEN
    }
  })
  const matchingEnvs = []
  resp.data.environments.forEach(element => {
    if (element.name.toLowerCase().match(env)) {
      matchingEnvs.push(element)
    }
  });
  if (matchingEnvs.length > 1) {
    const envNames = matchingEnvs.map(e => e.name)
    throw new Error(`Found more than one matching environment [${envNames.toString()}]`)
  } else if (matchingEnvs.length == 0) {
    throw new Error("Found no matching environment")
  }
  return matchingEnvs[0]
}

export async function getEnvJSON(id, updates) {
  const resp = await axios.get(`https://api.getpostman.com/environments/${id}`, {
    headers: {
      "X-Api-Key": process.env.POSTMAN_API_TOKEN
    }
  })
  const environment = resp.data.environment
  updates.forEach(o => {
    environment.values.forEach(e => {
      const k = Object.keys(o)[0]
      if (e["key"] == k) {
        console.log(`Updating environment ${e["key"]}=${o[k]}`)
        e["value"] = o[k]
      }
    })
  })
  return resp.data.environment
}