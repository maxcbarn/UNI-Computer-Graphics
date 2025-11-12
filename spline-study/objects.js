export class Obj {
    constructor( vao , position , rotation , scale , primitiveType , offset , count ) {
        this.vao = vao; 
        this.position = position;
        this.rotation = rotation; 
        this.scale = scale;
        this.primitiveType = primitiveType;
        this.offset = offset;
        this.count = count;
    }
    Draw( gl ) {
        gl.drawArrays( this.primitiveType , this.offset , this.count );
    }
}

export class Cube extends Obj {
    constructor( vao , position , rotation , scale , primitiveType , offset , count ) {
        super( vao , position , rotation , scale , primitiveType , offset , count );
    }
    Draw( gl ) {
        gl.drawArrays( this.primitiveType , this.offset , this.count );
    }
}