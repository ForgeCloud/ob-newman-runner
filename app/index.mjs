import newman from 'newman'
import commandLineArgs from 'command-line-args'
import { getCollection, getCollectionJSON } from './collection'
import { getEnv, getEnvJSON } from './environment'
import evilDns from 'evil-dns';

const optionDefinitions = [
  { name: 'collection', alias: 'c', type: String },
  { name: 'environment', alias: 'e', type: String },
  {
    name: 'updateEnvironment', alias: 'u', multiple: true, type: tuple => {
      const t = {}
      t[tuple.split("=")[0]] = tuple.split("=")[1]
      return t
    }
  },
]

function runNewman(collectionJSON, envJSON) {
  newman.run({
    collection: collectionJSON,
    environment: envJSON,
    reporters: 'cli',
    insecure: true
  }).on('start', function (err, args) { // on start of run, log to console
    console.log('running a collection...');
  }).on('done', function (err, summary) {
    if (err || summary.error) {
      console.error('collection run encountered an error.');
    }
    else {
      console.log('collection run completed.');
    }
  });
}

function overrideDNS(domain,ip) {
  evilDns.add('*.' + domain, ip);
  console.warn('WARNING: ' + domain + ' overridden to IP ' + ip);
}

function checkArgs(options) {
  const valid = process.env.POSTMAN_API_TOKEN && options.collection && options.environment
  const overRideIpValid = ! process.env.OVERRIDE_IP || (process.env.OVERRIDE_IP && process.env.DOMAIN)
  if (!valid || !overRideIpValid) {
    console.log(`
  Required options not set.

  POSTMAN_API_TOKEN: Required environment variable | API token for postman
  OVERRIDE_IP: Optional environment variable | override DNS queries to DOMAIN with this IP
  DOMAIN: Required environment variable if OVERRIDE_IP is set | override DNS queries to this if OVERRIDE_IP is set
  collection, c: Required argument | Regex match of the collection name
  environment, e: Required argument | Regex match of the environment name
  updateEnvironment, u: Optional argument | Key value pairs of environment variables to override

  Example
    newman-runner -c master -e master-dev -u DOMAIN=example.com

  Example with Ip override
    export POSTMAN_API_TOKEN=abc123
    export OVERRIDE_IP=10.11.12.13
    export DOMAIN=example.com
    newman-runner -c master -e master-dev -u DOMAIN=example.com


  `)
    process.exit(1)
  }
}

async function main() {
  const options = commandLineArgs(optionDefinitions)
  checkArgs(options)

  if (process.env.OVERRIDE_IP)
    overrideDNS(process.env.DOMAIN, process.env.OVERRIDE_IP);

  try {
    const env = await getEnv(options.environment.toLowerCase())
    const envJSON = await getEnvJSON(env.uid, options.updateEnvironment || [])
    const collection = await getCollection(options.collection.toLowerCase())
    const collectionJSON = await getCollectionJSON(collection.id)
    console.log(`Running newman environment=${env.name} collection=${collection.name} collection_id=${collection.id}`)
    runNewman(collectionJSON, envJSON)
  } catch (error) {
    console.log(`${error}`)
    process.exit(1)
  }
}

main()