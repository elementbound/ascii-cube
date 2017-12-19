const process = require('process')
const conutil = require('./conutil.js')
const Buffer = require('./buffer.js')
const cube = require('./cube.js')

conutil.apply(console)

let cubeState = {
    rot: [0,0],
    vel: [90, 90],
    timeout: 1000/30
}

var buffer = new Buffer(160,48)

let update = (state) => {
    state.rot[0] = (state.rot[0] + state.vel[0] * state.timeout / 1000) % 360
    state.rot[1] = (state.rot[1] + state.vel[1] * state.timeout / 1000) % 360

    console.repos()
    buffer.fill()

    cube(buffer, ...state.rot)
    buffer.present()
}

console.reset()
setInterval(update.bind(null, cubeState), cubeState.timeout)