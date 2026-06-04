interface TabOptionProps {
    label: string;
    id: string;
    selected: boolean;
    onClick(): void;
}

export default function TabOption({ label, id, selected, onClick }: TabOptionProps) {
    return (
        <li class={`z-30 flex-auto text-center ${selected ? 'bg-elektron-primary' : 'bg-elektron-secondary'}`}>
            <a
                onClick={onClick}
                class="z-30 flex items-center justify-center w-full px-0 py-2 text-sm mb-0 transition-all ease-in-out border-0 rounded-md cursor-pointer text-yellow-600 bg-inherit"
                data-tab-target=""
                role="tab"
                aria-selected={selected}
                aria-controls={id}>
                {label}
            </a>
        </li>
    );
}
