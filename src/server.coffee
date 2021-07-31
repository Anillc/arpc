RPC = require './rpc'
socketio = require 'socket.io'

module.exports = (ioOrPort, path = '/rpc') ->
  if typeof ioOrPort == 'number'
    io = socketio ioOrPort, { path }
  else
    io = ioOrPort
  rpc = new RPC
  io.on 'connection', rpc.connected
  return rpc