import Fraction from 'fraction.js';
export default class ChordSymbol {
    text;
    _offset;
    get offset() {
        return this._offset;
    }
    set offset(value) {
        if (value)
            this._offset = value;
        else
            delete this._offset;
    }
    _level;
    get level() {
        return this._level;
    }
    set level(value) {
        if (value)
            this._level = value;
        else
            delete this._level;
    }
    _parenthesis;
    get parenthesis() {
        return this._parenthesis;
    }
    set parenthesis(value) {
        if (value)
            this._parenthesis = value;
        else
            delete this._parenthesis;
    }
    /**
     *
     * @param text
     * @param offset position in relation to note, in Duration
     * @param level horisontal level, 0 or undefined is lowest level
     * @param parenthesis
     *
     * @todo split text into data structure for chord
     */
    constructor(text, offset, level, parenthesis) {
        this.text = text;
        if (offset)
            this._offset = offset;
        if (level)
            this._level = level;
        if (parenthesis)
            this._parenthesis = parenthesis;
    }
}
