import Fraction from 'fraction.js';

export default class ChordSymbol {
  _offset?: Fraction;
  get offset(): Fraction | undefined {
    return this._offset;
  }
  set offset(value: Fraction | undefined) {
    if (value) this._offset = value;
    else delete this._offset;
  }
  _level?: number;
  get level(): number | undefined {
    return this._level;
  }
  set level(value: number | undefined) {
    if (value) this._level = value;
    else delete this._level;
  }
  _parenthesis?: 'start' | 'end' | 'both';
  get parenthesis(): 'start' | 'end' | 'both' | undefined {
    return this._parenthesis;
  }
  set parenthesis(value: 'start' | 'end' | 'both' | undefined) {
    if (value) this._parenthesis = value;
    else delete this._parenthesis;
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
  constructor(
    public text: string,
    offset?: Fraction,
    level?: number,
    parenthesis?: 'start' | 'end' | 'both',
  ) {
    if (offset) this._offset = offset;
    if (level) this._level = level;
    if (parenthesis) this._parenthesis = parenthesis;
  }
}
