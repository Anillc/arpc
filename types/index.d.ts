interface TheObject {
    [name: string]: AObject
    (...args: any[]): AObject
}
type AObject = TheObject & Promise<string | number | boolean>

type Socket = import('socket.io').Socket | import('socket.io-client').Socket

declare class RPC {
    services: Map<string, [any, (obj: AObject) => undefined, (conn: Socket, reason: string) => undefined]>
    connected(conn: Socket, name?: string): undefined
    createService(name: string, obj: any, onConnect?: (obj: AObject) => undefined, onDisconnect?: (conn: Socket, reason: string) => undefined): undefined
    getServer(obj?: any): AObject
}

declare module 'arpc' {
    export = RPC
}

declare module 'arpc/client' {
    function client(socket: Socket, name: string, obj?: any, path?: string): AObject
    function client(url: string, name: string, obj?: any, path?: string): AObject
    export = client
}

declare module 'arpc/server' {
    function server(socket: Socket, path?: string): RPC
    function server(port: number, path?: string): RPC
    export = server
}