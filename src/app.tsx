import { useSignal } from '@preact/signals';
import TabContent from './components/TabContent';
import TabOption from './components/TabOption';
import ChordCalculator from './composites/chord-calculator';
import LFOCalculator from './composites/lfo-calculator';

export function App() {
  const selected = useSignal('chords');
  const selectTab = (id: string) => {
    selected.value = id;
  }
  const isSelected = (id: string) => id === selected.value;

  return (
    <div class="w-full lg:max-w-50">
      <div class="relative right-0">
        <ul class="relative flex flex-wrap h-min list-none rounded-md bg-elektron-primary" data-tabs="tabs" role="list">
          <TabOption
            id="chords"
            label='chord translator'
            selected={isSelected('chords')}
            onClick={() => selectTab('chords')} />
          <TabOption
            id="lfo"
            label='lfo calculator'
            selected={isSelected('lfo')}
            onClick={() => selectTab('lfo')} />
        </ul>
        <div data-tab-content="" class="py-2">
          <TabContent id="chords" selected={isSelected('chords')}>
            <ChordCalculator />
          </TabContent>
          <TabContent id="lfo" selected={isSelected('lfo')}>
            <LFOCalculator />
          </TabContent>
        </div>
      </div>
    </div>
  );
}
