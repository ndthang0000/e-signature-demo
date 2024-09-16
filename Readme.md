# E-Signature Demo

This guide demonstrates how to implement an E-Signature feature using RSA and JWT.

## Prerequisites

- Node.js installed
- Basic understanding of RSA and JWT

## Steps

### 1. Initialize Project

```bash
mkdir e-signature-demo
cd e-signature-demo
npm init -y
```

### 2. Install Dependencies

```bash
npm install jsonwebtoken
npm install node-rsa
```

### 3. Generate RSA Keys

```javascript
const NodeRSA = require('node-rsa');
const key = new NodeRSA({ b: 512 });

const privateKey = key.exportKey('private');
const publicKey = key.exportKey('public');
const kid='' //random distinct in DB

console.log('Private Key:', privateKey);
console.log('Public Key:', publicKey);
// and store it db
```

### 4. Create JWT Token

```javascript
const jwt = require('jsonwebtoken');

const payload = {
  data: 'This is a sample document',
  userId: 12,
  timestamp: new Date().getTime(), // it check time using of token
  nonce: randomNone(4) // only use one time by set nonce in redis cache
};

const token = jwt.sign(payload, privateKey, { algorithm: 'RS256',kid:'xxxxx' });

console.log('JWT Token:', token);
```

### 5. Verify JWT Token

```javascript
// get kid in header and query it in DB to get Public Key
const decoded = jwt.verify(token, publicKey, { algorithms: ['RS256'] });

console.log('Decoded Payload:', decoded);
if (new Date().getTime() - decoded.timestamp > 60 * 60 * 1000) {
    throw new Error('invalid timestamp')
}

/* 
    redis.get(`none:${payload.none}`)
    if (none is existed) {
      throw new Error('invalid none')
    }
    else{
      redis.set(`none:${payload.none}`,payload.none)
    }
  */
```

## Conclusion

You have successfully implemented a basic E-Signature feature using RSA and JWT.
