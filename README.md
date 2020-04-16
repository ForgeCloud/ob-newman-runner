# Newman runner

A wrapper for newman with added features.

* Run collection by name of collection or regex match of the name of collection
* Use environment by name of environment or regex match of the name of environment
* Override environment variables

## Postman API access curl test
```
curl -H 'X-Api-Key:${POSTMAN_API_TOKEN}' https://api.getpostman.com/collections
curl -H 'X-Api-Key:${POSTMAN_API_TOKEN}' https://api.getpostman.com/environments
```

## Running

```
docker build . -t newman-runner 
docker run -e POSTMAN_API_TOKEN=****** newman-runner -e ${environment-regex-name} -c ${collection-regex-name}

# OR
yarn install
node -r esm app/index.mjs -e ${environment-regex-name} -c ${collection-regex-name} -u ${optional-argument}
```
```
#Examples
docker run -e POSTMAN_API_TOKEN=****** newman-runner -e OBRI.master..Generated. -c ^End.To.End.Tests..Generated.$ -u FORGEROCK_PLATFORM_DOMAIN=master.forgerock.financial

# OR
POSTMAN_API_TOKEN=***** node -r esm app/index.mjs -e OBRI.master..Generated. -c ^End.To.End.Tests..Generated.$ -u FORGEROCK_PLATFORM_DOMAIN=master.forgerock.financial
```
## Usage

```
POSTMAN_API_TOKEN: Required environment variable | API token for postman
collection, c: Required argument | Regex match of the collection name
environment, e: Required argument | Regex match of the environment name
updateEnvironment, u: Optional argument | Key value pairs of environment variables to override

Example
newman-runner -c master -e "master.*dev" -u DOMAIN=example.com
```