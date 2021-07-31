# arpc  
a node RPC library base on socket.io

## examples  

```JavaScript
const server = require('arpc/server')(2333)
server.createService('test',{
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

## apis  
TODO  

## license  
MIT