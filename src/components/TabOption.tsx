import { Component } from "preact";

interface TabOptionProps {
    label: string;
    id: string;
    selected: boolean;
    onClick(): void
}

export default class TabOption extends Component<TabOptionProps> {
    constructor(props: TabOptionProps) {
        super(props);
    }

    render() {
        return (
            <li class={`z-30 flex-auto text-center ${this.props.selected ? 'bg-elektron-secondary' : 'bg-elektron-primary'}`}>
                <a onClick={this.props.onClick}
                    class="z-30 flex items-center justify-center w-full px-0 py-2 text-sm mb-0 transition-all ease-in-out border-0 rounded-md cursor-pointer text-yellow-600 bg-inherit"
                    data-tab-target=""
                    role="tab"
                    aria-selected={this.props.selected}
                    aria-controls={this.props.id}>
                    {this.props.label}
                </a>
            </li>
        )
    }
}