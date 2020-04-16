import axios from 'axios'

export async function getCollection(env) {
  const matchingCollections = []
  try {
    const resp = await axios.get("https://api.getpostman.com/collections", {
      headers: {
        "X-Api-Key": process.env.POSTMAN_API_TOKEN
      }
    }).then(function (response) {
      //console.log(response.data)
      return response
    })
    resp.data.collections.forEach(element => {
      if (element.name.toLowerCase().match(env)) {
        //console.log(`push=${element.name}`)
        matchingCollections.push(element)
      }
    });
  } catch (error) {
    console.log(`Could not get collections error=${error}`)
  }
  //console.log(matchingCollections)
  if (matchingCollections.length > 1) {
    const envNames = matchingCollections.map(e => e.name)
    console.log(`envNames=${envNames}`)
    throw new Error(`Found more than one matching collection [${envNames.toString()}]`)
  } else if (matchingCollections.length == 0) {
    throw new Error("Found no matching collection")
  }
  return matchingCollections[0]
}

export async function getCollectionJSON(id) {
  try {
    const resp = await axios.get(`https://api.getpostman.com/collections/${id}`, {
      headers: {
        "X-Api-Key": process.env.POSTMAN_API_TOKEN
      }
    })
    return resp.data.collection
  } catch (error) {
    console.log(`Could not get collection JSON id=${id} error=${error}`)
  }
}