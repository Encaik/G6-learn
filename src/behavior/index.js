import G6 from "@antv/g6";
import hoverNode from "./hover-node";
import hoverEdge from "./hover-edge";
import hoverCombo from "./hover-combo";
import addEdge from "./add-edge";

const behavors = {
  "hover-node": hoverNode,
  "hover-edge": hoverEdge,
  "hover-combo": hoverCombo,
  "add-edge": addEdge
};

export function initBehavors() {
  for (let key in behavors) {
    G6.registerBehavior(key, behavors[key]);
  }
}
