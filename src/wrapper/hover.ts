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
    type: "LEFT" | "RIGHT",
    nodeRef?: React.RefObject<HTMLElement>
  ) => void;
  close: (id: string) => void;
};

export const useHover = create<HoverState>((set) => ({
  nodes: {},
  set: (parent, node, id, type = "RIGHT", nodeRef = undefined) => {
    if (parent === null) return console.error("Parent is null");
    const parentNode = parent as HTMLElement;

    const { x: parentX, y: parentY } = parentNode.getBoundingClientRect() ?? {
      x: 0,
      y: 0,
    };

    const { x: nodeX } = nodeRef?.current?.getBoundingClientRect() ?? {
      x: 0,
    };
    console.log("Node X:", nodeX, nodeRef);

    const nodeInfo =
      type === "RIGHT"
        ? {
            parent,
            node,
            id: parentNode.id,
            x: parentX + parent.offsetWidth + 10,
            y: parentY + parent.offsetHeight / 8,
            direction: "RIGHT",
          }
        : {
            parent,
            node,
            id: parentNode.id,
            x: parentX - parent.offsetWidth - nodeX,
            y: parentY + parent.offsetHeight / 8,
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
