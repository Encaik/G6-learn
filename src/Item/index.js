import G6 from "@antv/g6";

export function initItems() {
  G6.registerNode("ownrect", {
    draw(cfg, group) {
      group.addShape("rect", {
        attrs: {
          width: cfg.size[0],
          height: cfg.size[1],
          stroke: cfg.style.stroke,
          fill: cfg.style.fill,
          index: "node"
        },
        draggable: true
      });
      const points = cfg.anchorPoints;
      for (let index = 0; index < points.length; index++) {
        group.addShape("circle", {
          attrs: {
            x: cfg.size[0] * points[index][0],
            y: cfg.size[1] * points[index][1],
            r: 2.5,
            stroke: cfg.style.stroke,
            fill: cfg.style.fill,
            index
          }
        });
      }
      if (cfg.label) {
        group.addShape("text", {
          attrs: {
            x: cfg.size[0] / 2,
            y: cfg.size[1] / 2,
            textAlign: "center",
            textBaseline: "middle",
            text: cfg.label,
            fill: "#666",
            index: "node"
          },
          draggable: true
        });
      }
      return group;
    },
    update(cfg, node) {
      const group = node.getContainer(); // 获取容器
      const shape = group.get("children")[0]; // 按照添加的顺序
      console.log(cfg);
      const style = cfg.style;
      shape.attr(style); // 更新属性
      // 更新文本的逻辑类似，但是需要考虑 cfg.label 是否存在的问题
      // 通过 label.attr() 更新文本属性即可
    },
    setState(name, value, item) {
      const group = item.getContainer();
      if (name === "hover") {
        const shape = group.get("children")[0];
        if (value) {
          shape.attr("fill", "#e5f2ff");
          shape.attr("stroke", "#66C4FF");
        } else {
          shape.attr("fill", "#fff");
          shape.attr("stroke", "#000");
        }
      }
    }
  });
}
