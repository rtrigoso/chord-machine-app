import {
    DistanceFromRootInSemitones,
    Note,
    SEMITONE_PER_OCTAVE,
    NOTES,
    ChordName,
    Notes,
    CHORDS,
    Balance
} from '@constants/music';
import { cloneDeep } from 'lodash';

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

export function GetNotesInChord (root: Note, name: ChordName, balance: Balance): [Notes, DistanceFromRootInSemitones[]] {
    let chord: Notes = [];
    let distancesFromRootInSemitones: DistanceFromRootInSemitones[] = [];
    let chordValue = cloneDeep(CHORDS[name]);
    const octaveChanges = balance.noteOctaves;

    octaveChanges.forEach((value, index): void => {
        if (value === 0) return;

        const octaveChange = chordValue.splice(index, 1);

        if (value < 0) {
            chordValue = chordValue.concat(octaveChange);
            return;
        }
        
        chordValue = octaveChange.concat(chordValue);
    });

    for (const index in chordValue) {
        const distanceFromRoot = chordValue[index];
        const isActive = balance.value[index];
        
        if (!isActive) continue;
        chord.push(GetNote(root, distanceFromRoot))
        distancesFromRootInSemitones.push(distanceFromRoot)
    }

    return [chord, distancesFromRootInSemitones];
}