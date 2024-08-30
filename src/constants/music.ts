export const NOTES = [
    "A",
    "A#",
    "B",
    "C",
    "C#",
    "D",
    "D#",
    "E",
    "F",
    "F#",
    "G",
    "G#"
] as const;

export type Note = typeof NOTES[number];

export type Notes = Array<Note>

export type DistanceFromRootInSemitones = number;

export type ChordValue = Array<DistanceFromRootInSemitones>;

export const CHORD_NAMES = [
    "minor",
    "major",
    "sus2",
    "sus4",
    "m7",
    "M7",
    "mMaj7",
    "Maj7",
    "7sus4",
    "dim7",
    "madd9",
    "Madd9",
    "m6",
    "M6",
    "mb5",
    "Mb5",
    "m7b5",
    "M7b5",
    "M#5",
    "m7#5",
    "M7#5",
    "mb6",
    "m9no5",
    "M9no5",
    "Madd9b5",
    "Maj7b5",
    "M7b9no5",
    "sus4#5b9",
    "sus4add#5",
    "Maddb5",
    "M6add4no5",
    "Maj7/6no5",
    "Maj9no5",
] as const;

export type ChordName = typeof CHORD_NAMES[number];

export type Chords = {
    [key in ChordName]: ChordValue;
};

export const CHORDS: Chords = Object.freeze({
    "minor": [0, 3, 7],
    "major": [0, 4, 7],
    "sus2": [0, 2, 7],
    "sus4": [0, 5, 7],
    "m7": [0, 3, 7, 10],
    "M7": [0, 4, 7, 10],
    "mMaj7": [0, 3, 7, 11],
    "Maj7": [0, 4, 7, 11],
    "7sus4": [0, 5, 7, 10],
    "dim7": [0, 3, 6, 9],
    "madd9": [0, 2, 3, 7],
    "Madd9": [0, 2, 4, 7],
    "m6": [0, 3, 7, 9],
    "M6": [0, 4, 7, 9],
    "mb5": [0, 3, 6],
    "Mb5": [0, 4, 6],
    "m7b5": [0, 3, 6, 10],
    "M7b5": [0, 4, 6, 10],
    "M#5": [0, 4, 8],
    "m7#5": [0, 3, 8, 10],
    "M7#5": [0, 4, 8, 10],
    "mb6": [0, 3, 8],
    "m9no5": [0, 2, 3, 10],
    "M9no5": [0, 2, 4, 10],
    "Madd9b5": [0, 2, 4, 6],
    "Maj7b5": [0, 4, 6, 11],
    "M7b9no5": [0, 1, 4, 10],
    "sus4#5b9": [0, 1, 5, 8],
    "sus4add#5": [0, 5, 7, 8],
    "Maddb5": [0, 4, 6, 7],
    "M6add4no5": [0, 4, 5, 9],
    "Maj7/6no5": [0, 4, 9],
    "Maj9no5": [0, 2, 4, 11],
});

export type NoteOctave = -1 | 0 | 1;

export const SEMITONE_PER_OCTAVE = 12;