/** @todo Implement */
export default class FiguredBass {
    items = [];
    clone() {
        const clone = new FiguredBass();
        clone.items = this.items.slice();
        return clone;
    }
}
