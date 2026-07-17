import { useSignal } from '@preact/signals';
import { useEffect } from 'preact/hooks';
import TabContent from './components/TabContent';
import TabOption from './components/TabOption';
import ChordCalculator from './composites/chord-calculator';
import LFOCalculator from './composites/lfo-calculator';
import SubharmonicChords from './composites/subharmonic-chords';
import PitchCheck from './composites/pitch-check';

const VALID_TABS = ['chord-translator', 'lfo-calculator', 'subharmonic-chords', 'pitch-check'];
const DEFAULT_TAB = 'chord-translator';

function getTabFromHash(): string {
  const hash = window.location.hash.slice(1);
  return VALID_TABS.includes(hash) ? hash : DEFAULT_TAB;
}

export function App() {
  const selected = useSignal(getTabFromHash());

  const selectTab = (id: string) => {
    history.pushState(null, '', `#${id}`);
    selected.value = id;
  };

  useEffect(() => {
    const onNavigate = () => {
      selected.value = getTabFromHash();
    };
    window.addEventListener('popstate', onNavigate);
    window.addEventListener('hashchange', onNavigate);
    return () => {
      window.removeEventListener('popstate', onNavigate);
      window.removeEventListener('hashchange', onNavigate);
    };
  }, []);

  const isSelected = (id: string) => id === selected.value;

  return (
    <div class="w-full lg:max-w-50">
      <div class="relative right-0">
        <ul class="relative flex flex-wrap h-min list-none rounded-md bg-elektron-primary" data-tabs="tabs" role="list">
          <TabOption
            id="chord-translator"
            label='chord translator'
            selected={isSelected('chord-translator')}
            onClick={() => selectTab('chord-translator')} />
          <TabOption
            id="lfo-calculator"
            label='lfo calculator'
            selected={isSelected('lfo-calculator')}
            onClick={() => selectTab('lfo-calculator')} />
          <TabOption
            id="subharmonic-chords"
            label='subharmonic chords'
            selected={isSelected('subharmonic-chords')}
            onClick={() => selectTab('subharmonic-chords')} />
          <TabOption
            id="pitch-check"
            label='pitch check'
            selected={isSelected('pitch-check')}
            onClick={() => selectTab('pitch-check')} />
        </ul>
        <div data-tab-content="" class="py-2">
          <TabContent id="chord-translator" selected={isSelected('chord-translator')}>
            <ChordCalculator />
          </TabContent>
          <TabContent id="lfo-calculator" selected={isSelected('lfo-calculator')}>
            <LFOCalculator />
          </TabContent>
          <TabContent id="subharmonic-chords" selected={isSelected('subharmonic-chords')}>
            <SubharmonicChords />
          </TabContent>
          <TabContent id="pitch-check" selected={isSelected('pitch-check')}>
            <PitchCheck />
          </TabContent>
        </div>
      </div>
    </div>
  );
}
