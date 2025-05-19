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
      direction: "LEFT" | "RIGHT";
    } | null
  >;
  set: (
    parent: HTMLElement | null,
    node: React.ReactNode | null,
    id: string,
    type: "LEFT" | "RIGHT"
  ) => void;
  close: (id: string) => void;
};

export const useHover = create<HoverState>((set) => ({
  nodes: {},
  set: (parent, node, id, type = "RIGHT") => {
    if (parent === null) return console.error("Parent is null");
    const parentNode = parent as HTMLElement;

    const { x, y } = parentNode.getBoundingClientRect() ?? { x: 0, y: 0 };
    const nodeInfo =
      type === "RIGHT"
        ? {
            parent,
            node,
            id: parentNode.id,
            x: x + parent.offsetWidth + 10,
            y: y + parent.offsetHeight / 8,
            direction: "RIGHT",
          }
        : {
            parent,
            node,
            id: parentNode.id,
            x: x - 10 - 41,
            y: y + parent.offsetHeight / 8,
            direction: "LEFT",
          };

    set((state) => {
      const newNodes = { ...state.nodes };
      newNodes[id] = nodeInfo as any;
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
