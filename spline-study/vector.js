export var vector4 =  {
    Create: function( x , y , z , w ) {
        return [ x , y , z , w ];
    },

    Sum: function( x , y , z , w ) {
        return [ this.x + x , this.y + y , this.z + z . this.w + w ];
    }, 
    Normalize: function(v) {
        var length = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
        if (length > 0.00001) {
            return [v[0] / length, v[1] / length, v[2] / length];
        } else {
            return [0, 0, 0];
        }   
    },
    Cross: function(a, b) {
        return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
    },
}

