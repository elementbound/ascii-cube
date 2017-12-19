const process = require('process')

const lerp = (a,b, x) => 
    (1-x)*a + x*b

const dirvec3 = (rotx, roty) => 
    [Math.cos(roty) * Math.cos(rotx),
     Math.sin(roty) * Math.cos(rotx),
     Math.sin(rotx)]

console.reset = () => 
    process.stdout.write('\033c')

console.repos = () =>
    process.stdout.write('\x1B[0f')

// degrees to radians
const dtr = x => 
    x / 180 * Math.PI

const cross = (u,v) => 
    [
        u[1]*v[2] - u[2]*v[1],
        u[2]*v[0] - u[0]*v[2],
        u[0]*v[1] - u[1]*v[0]
    ]

const zip = (a, b) => {
    let short = (a.length < b.length) ? a : b
    let long = (a.length < b.length) ? b : a
    return short.map((v, i) => [short[i], long[i]])
}

const dot = (a, b) => 
    zip(a,b)
        .map(v => v[0]*v[1])
        .reduce((x,y) => x+y)

const veclen = vec => 
    Math.sqrt(dot(vec, vec))

const normalize = vec => 
    vec.map(v => v / veclen(vec))

const rotAxes = (rotx, roty) => {
    let front = dirvec3(rotx, roty)
    let right = dirvec3(0   , roty+90)
    let up = cross(front, right)
    right = cross(front, up)

    return [
        normalize(right),
        normalize(front),
        normalize(up)
    ]
}

class Window {
    constructor(width, height) {
        this.width = width
        this.height = height
        this.buffer = Array(width*height).fill(' ')
    }

    _at(x, y) {
        return y*this.width + x
    }

    fill(c = ' ') {
        this.buffer.fill(c)
    }

    set(x, y, c) {
        x = Math.round(x)
        y = Math.round(y)

        this.buffer[this._at(x,y)] = c
    }

    text(x,y, text) {
        text.toString().split('').forEach(c => 
            this.set(x++,y, c)
        )
    }

    line(from, to, c='x') {
        let manhattan_length = Math.abs(from[0] - to[0]) + Math.abs(from[1] - to[1])

        for(let i = 0; i < manhattan_length; ++i) {
            let f = i / manhattan_length
            let px = lerp(from[0], to[0], f)
            let py = lerp(from[1], to[1], f)

            this.set(px, py, c)
        }
    }

    present() {
        for(let y = 0; y < this.height; ++y) {
            console.log(this.buffer.slice(y*this.width, (y+1)*this.width).join(''))
        }
    }
}

function cube(window, rotx, roty) {
    rotx = dtr(rotx)
    roty = dtr(roty)

    let points = [
        [-1,+1,-1],
        [+1,+1,-1],
        [-1,+1,+1],
        [+1,+1,+1],

        [-1,-1,-1],
        [+1,-1,-1],
        [-1,-1,+1],
        [+1,-1,+1],
    ]

    let links = [
        [0, 1],
        [0, 2],
        [1, 3],
        [2, 3],
        
        [4, 5],
        [4, 6],
        [5, 7],
        [6, 7],
        
        [0, 4],
        [1, 5],
        [2, 6],
        [3, 7]
    ]

    let axes = rotAxes(rotx, roty)
    
    // Model transform
    points = points.map(p => 
        [
            p[0] * axes[0][0] + p[1] * axes[1][0] + p[2] * axes[2][0], 
            p[1] * axes[0][1] + p[1] * axes[1][1] + p[2] * axes[2][1], 
            p[2] * axes[0][2] + p[1] * axes[1][2] + p[2] * axes[2][2], 
        ]
    )

    // Projection transform
    let middle = [window.width / 2, window.height / 2]
    let size = Math.min(window.width, window.height) / 4

    points = points.map(p => 
        [
            middle[0] + p[0] * size,
            middle[1] + p[2] * size
        ]
    )

    // Draw
    links.forEach(l => 
        window.line(points[l[0]], points[l[1]], '+')
    )

    points.forEach(p => 
        window.set(p[0],p[1], 'O')
    )
}

let cubeState = {
    rot: [0,0],
    vel: [22.5, 0],
    timeout: 1000/0.5
}

var buffer = new Window(160,48)

let update = () => {
    cubeState.rot[0] = (cubeState.rot[0] + cubeState.vel[0] * cubeState.timeout / 1000) % 360
    cubeState.rot[1] = (cubeState.rot[1] + cubeState.vel[1] * cubeState.timeout / 1000) % 360

    console.repos()
    buffer.fill()
    buffer.text(0,0, cubeState.rot)
    buffer.text(0,1,rotAxes(...cubeState.rot)[0])
    buffer.text(0,2,rotAxes(...cubeState.rot)[1])
    buffer.text(0,3,rotAxes(...cubeState.rot)[2])

    cube(buffer, ...cubeState.rot)
    buffer.present()
}

console.reset()
setInterval(update, cubeState.timeout)