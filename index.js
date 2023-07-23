const { Client } = require("@elastic/elasticsearch")
const config = require("config")
//const elasticConfig = config.get("elastic")
const elasticConfig = config.get("elastic-cloud")

/*
const client = new Client({
  cloud: {
    id: elasticConfig.cloudID
  },
  auth: {
    username: elasticConfig.username,
    password: elasticConfig.password
  }
})
*/

const client = new Client({
    cloud: {
      id: elasticConfig.cloudID
    },
    auth: {
      apiKey: elasticConfig.apiKey
    }
})

client.info()
  .then(response => console.log(response))
  .catch(error => console.error(error))

async function run() {
    await client.index({
      index: 'game-of-thrones',
      body: {
        character: 'Ned Stark',
      quote: 'Winter is coming.'
      }
    })
  
    await client.index({
      index: 'game-of-thrones',
      body: {
        character: 'Daenerys Targaryen',
      quote: 'I am the blood of the dragon.'
      }
    })
  
    await client.index({
      index: 'game-of-thrones',
      body: {
        character: 'Tyrion Lannister',
      quote: 'A mind needs books like a sword needs whetstone.'
      }
    })
  
    await client.indices.refresh({index: 'game-of-thrones'})
}
  
run().catch(console.log)

async function read() {
    const { body } = await client.search({
      index: 'game-of-thrones',
      body: {
        query: {
          match: { quote: 'winter' }
        }
      }
    })
    console.log(body.hits.hits, "61")
  }
  
  read().catch(console.log)


  async function update() {
    await client.update({
      index: 'game-of-thrones',
      id: "bZXLX4kBbbq88Rk6NgB2",
      body: {
        script: {
          source: "ctx._source.birthplace = 'Winterfell'"
        }
      }
    })
    const { body } = await client.get({
      index: 'game-of-thrones',
      id: "bZXLX4kBbbq88Rk6NgB2"
    })
  
    console.log(body, "d")
  }
  update().catch(console.log)

/*
  async function generateApiKeys (opts) {
    const { body } = await client.security.createApiKey({
      body: {
        name: 'nodejs_example',
        role_descriptors: {
          'nodejs_example_writer': {
            'cluster': ['monitor'],
            'index': [
              {
                'names': ['game-of-thrones'],
                'privileges': ['create_index', 'write', 'read', 'manage']
              }
            ]
          }
        }
      }
    })
  
    return Buffer.from(`${body.id}:${body.api_key}`).toString('base64')
  }

  
  
  generateApiKeys()
    .then(console.log)
    .catch(err => {
    process.exit(1)
  })
  */
  
  
