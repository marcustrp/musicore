export type ModifierItem = {
  type: 'octave-shift';
  data: string | number;
};

export class ModifierParser {
  constructor(private errors: string[]) {}

  parse(item: string): ModifierItem | undefined {
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
