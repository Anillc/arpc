import RPC from './rpc'
import io, { Server } from 'socket.io'

export default function(serverOrPort: Server | number, path = '/rpc') {
    if(typeof(serverOrPort) === 'number') {
        serverOrPort = new Server(serverOrPort, { path })
    }
    let rpc = new RPC
    serverOrPort.on('connection', rpc.connected)
    return rpc
}