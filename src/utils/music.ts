import {
    DistanceFromRootInSemitones,
    Note,
    SEMITONE_PER_OCTAVE,
    NOTES,
    ChordName,
    Notes,
    CHORDS
} from '@constants/music';

export function GetAbsolute (distance: DistanceFromRootInSemitones): DistanceFromRootInSemitones {
    return distance % SEMITONE_PER_OCTAVE;
}

export function GetNote (root: Note, distanceFromRoot: DistanceFromRootInSemitones): Note {
    const index = NOTES.indexOf(root);
    let absDistance = GetAbsolute(index + GetAbsolute(distanceFromRoot));
    if (absDistance < 0) {
        absDistance += SEMITONE_PER_OCTAVE;
    }

    return NOTES[absDistance];
}

export function GetNotesInChord (root: Note, name: ChordName): Notes {
    let chord: Notes = [];
    const chordValue = CHORDS[name];
    for (const distanceFromRoot of chordValue) {
        chord.push(GetNote(root, distanceFromRoot))
    }

    return chord;
}