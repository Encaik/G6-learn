export default {
  getEvents() {
    return {
      "combo:mouseover": "onMouseover",
      "combo:mouseleave": "onMouseleave",
      "combo:click": "onClick"
    };
  },
  onMouseover(e) {
    const graph = this.graph;
    const item = e.item;
    graph.setItemState(item, "hover", true);
  },
  onMouseleave(e) {
    const graph = this.graph;
    const item = e.item;
    graph.setItemState(item, "hover", false);
  },
  onClick(e) {
    const item = e.item;
    sessionStorage.setItem("select", JSON.stringify(item.getModel()));
  }
};
