import axios from 'axios'

export async function getCollection(env) {
  const resp = await axios.get("https://api.getpostman.com/collections", {
    headers: {
      "X-Api-Key": process.env.POSTMAN_API_TOKEN
    }
  })
  const matchingCollections = []
  resp.data.collections.forEach(element => {
    if (element.name.toLowerCase().match(env)) {
      matchingCollections.push(element)
    }
  });
  if (matchingCollections.length > 1) {
    const envNames = matchingCollections.map(e => e.name)
    throw new Error(`Found more than one matching collection [${envNames.toString()}]`)
  } else if (matchingCollections.length == 0) {
    throw new Error("Found no matching collection")
  }
  return matchingCollections[0]
}

export async function getCollectionJSON(id) {
  const resp = await axios.get(`https://api.getpostman.com/collections/${id}`, {
    headers: {
      "X-Api-Key": process.env.POSTMAN_API_TOKEN
    }
  })
  return resp.data.collection
}