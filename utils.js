const lerp = (a,b, x) => 
    (1-x)*a + x*b

const dirvec3 = (rotx, roty) => {
    rotx = dtr(rotx)
    roty = dtr(roty)

    return [
        Math.cos(roty) * Math.cos(rotx),
        Math.sin(roty) * Math.cos(rotx),
        Math.sin(rotx)
    ]
}

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

module.exports = {
    lerp, 
    dtr,
    cross,
    dirvec3,
    rotAxes,
    dot,
    veclen,
    normalize,
    zip
}