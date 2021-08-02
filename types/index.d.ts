type Socket = import('socket.io').Socket | import('socket.io-client').Socket

declare class RPC {
    services: Map<string, [any, (obj: Promise<any>) => undefined, (conn: Socket, reason: string) => undefined]>
    connected(conn: Socket, name?: string): undefined
    createService(name: string, obj: any, onConnect?: (obj: Promise<any>) => undefined, onDisconnect?: (conn: Socket, reason: string) => undefined): undefined
    getServer(obj?: any): Promise<any>
}

declare module 'arpc' {
    export = RPC
}

declare module 'arpc/client' {
    function client(socket: Socket, name: string, obj?: any, path?: string): Promise<any>
    function client(url: string, name: string, obj?: any, path?: string): Promise<any>
    export = client
}

declare module 'arpc/server' {
    function server(socket: Socket, path?: string): RPC
    function server(port: number, path?: string): RPC
    export = server
}