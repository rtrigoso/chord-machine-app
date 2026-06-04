import { expect, test, describe } from 'vitest';
import { render } from '@testing-library/preact';
import TabContent from './TabContent';

describe('TabContent', () => {
    test('renders children when selected', () => {
        const { container } = render(
            <TabContent id="test" selected={true}>
                <span>content</span>
            </TabContent>
        );
        expect(container.textContent).toContain('content');
        expect(container.querySelector('.hidden')).toBeNull();
    });

    test('hides children when not selected', () => {
        const { container } = render(
            <TabContent id="test" selected={false}>
                <span>content</span>
            </TabContent>
        );
        expect(container.querySelector('.hidden')).not.toBeNull();
    });

    test('sets the correct id on the tabpanel', () => {
        const { container } = render(
            <TabContent id="my-tab" selected={true}>content</TabContent>
        );
        expect(container.querySelector('#my-tab')).not.toBeNull();
    });
});
