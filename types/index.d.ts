type Socket = import('socket.io').Socket | import('socket.io-client').Socket
type RemoteObject = {
    [name: string]: RemoteObject
    (...args: any[]): RemoteObject
} & Promise<string | number | boolean>

declare class RPC {
    services: Map<string, [any, (obj: RemoteObject) => void, (conn: Socket, reason: string) => void]>
    connected(conn: Socket, name?: string): void
    createService(name: string, obj: any, onConnect?: (obj: RemoteObject) => void, onDisconnect?: (conn: Socket, reason: string) => void): void
    getServer(obj?: any): RemoteObject
}

declare module 'arpc' {
    export = RPC
}

declare module 'arpc/client' {
    function client(socket: Socket, name: string, obj?: any, path?: string): RemoteObject
    function client(url: string, name: string, obj?: any, path?: string): RemoteObject
    export = client
}

declare module 'arpc/server' {
    function server(socket: Socket, path?: string): RPC
    function server(port: number, path?: string): RPC
    export = server
}