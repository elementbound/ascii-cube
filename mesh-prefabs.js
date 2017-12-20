const {Mesh} = require('./mesh.js')
const {dirvec3, range, vecdst} = require('./utils.js')

const Cube = () => {
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

    return Mesh(points, links)
}

const Icosahedron = () => {
    const golden_ratio = (1 + Math.sqrt(5)) / 2
    const g = golden_ratio

    let points = [
        [0, 1, g], [0,-1, g], [0, 1,-g], [0,-1,-g],
        [g, 0, 1], [g, 0,-1], [-g,0, 1], [-g,0,-1],
        [1, g, 0], [-1,g, 0], [1,-g, 0], [-1,-g,0],
    ]

    let links = []

    let points_with_ids = points.map((p,i) => [p, i])

    points.forEach((p, i) => {
        let closest_points = points_with_ids.sort((a, b) => 
            vecdst(p, a[0]) - vecdst(p, b[0])
        )

        let local_links = closest_points.slice(1,6)
            .map(pi => pi[1]) // Take the IDs
            .map(pi => [i, pi]) // Turn into a link

        links = links.concat(local_links)
    })

    links = links.map(l => 
        l[0] < l[1] ? 
        [l[0], l[1]] : 
        [l[1], l[0]]
    )

    links = links.filter((l, i, a) =>
        a.indexOf(l) === i
    )

    return Mesh(points, links)
}

module.exports = {
    Cube,
    Icosahedron
}