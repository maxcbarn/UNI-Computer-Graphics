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
        return (this.controlPoints.length - 3);
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
        const T = [Math.pow(t, 3), Math.pow(t, 2), t, 1];

        const TM = [0, 0, 0, 0];
        for (let i = 0; i < 4; ++i) {
            for (let j = 0; j < 4; ++j) {
                TM[i] += T[j] * this.splineMatrix[j * 4 + i];
            }
        }

        let result = [0, 0, 0, 1];
        const points = [p1, p2, p3, p4];
        for (let i = 0; i < 4; ++i) {
            result = vector4.Sum(result, vector4.MultByEscalar(points[i], TM[i]));
        }
        return result;
    }
}