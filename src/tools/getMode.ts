import modes from '../constants/modes.ts';
import { Mode } from '../types/mod.ts';

export default function getMode(data: string): Mode {
  switch (true) {
    case /^[0-9]*$/.test(data):
      return modes.numeric;
    case /^[0-9A-Z $%*+\-./:]*$/.test(data):
      return modes.alphanumeric;
    default:
      return modes.byte;
  }
}
