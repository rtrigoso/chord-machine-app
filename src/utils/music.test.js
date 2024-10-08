import { expect, test, describe } from 'vitest';
import { GetAbsolute, GetNote, GetNotesInChord } from './music';
import { BALANCE_MAP } from '../constants/music'

describe("GetAbsolute", () => {
    test("get the absolute distance of semitones from the root note \"0\" by setting the max distance to 11", () => {
        expect(GetAbsolute(0)).toEqual(0);
        expect(GetAbsolute(7)).toEqual(7);
        expect(GetAbsolute(11)).toEqual(11);
        expect(GetAbsolute(12)).toEqual(0);
        expect(GetAbsolute(18)).toEqual(6);
        expect(GetAbsolute(13)).toEqual(1);
    });
});

describe("GetNote", () => {
    test("get the note name by adding x semitones to the root", () => {
        expect(GetNote("C", 0)).toEqual("C");
        expect(GetNote("C", 5)).toEqual("F");
        expect(GetNote("C", 7)).toEqual("G");
        expect(GetNote("A", 0)).toEqual("A");
        expect(GetNote("A", 1)).toEqual("A#");
        expect(GetNote("A", 9)).toEqual("F#");
        expect(GetNote("D", 15)).toEqual("F");
        expect(GetNote("D#", 15)).toEqual("F#");
        expect(GetNote("G#", 15)).toEqual("B");
        expect(GetNote("E", -3)).toEqual("C#");
        expect(GetNote("E", -6)).toEqual("A#");
    });
});

