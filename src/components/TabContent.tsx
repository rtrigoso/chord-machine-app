import { ComponentChildren } from "preact";

interface TabContentProps {
    id: string;
    children: ComponentChildren;
    selected: boolean;
}

export default function TabContent(props: TabContentProps) {
    return (
        <div
            id={props.id} role="tabpanel"
            class={`flex justify-center ${props.selected ? "" : "hidden opacity-0"}`} >
            {props.children}
        </div>
    )
}
