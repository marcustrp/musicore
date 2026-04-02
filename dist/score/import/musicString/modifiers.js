export class ModifierParser {
    errors;
    constructor(errors) {
        this.errors = errors;
    }
    parse(item) {
        switch (item) {
            case '+':
                return { type: 'octave-shift', data: 1 };
            case '-':
                return { type: 'octave-shift', data: -1 };
            default:
                return;
        }
    }
}
