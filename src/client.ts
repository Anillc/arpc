import RPC from './rpc'
import { io, Socket } from 'socket.io-client'

export default function(socketOrUrl: Socket | string, name: string, obj = null, path = '/rpc') {
    if(typeof(socketOrUrl) === 'string') {
        socketOrUrl = io(socketOrUrl, { path })
    }
    let rpc = new RPC()
    let serverPromise = rpc.getServer(obj)
    rpc.connected(socketOrUrl, name)
    return serverPromise
}