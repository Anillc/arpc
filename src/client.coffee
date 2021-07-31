RPC = require './rpc'
io = require 'socket.io-client'

module.exports = (socketOrUrl, name, obj = null, path = '/rpc') ->
  if typeof socketOrUrl == 'string'
    socket = io socketOrUrl, { path }
  else
    socket = socketOrUrl
  rpc = new RPC
  serverPromise = rpc.getServer obj
  rpc.connected socket, name
  return serverPromise