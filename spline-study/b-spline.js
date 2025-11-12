import { vector4 } from "./vector.js";

export class B_Spline {
    constructor( ) {
        this.controlPoints = [];
        this.splineMatrix = [ 
            -1 / 6 , 3 / 6 , -3 / 6 , 1 / 6 ,
            3 / 6 , -6 / 6 , 3 / 6 , 0 ,
            -3 / 6 , 0 , 3 / 6 , 0 ,
            1 / 6 , 4 / 6 , 1 / 6 , 0
        ];
    }
    SetPoint( controlPoint ) {
        this.controlPoints.push( controlPoint );
    }
    GetMaxT() {
        return (this.controlPoints.length - 3); // one segment per 4 points, overlapping
    }

    GetPoint(t) {
        const segment = Math.floor(t);
        const localT = t - segment;

        if (segment >= this.controlPoints.length - 3)
            return this.controlPoints[this.controlPoints.length - 1];

        const p1 = this.controlPoints[segment];
        const p2 = this.controlPoints[segment + 1];
        const p3 = this.controlPoints[segment + 2];
        const p4 = this.controlPoints[segment + 3];

        return this.CalculatePoint(p1, p2, p3, p4, localT);
    }
    CalculatePoint( p1, p2 , p3 , p4 , t ) {
        let multPoints = [ [] , [] , [] , [] ];
        multPoints[0] = vector4.Sum( p1 , vector4.Sum( vector4.MultByEscalar( p2 , 4 ) , p3 ) );
        multPoints[1] = vector4.Sum( vector4.MultByEscalar( p1 , -3 ) , vector4.MultByEscalar( p3 , 3 ) );
        multPoints[2] = vector4.Sum( vector4.MultByEscalar( p1 , 3 ) , vector4.Sum( vector4.MultByEscalar( p2 , -6 ) , vector4.MultByEscalar( p3 , 3 ) ) );
        multPoints[3] = vector4.Sum( vector4.Sum( vector4.MultByEscalar( p1 , -1 ) , vector4.MultByEscalar( p2 , 3 ) ) , vector4.Sum( vector4.MultByEscalar( p3 , -3 ) , p4 ) );
        let sum1 = vector4.Sum( multPoints[0] , vector4.MultByEscalar( multPoints[1] , t ) ) ;
        let sum2 = vector4.Sum( vector4.MultByEscalar( multPoints[2] , Math.pow( t , 2 ) ) , vector4.MultByEscalar( multPoints[3] , Math.pow( t , 3 ) ) );
        return  vector4.Sum( sum1 , sum2 );
    }
}