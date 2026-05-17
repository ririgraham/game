export interface Rune {
  id: string;
  char: string;
  name: string;
}

export const RUNES: Rune[] = [
  { id: 'fehu', char: 'ᚠ', name: 'Fehu' },
  { id: 'uruz', char: 'ᚢ', name: 'Uruz' },
  { id: 'thurisaz', char: 'ᚦ', name: 'Thurisaz' },
  { id: 'ansuz', char: 'ᚨ', name: 'Ansuz' },
  { id: 'raidho', char: 'ᚱ', name: 'Raidho' },
  { id: 'kenaz', char: 'ᚲ', name: 'Kenaz' },
  { id: 'gebo', char: 'ᚷ', name: 'Gebo' },
  { id: 'wunjo', char: 'ᚹ', name: 'Wunjo' },
  { id: 'hagalaz', char: 'ᚺ', name: 'Hagalaz' },
  { id: 'nauthiz', char: 'ᚾ', name: 'Nauthiz' },
  { id: 'isa', char: 'ᛁ', name: 'Isa' },
  { id: 'jera', char: 'ᛃ', name: 'Jera' }
];
