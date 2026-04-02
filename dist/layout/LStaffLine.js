import {} from './LayoutObject.js';
import {} from '../fonts/types.js';
import { BBox } from '../utils/bBox.js';
export class LStaffLine {
    x;
    y;
    length;
    thickness;
    bBox;
    constructor(font, x, y, length) {
        this.x = x;
        this.y = y;
        this.length = length;
        this.thickness = font.metadata.staffLineThickness;
        this.bBox = new BBox(x, y, this.length, this.thickness);
    }
    toObject() {
        return { x: this.x, y: this.y, length: this.length, thickness: this.thickness };
    }
}
