import { ScaleNumber } from '../note.js';

export const ScaleTypes: {
  [key: string]: {
    steps: number[];
    scaleNumbers: ScaleNumber[];
    name: string;
    stepsDescending?: number[];
    scaleNumbersDescending?: string[];
    identicalTo?: string;
  };
} = {
  major: {
    steps: [0, 2, 4, 5, 7, 9, 11],
    scaleNumbers: ['1', '2', '3', '4', '5', '6', '7'],
    name: 'Dur',
    identicalTo: 'ionian',
  },
  minor: {
    steps: [0, 2, 3, 5, 7, 8, 10],
    scaleNumbers: ['1', '2', 'b3', '4', '5', 'b6', 'b7'],
    name: 'Naturlig moll',
    identicalTo: 'aeolian',
  },
  harmonic_minor: {
    steps: [0, 2, 3, 5, 7, 8, 11],
    scaleNumbers: ['1', '2', 'b3', '4', '5', 'b6', '7'],
    name: 'Harmonisk moll',
  },
  melodic_minor: {
    steps: [0, 2, 3, 5, 7, 9, 11],
    scaleNumbers: ['1', '2', 'b3', '4', '5', '6', '7'],
    stepsDescending: [0, 2, 3, 5, 7, 8, 10],
    scaleNumbersDescending: ['1', '2', 'b3', '4', '5', 'b6', 'b7'],
    name: 'Melodisk moll',
  },
  ionian: {
    steps: [0, 2, 4, 5, 7, 9, 11],
    scaleNumbers: ['1', '2', '3', '4', '5', '6', '7'],
    name: 'Jonisk',
    identicalTo: 'major',
  },
  dorian: {
    steps: [0, 2, 3, 5, 7, 9, 10],
    scaleNumbers: ['1', '2', 'b3', '4', '5', '6', 'b7'],
    name: 'Dorisk',
  },
  phrygian: {
    steps: [0, 1, 3, 5, 7, 8, 10],
    scaleNumbers: ['1', 'b2', 'b3', '4', '5', 'b6', 'b7'],
    name: 'Frygisk',
  },
  lydian: {
    steps: [0, 2, 4, 6, 7, 9, 11],
    scaleNumbers: ['1', '2', '3', '#4', '5', '6', '7'],
    name: 'Lydisk',
  },
  mixolydian: {
    steps: [0, 2, 4, 5, 7, 9, 10],
    scaleNumbers: ['1', '2', '3', '4', '5', '6', 'b7'],
    name: 'Mixolydisk',
  },
  aeolian: {
    steps: [0, 2, 3, 5, 7, 8, 10],
    scaleNumbers: ['1', '2', 'b3', '4', '5', 'b6', 'b7'],
    name: 'Aeolisk',
    identicalTo: 'aeolian',
  },
  locrian: {
    steps: [0, 1, 3, 5, 6, 8, 10],
    scaleNumbers: ['1', 'b2', 'b3', '4', 'b5', 'b6', 'b7'],
    name: 'Lokrisk',
  },
  pentatonic_major: {
    steps: [0, 2, 4, 7, 9],
    scaleNumbers: ['1', '2', '3', '5', '6'],
    name: 'Dur pentatonisk',
  },
  pentatonic_minor: {
    steps: [0, 3, 5, 7, 10],
    scaleNumbers: ['1', 'b3', '4', '5', 'b7'],
    name: 'Moll pentatonisk',
  },
  blues: {
    steps: [0, 3, 5, 6, 7, 10],
    scaleNumbers: ['1', 'b3', '4', '#4', '5', 'b7'],
    stepsDescending: [0, 3, 5, 6, 7, 10],
    scaleNumbersDescending: ['1', 'b3', '4', 'b5', '5', 'b7'],
    name: 'Blues',
  },
  chromatic: {
    steps: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    scaleNumbers: ['1', '#1', '2', 'b3', '3', '4', '#4', '5', 'b6', '6', 'b7', '7'],
    name: 'Kromatisk',
  },
};
