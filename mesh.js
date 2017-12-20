const Mesh = (points, links) =>
    ({points, links})
    
const draw = (buffer, mesh, model, projection) => {
    let points = mesh.points
        .map(model)
        .map(projection)

    let links = mesh.links

    links.forEach(l => 
        buffer.line(points[l[0]], points[l[1]])
    )

    points.forEach(p => 
        buffer.set(p[0],p[1], '○')
    )
}

module.exports = {
    Mesh,
    draw
}