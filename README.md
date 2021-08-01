# arpc
a node RPC library based on [socket.io](https://socket.io)

## examples

```JavaScript
const server = require('arpc/server')(2333)
server.createService('test', {
    a: [() => {
        return 233
    }]
})
```

```JavaScript
(async function(){
    const client = require('arpc/client')
    let obj = client('ws://127.0.0.1:2333', 'test')
    console.log(await obj.a[0]())
    //output: 233
})()
```

## API

### client `require('arpc/client')`
`client(socketOrUrl, name, obj = null, path = '/rpc')`
- parameters
  - `socketOrUrl: Socket | string`
  - `obj: any` object for the calling from the server
  - `path: string` the path for socket.io (invalided if you passed a socket at the first parameter). this can be a secret token for rpc connection
- return
  `: Promise` a object which can call the remote object with a [prochain](https://github.com/Shigma/prochain) way (see [examples](#examples))

### server `require('arpc/server')`
`server(ioOrPort, path = '/rpc')`
- parameters
  - `ioOrPort: Server | number`
  - `path: string` the same as the client api
- return
  `: RPC` the rpc object

### RPC `require('arpc')`
- constructor
  `new RPC()`
- metheds
  - `connected(conn, name = 'server')` call this when sockets connected
    - parameters
      - `conn: Socket`
      - `name: string` the service we request the other side
  - `createService(name, obj, onConnect, onDisconnect)`
    - `name: string` the name of the service we create
    - `obj: any` the object we provide for the remote calling
    - `onConnected: (object: Promise) => undefined` (optional) the function which will be called when a client connects
    - `onDisconnect: (socket: Socket, reason: string) => undefined` (optional) the function which will be called when a client disconnects
  - `getServer(obj = null)` creates a remote object from the server
    - paramaters
      - `obj: any` the object we provide for the remote calling
    - return
      `: Promise` the remote object from the server

## license
MIT