const {dirvec3, cross, normalize} = require('./utils.js')

const rotation = (rotx, roty) => {
    let front = dirvec3(rotx, roty)
    let right = dirvec3(0   , roty+90)
    let up = cross(front, right)
    right = cross(front, up)

    let axes = [
        normalize(right),
        normalize(front),
        normalize(up)
    ]

    return p => 
        [
            p[0] * axes[0][0] + p[1] * axes[1][0] + p[2] * axes[2][0], 
            p[1] * axes[0][1] + p[1] * axes[1][1] + p[2] * axes[2][1], 
            p[2] * axes[0][2] + p[1] * axes[1][2] + p[2] * axes[2][2], 
        ]
}

const ortho = (middle, size) => p => 
    [
        middle[0] + p[0] * size[0],
        middle[1] + p[2] * size[1]
    ]

module.exports = {
    rotation,
    ortho
}