const { rotAxes } = require('./utils.js')

function cube(window, rotx, roty) {
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
    size = [size, size/2]

    points = points.map(p => 
        [
            middle[0] + p[0] * size[0],
            middle[1] + p[2] * size[1]
        ]
    )

    // Draw
    links.forEach(l => 
        window.line(points[l[0]], points[l[1]])
    )

    points.forEach(p => 
        window.set(p[0],p[1], '○')
    )
}

module.exports = cube