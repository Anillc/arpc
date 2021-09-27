import { wrap } from 'prochain'
import lodashGet from 'lodash.get'
import lodashSet from 'lodash.set'

type Socket = import('socket.io').Socket | import('socket.io-client').Socket

type Msg = {
    type: 'get'
    path: string
} | {
    type: 'set'
    path: string
    value: string | number | boolean
} | {
    type: 'invoke'
    path: string
    args: (string | number | boolean)[]
} | {
    type: 'object'
} | {
    type: 'value'
    value: string | number | boolean
} | {
    type: 'error'
    message: string
} | {
    type: 'ok'
    value: string | number | boolean
}

type RemoteObject = {
    [name: string]: RemoteObject
    (...args: (string | number | boolean)[]): RemoteObject
} & Promise<string | number | boolean>

function createProxy(conn: Socket, path: string[] = []) {
    let get = (target: any, name: string) => new Promise((rev, rej) => {
        let msg: Msg = {
            type: 'get',
            path: path.concat(name).join('.')
        }
        conn.send(msg, (res: Msg) => {
            switch (res.type) {
                case 'object':
                    rev(createProxy(conn, path.concat(name)))
                    break
                case 'value':
                    rev(res.value)
                    break
                case 'error':
                    rej(res.message)
                    break
                default:
                    rej('unknown type')
            }
        })
    })
    let set = (target: any, name: string, value: string | number | boolean) => (new Promise((rev, rej) => {
        let msg: Msg = {
            type: 'set',
            path: path.concat(name).join('.'),
            value
        }
        conn.send(msg, (res: Msg) => {
            if(res.type === 'error') {
                rej(res.message)
            } else if (res.type !== 'ok') {
                rej('unknown type')
            }
        })
    }), true)
    let apply = (target: any, that: any, args: (string | number | boolean)[]) => new Promise((rev, rej) => {
        let msg: Msg = {
            type: 'invoke',
            path: path.join('.'),
            args
        }
        conn.send(msg, (res: Msg) => {
            switch(res.type) {
                case 'ok':
                    rev(res.value)
                    break
                case 'error':
                    rej(res.message)
                    break
                default:
                    rej('unknown type')
            }
        })
    })
    return new Proxy(function () { }, { get, set, apply }) as RemoteObject
}