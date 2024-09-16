const jwt = require('jsonwebtoken');

const KID = '1231312'// using it to query in DB to get public key

const PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA2qn1WOM1r1ewQEb9b6n+
FpTglaDlDyf9/qVMIcLpRLANwIFeikMgKjH14ha26eylONcizgtBLA4KA60B1A3F
b8l8NJ0iqYirX5XFZ+dSf7yiDE4wtgxzztnFb4vG3VFkbpkYVxTlyzoJLUSvBWYh
ZQetUVZfcuzy+a830yws7qJG2PGLYlhe7rVtuSPV6nnvFrn9KW1EMb7PYODZnheT
+elTodELn+7Nfy4dkTAAjSj7HJ6k36Byu3ovRjCt5w3XYeSXAAmaNSHqW4lUl6dK
IvKmJt9NlkM9a3Ptcd2TslXvlw5pItTFjL+/kb+787Lxm4jovGdL514dUlmMjsWo
RwIDAQAB
-----END PUBLIC KEY-----`

const PRIVATE_KEY = `-----BEGIN RSA PRIVATE KEY-----
MIIEpQIBAAKCAQEA2qn1WOM1r1ewQEb9b6n+FpTglaDlDyf9/qVMIcLpRLANwIFe
ikMgKjH14ha26eylONcizgtBLA4KA60B1A3Fb8l8NJ0iqYirX5XFZ+dSf7yiDE4w
tgxzztnFb4vG3VFkbpkYVxTlyzoJLUSvBWYhZQetUVZfcuzy+a830yws7qJG2PGL
Ylhe7rVtuSPV6nnvFrn9KW1EMb7PYODZnheT+elTodELn+7Nfy4dkTAAjSj7HJ6k
36Byu3ovRjCt5w3XYeSXAAmaNSHqW4lUl6dKIvKmJt9NlkM9a3Ptcd2TslXvlw5p
ItTFjL+/kb+787Lxm4jovGdL514dUlmMjsWoRwIDAQABAoIBAQCQxvcrY0SoU+be
qCIlTOhvCyOn7l+7KT+C2u8Na4AHeomgbAesg8VIKswiZee1+nlqqQbiZZFBGgqH
ZIVRYczXtxAFxgStO1A8eW263e5BpSOmAh8+agBDdOzEbke9Qaa9k6AKCEwdws9Q
qak4aeayfeLDd+y6qyg1KU5NA3K8jHwFB/BGuDVkHhRDTUTwNYrFFbAuTV1Yq6XX
OPsqdZRiTqGY09oNMqp9CYxqQI77BrwIvJxEJZlpna6f8M/fhoUam6m0qumvoqg6
W/FVwJ9GCl0YtTym6mlEp8KAaH0Sq1O8FXv0NMsfBLqcOENt51sKJVNThzFGEmnR
kNpEHxwBAoGBAPAkXBLKFK+g5Adm9XdE4A9CRH2tMOW2EqOu/alCk2MLBRdpNHV8
152XLvodmjdK+pPinwLBCNgiGgpRBtRMezMgXHTWxkyXgsMLpO4cl/i35Z8cOKwB
u1LEBpEakI3ksYkEBxVF5y2L+jUjxcx760+OnfdasuGRI2Z4KuYs79KbAoGBAOka
geZiaLXu7iQMIXu8SdtUpSL0UjM25lOzl/EXpErYaF2X0wkatXFS7DQjFXLRiLKm
yQsVJERrvaQ3bqpPTVQDakdyA7DDTpaG/pK9+Xuq/njdO6ZSmfHtjout5BHqGZoS
B8CMl+MGV4NwUbmgTmBv14Mrjd+vsb9TCiS/g7XFAoGBALL21etm0J3GsMnXcC3P
lY+pmjNzA9LdquxzeDVRGVghmUzGKcM5I9MdHXRm5Uw5w568sDY0N+wjFfcERaun
x9TlVCH7AdOIwnmrTuHpS1SfcC/wr0d5DupyjlZLTtmAStLKvqCa9Ntbyz8ZBssK
uuYSaiUyYcd7C7/M5GOfr6brAoGBAJh4aS07g0g1T3kuohwgTaL0G8vgSYAMUd2/
5Aujrifyo1lMvJIA8Vt9pNh5dkcS/Tn11By2qHFEk9e9Flq54leooDS5Q+az6UyW
Yh+zuWMFtstx0dl5wA45l3qPtFVvbW2Ui5OLorGxbT6hEiO70mhL34iBzZvZfQcr
FsBwsIMNAoGAWYpxYfPC756kWys3HEIqYrOmqXWEELKvUL/PXJSeSir7AQyW/1OZ
e5TEjzEsJOcSreL8g0zFCc8VLkviNVn3hdgwXCZQg26hhHeTNvD4ITP+kokFzsRD
P0cQoU/9ofwwIK0UAl1u75ZH+8y42O4fr7lOOZRQAUKuv0IYYnKfo8o=
-----END RSA PRIVATE KEY-----`

const randomNone = (length) => {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += charset.charAt(Math.floor(Math.random() * charset.length))
  }
  return result
}


const generateESignature = async (payload, kid) => {
  const eSignature = await jwt.sign(payload, PRIVATE_KEY, { algorithm: 'RS256', expiresIn: '24H', header: { kid } })
  return eSignature
}

const verifyESignature = async (eSignature) => {
  const { header, payload } = await jwt.decode(eSignature, { complete: true })
  // find kid by query in DB
  // const {kid} = header
  // const queryDBPublicKey = await db?.findPublicKeyByKid(kid)
  /* check timestamp and none */
  if (payload.none === undefined) {
    throw new Error('none is required')
  }
  if (payload.timestamp === undefined) {
    throw new Error('timestamp not found')
  }
  if (new Date().getTime() - payload.timestamp > 60 * 60 * 1000) {
    throw new Error('invalid timestamp')
  }
  if (!payload.none) {
    throw new Error('invalid none')
  }
  /* 
    redis.get(`none:${payload.none}`)
    if (none is existed) {
      throw new Error('invalid none')
    }
    else{
      redis.set(`none:${payload.none}`, true, 60*60)
    }
  */
  const result = await jwt.verify(eSignature, PUBLIC_KEY, { algorithms: 'RS256' })
  return result
}

generateESignature({
  userId: 12,
  email: 'ndthang0000@gmail.com',
  timestamp: new Date().getTime(),
  nonce: randomNone(4)
}, KID)
  .then(async (data) => {
    console.log({ JWT: data })
    const verify = await verifyESignature(data)
    console.log({ resultVerify: verify })
    return data
  })