export default {
  getEvents() {
    return {
      "node:mouseover": "onMouseover",
      "node:mouseout": "onMouseleave"
    };
  },
  onMouseover(e) {
    const graph = this.graph;
    const item = e.item;
    console.log(e.shape.attrs.index);
    if (e.shape.attrs.index == "node") {
      graph.setItemState(item, "hover", true);
    } else {
      const point = item.getContainer().get("children")[
        parseInt(e.shape.attrs.index) + 1
      ];
      point.attr("fill", "#e5f2ff");
      point.attr("stroke", "#66C4FF");
      point.attr("r", 5);
    }
  },
  onMouseleave(e) {
    const graph = this.graph;
    const item = e.item;
    if (e.shape.attrs.index == "node") {
      graph.setItemState(item, "hover", false);
    } else {
      const point = item.getContainer().get("children")[
        parseInt(e.shape.attrs.index) + 1
      ];
      point.attr("fill", "#fff");
      point.attr("stroke", "#000");
      point.attr("r", 2.5);
    }
  }
};
