prochain = require 'prochain'
lodashGet = require 'lodash.get'
lodashSet = require 'lodash.set'

createProxy = (conn, path = []) -> new Proxy ->,
  get: (target, name) -> new Promise (rev, rej) ->
    now = path.concat name
    conn.send { type: 'get', path: now.join '.' }, (res) ->
      switch res.type
        when 'object' then rev createProxy(conn, path.concat name)
        when 'value' then rev res.value
        when 'error' then rej res.message
        else rej 'unknown type'
  set: (target, name, value) -> new Promise (rev, rej) ->
    now = path.concat name
    conn.send { type: 'set', path: now.join '.', value }, (res) ->
      switch res.type
        when 'ok' then rev value
        when 'error' then rej res.message
        else rej 'unknown type'
  apply: (target, that, args) -> new Promise (rev, rej) ->
    conn.send { type: 'invoke', path: path.join '.' , args }, (res) ->
      switch res.type
        when 'ok' then  rev res.value
        when 'error' then rej res.message
        else rej 'unknown type'


handleMessage = (data, conn, services, cb) ->
  if data.type == 'conn'
    service = services.get data.name
    if !services
      cb { type: 'error', message: 'unknown service' }
      conn.close()
      return
    service[1]? createProxy conn
    conn.name = data.name
    cb { type: 'ok' }
    return
  service = services.get conn.name
  switch data.type
    when 'get'
      value = await lodashGet service[0], data.path
      if ['object', 'function'].includes typeof value
        cb { type: 'object' }
      else
        cb { type: 'value', value }
    when 'set'
      lodashSet service[0], data.path
      cb { type: 'ok' }
    when 'invoke'
      value = await lodashGet service[0], data.path
      if typeof value != 'function'
        cb { type: 'error', message: 'value is not a function' }
        return
      res = await value.apply null, data.args
      cb { type: 'ok', value: res}

module.exports = class RPC
  services: new Map()
  connected: (conn, name = 'server') =>
    conn.send { type: 'conn', name }, (res) -> throw res.message if res.type == 'error'
    conn.on 'message', (data, cb) =>
      try
        await handleMessage(data, conn, @services, cb)
      catch e
        cb { type: 'error', message: e.toString() }
    conn.on 'disconnect', (reason) => @services.get(conn.name)?[2]? conn, reason
  createService: (name, obj, onConnect, onDisconnect) =>
    @services.set name, [
      obj
      (obj) -> onConnect prochain.wrap new Promise (rev) -> rev obj
      onDisconnect
    ]
  getServer: (obj = null) =>
    return prochain.wrap new Promise (rev) => @services.set 'server', [obj, rev]