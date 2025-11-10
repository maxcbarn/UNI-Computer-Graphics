export var matrix4x4 = {
    Identity: function() {
        return [
            1 , 0 , 0 , 0 ,
            0 , 1 , 0 , 0 , 
            0 , 0 , 1 , 0 ,
            0 , 0 , 0 , 1 ,
        ]
    },
    Translation: function( x , y , z ) {
        return [
            1 , 0 , 0 , x ,
            0 , 1 , 0 , y , 
            0 , 0 , 1 , z ,
            0 , 0 , 0 , 1 ,
        ]
    },
    XRotation: function( angleInRadians ) {
        let c = Math.cos( angleInRadians );
        let s = Math.sin( angleInRadians );
    
        return [
        1, 0, 0, 0,
        0, c, -s, 0,
        0, s, c, 0,
        0, 0, 0, 1,
        ];
    },
    YRotation: function( angleInRadians ) {
        let c = Math.cos( angleInRadians );
        let s = Math.sin( angleInRadians );
    
        return [
        c, 0, s, 0,
        0, 1, 0, 0,
        -s, 0, c, 0,
        0, 0, 0, 1,
        ];
    },
    ZRotation: function(angleInRadians) {
        let c = Math.cos(angleInRadians);
        let s = Math.sin(angleInRadians);
    
        return [
        c, -s, 0, 0,
        s, c, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1,
        ];
    },
    Scaling: function(sx, sy, sz) {
        return [
        sx, 0,  0,  0,
        0, sy,  0,  0,
        0,  0, sz,  0,
        0,  0,  0,  1,
        ];
    },
    Orthographic: function(left, right, bottom, top, near, far) {
        let lr = 1 / (right - left);
        let bt = 1 / (top - bottom);
        let nf = 1 / (near - far);
        return [
            2 * lr, 0, 0, -(right + left) * lr,
            0, 2 * bt, 0, -(top + bottom) * bt,
            0, 0, 2 * nf, (far + near) * nf,
            0, 0, 0, 1,
        ];
    },
    Transpose: function(mat) {
        let m00 = mat[0 * 4 + 0], m01 = mat[0 * 4 + 1], m02 = mat[0 * 4 + 2], m03 = mat[0 * 4 + 3];
        let m10 = mat[1 * 4 + 0], m11 = mat[1 * 4 + 1], m12 = mat[1 * 4 + 2], m13 = mat[1 * 4 + 3];
        let m20 = mat[2 * 4 + 0], m21 = mat[2 * 4 + 1], m22 = mat[2 * 4 + 2], m23 = mat[2 * 4 + 3];
        let m30 = mat[3 * 4 + 0], m31 = mat[3 * 4 + 1], m32 = mat[3 * 4 + 2], m33 = mat[3 * 4 + 3];

        return [
            m00, m10, m20, m30,
            m01, m11, m21, m31,
            m02, m12, m22, m32,
            m03, m13, m23, m33
        ];
    },
    Mult: function( mat1 , mat2 ) {
        let a00 = mat1[0 * 4 + 0], a01 = mat1[0 * 4 + 1], a02 = mat1[0 * 4 + 2], a03 = mat1[0 * 4 + 3];
        let a10 = mat1[1 * 4 + 0], a11 = mat1[1 * 4 + 1], a12 = mat1[1 * 4 + 2], a13 = mat1[1 * 4 + 3];
        let a20 = mat1[2 * 4 + 0], a21 = mat1[2 * 4 + 1], a22 = mat1[2 * 4 + 2], a23 = mat1[2 * 4 + 3];
        let a30 = mat1[3 * 4 + 0], a31 = mat1[3 * 4 + 1], a32 = mat1[3 * 4 + 2], a33 = mat1[3 * 4 + 3];

        let b00 = mat2[0 * 4 + 0], b01 = mat2[0 * 4 + 1], b02 = mat2[0 * 4 + 2], b03 = mat2[0 * 4 + 3];
        let b10 = mat2[1 * 4 + 0], b11 = mat2[1 * 4 + 1], b12 = mat2[1 * 4 + 2], b13 = mat2[1 * 4 + 3];
        let b20 = mat2[2 * 4 + 0], b21 = mat2[2 * 4 + 1], b22 = mat2[2 * 4 + 2], b23 = mat2[2 * 4 + 3];
        let b30 = mat2[3 * 4 + 0], b31 = mat2[3 * 4 + 1], b32 = mat2[3 * 4 + 2], b33 = mat2[3 * 4 + 3];

        return [
            a00*b00 + a01*b10 + a02*b20 + a03*b30,
            a00*b01 + a01*b11 + a02*b21 + a03*b31,
            a00*b02 + a01*b12 + a02*b22 + a03*b32,
            a00*b03 + a01*b13 + a02*b23 + a03*b33,

            a10*b00 + a11*b10 + a12*b20 + a13*b30,
            a10*b01 + a11*b11 + a12*b21 + a13*b31,
            a10*b02 + a11*b12 + a12*b22 + a13*b32,
            a10*b03 + a11*b13 + a12*b23 + a13*b33,

            a20*b00 + a21*b10 + a22*b20 + a23*b30,
            a20*b01 + a21*b11 + a22*b21 + a23*b31,
            a20*b02 + a21*b12 + a22*b22 + a23*b32,
            a20*b03 + a21*b13 + a22*b23 + a23*b33,

            a30*b00 + a31*b10 + a32*b20 + a33*b30,
            a30*b01 + a31*b11 + a32*b21 + a33*b31,
            a30*b02 + a31*b12 + a32*b22 + a33*b32,
            a30*b03 + a31*b13 + a32*b23 + a33*b33,
        ];
    }
}

