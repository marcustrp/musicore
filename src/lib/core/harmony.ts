export type HarmonyKind =
  | 'augmented'
  | 'augmented-seventh'
  | 'diminished'
  | 'diminished-seventh'
  | 'dominant'
  | 'dominant-11th'
  | 'dominant-13th'
  | 'dominant-ninth'
  | 'French'
  | 'German'
  | 'half-diminished'
  | 'Italian'
  | 'major'
  | 'major-11th'
  | 'major-13th'
  | 'major-minor'
  | 'major-ninth'
  | 'major-seventh'
  | 'major-sixth'
  | 'minor'
  | 'minor-11th'
  | 'minor-13th'
  | 'minor-ninth'
  | 'minor-seventh'
  | 'minor-sixth'
  | 'Neapolitan'
  | 'none'
  | 'other'
  | 'pedal'
  | 'power'
  | 'suspended-fourth'
  | 'suspended-second'
  | 'Tristan';
type HarmonyDegreeType = 'subtract' | 'add';
export interface HarmonySettings {
  root: string; // root.step
  numeral?: any;
  kind: HarmonyKind;
  bass?: string;
  degree?: {
    value: number;
    alter: number;
    type: HarmonyDegreeType;
  };
}

/**
 * @todo Implement and document Harmony class
 */
export class Harmony {}
