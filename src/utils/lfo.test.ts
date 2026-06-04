import { expect, test, describe } from 'vitest';
import { CalculateOptions } from './lfo';

describe('CalculateOptions', () => {
    test('returns combinations whose calculated steps match the input', () => {
        const results = CalculateOptions(2048);
        expect(results.length).toBeGreaterThan(0);
        results.forEach(({ spd, mult }) => {
            expect(2048 / (spd * mult)).toBeCloseTo(2048, 4);
        });
    });

    test('returns an empty array when no combination matches', () => {
        expect(CalculateOptions(0.001)).toEqual([]);
    });

    test('returns correct spd/mult pairs for a known step value', () => {
        // BASE=2048, spd=1, mult=1 → 2048 steps
        const results = CalculateOptions(2048);
        expect(results).toContainEqual({ spd: 1, mult: 1 });
    });

    test('returns multiple valid combinations when they exist', () => {
        // BASE=2048, spd=1 mult=2 and spd=2 mult=1 both give 1024
        const results = CalculateOptions(1024);
        expect(results).toContainEqual({ spd: 1, mult: 2 });
        expect(results).toContainEqual({ spd: 2, mult: 1 });
    });
});
