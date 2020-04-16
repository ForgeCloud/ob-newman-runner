import axios from 'axios'

export async function getEnv(env) {
  try {
    const resp = await axios.get("https://api.getpostman.com/environments", {
      headers: {
        "X-Api-Key": process.env.POSTMAN_API_TOKEN
      }
    }).then(function (response) {
      //console.log(response.data)
      return response
    })
    const matchingEnvs = []
    resp.data.environments.forEach(element => {
      if (element.name.toLowerCase().match(env)) {
        matchingEnvs.push(element)
      }
    });
    if (matchingEnvs.length > 1) {
      const envNames = matchingEnvs.map(e => e.name)
      throw new Error(`Found more than one matching environment [${envNames.toString()}] env=${env}`)
    } else if (matchingEnvs.length == 0) {
      throw new Error(`Found no matching environment env=${env}`)
    }
    return matchingEnvs[0]
  } catch (error) {
    throw new Error(`Could not get environments error=${error}`);
  }
}

export async function getEnvJSON(id, updates) {
  try {
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
  } catch (error) {
    throw new Error(`Could not get environment JSON id=${id} error=${error}`);
  }
}