describe("GetNotesInChord", () => {
    test("get the correct notes on a chord", () => {
        const b = BALANCE_MAP[3];
        const printErr = chord => `${chord} chord returns the wrong value`;

        const minor = "minor";
        expect(GetNotesInChord("C", minor, b), printErr(minor)).toStrictEqual([["C", "D#", "G"], [0, 3, 7]]);

        const major = "major";
        expect(GetNotesInChord("D", major, b), printErr(major)).toStrictEqual([["D", "F#", "A"], [0, 4, 7]]);

        const sus2 = "sus2";
        expect(GetNotesInChord("C#", sus2, b), printErr(sus2)).toStrictEqual([["C#", "D#", "G#"], [0, 2, 7]]);

        const sus4 = "sus4";
        expect(GetNotesInChord("C#", sus4, b), printErr(sus4)).toStrictEqual([["C#", "F#", "G#"], [0, 5, 7]]);

        const m7 = "m7";
        expect(GetNotesInChord("A", m7, b), printErr(m7)).toStrictEqual([["A", "C", "E", "G"], [0, 3, 7, 10]]);

        const M7 = "M7";
        expect(GetNotesInChord("G", M7, b), printErr(M7)).toStrictEqual([["G", "B", "D", "F"], [0, 4, 7, 10]]);

        const mMaj7 = "mMaj7";
        expect(GetNotesInChord("A#", mMaj7, b), printErr(mMaj7)).toStrictEqual([["A#", "C#", "F", "A"], [0,3,7,11]]);

        const Maj7 = "Maj7";
        expect(GetNotesInChord("B", Maj7, b), printErr(Maj7)).toStrictEqual([["B", "D#", "F#", "A#"], [0,4,7,11]]);

        const _7sus4 = "7sus4";
        expect(GetNotesInChord("E", _7sus4, b), printErr(_7sus4)).toStrictEqual([["E", "A", "B", "D"], [0,5,7,10]]);

        const dim7 = "dim7";
        expect(GetNotesInChord("C", dim7, b), printErr(dim7)).toStrictEqual([[ 'C', 'D#', 'F#', 'A' ],[0,3,6,9]]);

        const madd9 = "madd9";
        expect(GetNotesInChord("D", madd9, b), printErr(madd9)).toStrictEqual([[ 'D', 'E', 'F', 'A' ], [0,2,3,7]]);

        const Madd9 = "Madd9";
        expect(GetNotesInChord("C#", Madd9, b), printErr(Madd9)).toStrictEqual([[ 'C#', 'D#', 'F', 'G#' ], [0,2,4,7]]);

        const m6 = "m6";
        expect(GetNotesInChord("D#", m6, b), printErr(m6)).toStrictEqual([[ 'D#', 'F#', 'A#', 'C' ], [0,3,7,9]]);
        
        const M6 = "M6";
        expect(GetNotesInChord("A", M6, b), printErr(M6)).toStrictEqual([[ 'A', 'C#', 'E', 'F#' ], [0,4,7,9]]);
        
        const mb5 = "mb5";
        expect(GetNotesInChord("G", mb5, b), printErr(mb5)).toStrictEqual([[ 'G', 'A#', 'C#' ], [0,3,6]]);
        
        const m7b5 = "m7b5";
        expect(GetNotesInChord("A#", m7b5, b), printErr(m7b5)).toStrictEqual([[ 'A#', 'C#', 'E', 'G#' ], [0,3,6,10]]);
        
        const M7b5 = "M7b5";
        expect(GetNotesInChord("B", M7b5, b), printErr(M7b5)).toStrictEqual([[ 'B', 'D#', 'F', 'A' ], [0,4,6,10]]);
        
        const Mh5 = "M#5";
        expect(GetNotesInChord("E", Mh5, b), printErr(Mh5)).toStrictEqual([[ 'E', 'G#', 'C' ], [0,4,8]]);
        
        const m7h5 = "m7#5";
        expect(GetNotesInChord("D", m7h5, b), printErr(m7h5)).toStrictEqual([[ 'D', 'F', 'A#', 'C' ], [0,3,8,10]]);
        
        const M7h5 = "M7#5";
        expect(GetNotesInChord("C#", M7h5, b), printErr(M7h5)).toStrictEqual([[ 'C#', 'F', 'A', 'B' ], [0,4,8,10]]);
        
        const mb6 = "mb6";
        expect(GetNotesInChord("C#", mb6, b), printErr(mb6)).toStrictEqual([[ 'C#', 'E', 'A' ], [0,3,8]]);
        
        const m9no5 = "m9no5";
        expect(GetNotesInChord("A", m9no5, b), printErr(m9no5)).toStrictEqual([[ 'A', 'B', 'C', 'G' ], [0,2,3,10]]);
        
        const M9no5 = "M9no5";
        expect(GetNotesInChord("G", M9no5, b), printErr(M9no5)).toStrictEqual([[ 'G', 'A', 'B', 'F' ], [0,2,4,10]]);
        
        const Madd9b5 = "Madd9b5";
        expect(GetNotesInChord("F#", Madd9b5, b), printErr(Madd9b5)).toStrictEqual([[ 'F#', 'G#', 'A#', 'C' ], [0,2,4,6]]);
        
        const Maj7b5 = "Maj7b5";
        expect(GetNotesInChord("B", Maj7b5, b), printErr(Maj7b5)).toStrictEqual([[ 'B', 'D#', 'F', 'A#' ], [0,4,6,11]]);
        
        const M7b9no5 = "M7b9no5";
        expect(GetNotesInChord("E", M7b9no5, b), printErr(M7b9no5)).toStrictEqual([[ 'E', 'F', 'G#', 'D' ], [0,1,4,10]]);
        
        const sus4h5b9 = "sus4#5b9";
        expect(GetNotesInChord("C", sus4h5b9, b), printErr(sus4h5b9)).toStrictEqual([[ 'C', 'C#', 'F', 'G#' ], [0,1,5,8]]);
        
        const sus4addh5 = "sus4add#5";
        expect(GetNotesInChord("D", sus4addh5, b), printErr(sus4addh5)).toStrictEqual([[ 'D', 'G', 'A', 'A#' ], [0,5,7,8]]);
        
        const Maddb5 = "Maddb5";
        expect(GetNotesInChord("C#", Maddb5, b), printErr(Maddb5)).toStrictEqual([[ 'C#', 'F', 'G', 'G#' ], [0,4,6,7]]);
        
        const M6add4no5 = "M6add4no5";
        expect(GetNotesInChord("C#", M6add4no5, b), printErr(M6add4no5)).toStrictEqual([[ 'C#', 'F', 'F#', 'A#' ], [0,4,5,9]]);
        
        const Maj7_6no5 = "Maj7/6no5";
        expect(GetNotesInChord("F", Maj7_6no5, b), printErr(Maj7_6no5)).toStrictEqual([[ 'F', 'A', 'D' ], [0,4,9]]);
        
        const Maj9no5 = "Maj9no5";
        expect(GetNotesInChord("G", Maj9no5, b), printErr(Maj9no5)).toStrictEqual([[ 'G', 'A', 'B', 'F#' ], [0,2,4,11]]);
        
    });
})