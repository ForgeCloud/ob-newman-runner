# Newman runner

A wrapper for newman with added features.

* Run collection by name of collection or regex match of the name of collection
* Use environment by name of environment or regex match of the name of environment
* Override environment variables

POSTMAN_API_TOKEN: Required environment variable | API token for postman
collection, c: Required argument | Regex match of the collection name
environment, e: Required argument | Regex match of the environment name
updateEnvironment, u: Optional argument | Key value pairs of environment variables to override

Example
newman-runner -c master -e master-dev -u DOMAIN=example.com