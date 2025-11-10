export var vector4 =  {
    Create: function( x , y , z , w ) {
        return [ x , y , z , w ];
    },

    Sum: function( x , y , z , w ) {
        return [ this.x + x , this.y + y , this.z + z . this.w + w ];
    }
}