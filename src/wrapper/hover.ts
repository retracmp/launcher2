import { create } from "zustand";

type HoverState = {
  nodes: Record<
    string,
    {
      parent: HTMLElement | null;
      node: React.ReactNode | null;
      id: string;
      x: number;
      y: number;
    } | null
  >;
  set: (
    parent: HTMLElement | null,
    node: React.ReactNode | null,
    id: string
  ) => void;
  close: (id: string) => void;
};

export const useHover = create<HoverState>((set) => ({
  nodes: {},
  set: (parent, node, id) => {
    if (parent === null) return console.error("Parent is null");
    const parentNode = parent as HTMLElement;
    const { x, y } = parentNode.getBoundingClientRect() ?? { x: 0, y: 0 };
    const nodeInfo = {
      parent,
      node,
      id: parentNode.id,
      x: x + parent.offsetWidth + 10,
      y: y + parent.offsetHeight / 8,
    };
    set((state) => {
      const newNodes = { ...state.nodes };
      newNodes[id] = nodeInfo;
      return { nodes: newNodes };
    });
  },
  close: (id) => {
    set((state) => {
      const newNodes = { ...state.nodes };
      delete newNodes[id];
      return { nodes: newNodes };
    });
  },
}));
