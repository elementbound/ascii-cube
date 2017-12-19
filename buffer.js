const { lerp, zip, normalize, vecdir2 } = require('./utils.js')

class Buffer {
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

    line(from, to, c) {
        let manhattan_length = Math.abs(from[0] - to[0]) + Math.abs(from[1] - to[1])

        if(c == undefined) {
            let dir = zip(from, to).map(p => p[1]-p[0])
            dir = normalize(dir)
            dir = vecdir2(dir)

            let d = "─╱│╲─╱│╲─".split('')
            let i = Math.round(dir/45)
            c = d[i]
        }

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

module.exports = Buffer