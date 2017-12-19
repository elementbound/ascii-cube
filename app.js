const process = require('process')
const conutil = require('./conutil.js')
const Buffer = require('./buffer.js')
const cube = require('./cube.js')
const { rotAxes } = require('./utils.js')

console.log(conutil)
console.log(Buffer)

conutil.apply(console)

var cubeState = {
    rot: [0,0],
    vel: [180, 0],
    timeout: 1000/30
}

var buffer = new Buffer(160,48)

let update = () => {
    cubeState.rot[0] = (cubeState.rot[0] + cubeState.vel[0] * cubeState.timeout / 1000) % 360
    cubeState.rot[1] = (cubeState.rot[1] + cubeState.vel[1] * cubeState.timeout / 1000) % 360

    console.repos()
    buffer.fill()
    //buffer.text(0,0, cubeState.rot)
    //buffer.text(0,1,rotAxes(...cubeState.rot)[0])
    //buffer.text(0,2,rotAxes(...cubeState.rot)[1])
    //buffer.text(0,3,rotAxes(...cubeState.rot)[2])

    cube(buffer, ...cubeState.rot)
    buffer.present()
}

//console.reset()
setInterval(update, cubeState.timeout)