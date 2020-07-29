<template>
  <div class="home">
    <div class="silder" style="width:200px;height:100vh">
      <p>工具栏</p>
      <hr />
      标识:
      <br />
      <input type="text" v-model="newNode.id" />
      <br />类型:
      <br />
      <select v-model="newNode.type">
        <option value="circle">圆形</option>
        <option value="rect">矩形</option>
        <option value="ellipse">椭圆</option>
        <option value="diamond">菱形</option>
        <option value="triangle">三角形</option>
        <option value="star">星型</option>
      </select>
      <br />文本:
      <br />
      <input type="text" v-model="newNode.label" />
      <br />尺寸:
      <br />
      <input type="text" v-model="newNode.size" />
      <br />X轴:
      <br />
      <input type="text" v-model="newNode.x" />
      <br />Y轴:
      <br />
      <input type="text" v-model="newNode.y" />
      <br />
      <button @click="addNode">添加节点</button>
      <span draggable @dragend="handleDragEnd">
        拖动节点
      </span>
      <br />
      <hr />
      标识:
      <br />
      <input type="text" v-model="newEdge.id" />
      <br />类型:
      <br />
      <select v-model="newEdge.type">
        <option value="line">直线</option>
        <option value="polyline">折线</option>
        <option value="arc">弧线</option>
        <option value="quadratic">二阶曲线</option>
        <option value="cubic">三阶曲线</option>
        <option value="cubic-vertical">垂直三阶曲线</option>
        <option value="cubic-horizontal">水平三阶曲线</option>
        <option value="loop">环线</option>
      </select>
      <br />出发元素:
      <br />
      <input type="text" v-model="newEdge.source" />
      <br />出发点:
      <br />
      <select v-model="newEdge.sourceAnchor">
        <option value="0">上</option>
        <option value="1">右</option>
        <option value="2">下</option>
        <option value="3">左</option>
      </select>
      <br />结束元素:
      <br />
      <input type="text" v-model="newEdge.target" />
      <br />结束点:
      <br />
      <select v-model="newEdge.targetAnchor">
        <option value="0">上</option>
        <option value="1">右</option>
        <option value="2">下</option>
        <option value="3">左</option>
      </select>
      <br />
      <button @click="addEdge">添加边</button>
      <br />
      <hr />
      标识:
      <br />
      <input type="text" v-model="newCombo.id" />
      <br />类型:
      <br />
      <select v-model="newCombo.type">
        <option value="circle">圆形</option>
        <option value="rect">矩形</option>
      </select>
      <br />文本:
      <br />
      <input type="text" v-model="newCombo.label" />
      <br />尺寸:
      <br />
      <input type="text" v-model="newCombo.size" />
      <br />元素:
      <br />
      <input type="text" v-model="newCombo.combo" />
      <button @click="addCombo">添加容器</button>
      <br />
    </div>
    <div class="main" id="mountNode" />
    <div class="menu" style="width:200px;height:100vh">
      <p>缩略图</p>
      <hr />
      <div id="minimap"></div>
      <hr />
      <p>画布功能</p>
      <hr />
      <input type="checkbox" @click="switchGrid()" v-model="ghgrid" />网格对齐
      <button @click="print()">打印图表信息到控制台</button>
      <hr />
      <p>元素信息</p>
      <hr />
      <input type="text" v-model="select.label" />
      <input type="text" v-model="select.size" />
      <input type="text" v-model="select.type" />
      <div v-for="(style, index) in select.style" :key="index">
        <input type="text" v-model="select.style[index]" />
      </div>
      <button @click="update">保存</button>
    </div>
  </div>
</template>

<script>
import G6 from "@antv/g6";
import { initBehavors } from "@/behavior";
import { initItems } from "@/Item";
var newEdge = {};
export default {
  name: "Home",
  data() {
    return {
      height: document.documentElement.clientHeight,
      width: document.documentElement.clientWidth - 400,
      newNode: {},
      newEdge: {},
      newCombo: {},
      select: {},
      edgeSourceItem: {},
      edgeTargetItem: {},
      edgeSourcePoint: null,
      edgeTargetPoint: null,
      graph: {},
      ghgrid: false,
      ghdata: {
        nodes: [],
        edges: [],
        combos: []
      }
    };
  },
  created() {
    initBehavors();
    initItems();
  },
  mounted() {
    this.$nextTick(() => {
      this.init();
    });
  },
  methods: {
    init() {
      const minimap = new G6.Minimap({
        size: [180, 200],
        container: "minimap",
        className: "minimap",
        type: "default"
      });
      G6.registerBehavior("before-edge", {
        getEvents() {
          return {
            "node:mousedown": "onMouseDown"
          };
        },
        onMouseDown(e) {
          const graph = this.graph;
          if ("index" in e.shape.attrs) {
            if (e.shape.attrs.index == "node") {
              console.log("节点：拖动关键图形");
            } else {
              console.log("节点：拖动锚点");
              if (e.item) {
                const point = e.item.getContainer().get("children")[
                  parseInt(e.shape.attrs.index) + 1
                ];
                point.attr("fill", "#fff");
                point.attr("stroke", "#000");
                point.attr("r", 2.5);
              }
              const uid = Math.round(Math.random() * 100 + 100);
              graph.setMode("addedge");
              newEdge = graph.addItem("edge", {
                id: uid,
                type: "cubic",
                source: e.item.getModel().id,
                sourceAnchor: e.shape.attrs.index,
                target: { x: e.x, y: e.y }
              });
              newEdge.toBack();
            }
          } else {
            console.log("节点：拖动原生图形");
          }
        }
      });
      G6.registerBehavior("add-edge", {
        getEvents() {
          return {
            mousemove: "onMouseMove",
            mouseup: "onMouseUp"
          };
        },
        onMouseMove(e) {
          const graph = this.graph;
          console.log("画布：鼠标移动");
          if (newEdge) {
            graph.updateItem(newEdge, {
              target: { x: e.x, y: e.y }
            });
          }
        },
        onMouseUp(e) {
          const graph = this.graph;
          if (!e.item.getModel()) {
            console.log("节点：松开在画布");
            graph.removeItem(newEdge);
            graph.setMode("default");
            newEdge = {};
            return;
          }
          if ("index" in e.shape.attrs) {
            if (e.shape.attrs.index == "node") {
              console.log("节点：松开在关键图形");
            } else {
              console.log("节点：松开在锚点");
              graph.updateItem(newEdge, {
                target: e.item.getModel().id,
                targetAnchor: e.shape.attrs.index
              });
              graph.setMode("default");
              newEdge = {};
            }
          } else {
            console.log("节点：松开在原生图形");
          }
        }
      });
      this.graph = new G6.Graph({
        container: "mountNode",
        width: this.width,
        height: this.height,
        fitCenter: false,
        groupByTypes: false,
        defaultNode: {
          style: {
            fill: "#fff",
            stroke: "#000"
          },
          linkPoints: {
            top: true,
            bottom: true,
            left: true,
            right: true,
            size: 5,
            fill: "#fff",
            stroke: "#000"
          },
          anchorPoints: [
            [0.5, 0],
            [1, 0.5],
            [0.5, 1],
            [0, 0.5]
          ]
        },
        nodeStateStyles: {
          hover: {
            fill: "#e5f2ff",
            stroke: "#66C4FF"
          }
        },
        defaultEdge: {
          style: {
            stroke: "#000",
            endArrow: true
          }
        },
        edgeStateStyles: {
          hover: {
            stroke: "#66C4FF"
          }
        },
        defaultCombo: {
          style: {
            lineWidth: 1
          }
        },
        comboStateStyles: {
          hover: {
            lineWidth: 3
          }
        },
        modes: {
          default: [
            "drag-canvas",
            "zoom-canvas",
            "drag-combo",
            "drag-node",
            "hover-node",
            "hover-edge",
            "hover-combo",
            "before-edge"
          ],
          addedge: ["add-edge"]
        },
        plugins: [minimap]
      });
      this.graph.on("node:click", e => {
        this.select = { ...e.item.getModel() };
      });
      this.readData();
    },
    readData() {
      this.graph.read(this.ghdata);
      this.graph.render();
    },
    addNode() {
      const size = this.newNode.size.split(/[ ，。 !\\?'",;.]+/);
      let nodeSize = [];
      for (let index = 0; index < size.length; index++) {
        nodeSize.push(parseInt(size[index]));
      }
      this.graph.addItem("node", {
        id: this.newNode.id,
        type: this.newNode.type,
        label: this.newNode.label,
        size: nodeSize,
        x: parseInt(this.newNode.x),
        y: parseInt(this.newNode.y),
        comboId: null
      });
      this.newNode = {};
    },
    addEdge() {
      console.log(this.newEdge);
      this.graph.addItem("edge", this.newEdge);
      this.newEdge = {};
    },
    addCombo() {
      const size = this.newCombo.size.split(/[ ，。 !\\?'",;.]+/);
      const combos = this.newCombo.combo.split(/[ ，。 !\\?'",;.]+/);
      let comboSize = [];
      for (let index = 0; index < size.length; index++) {
        comboSize.push(parseInt(size[index]));
      }
      this.graph.addItem("combo", {
        id: this.newCombo.id,
        type: this.newCombo.type,
        label: this.newCombo.label,
        size: comboSize
      });
      for (let index = 0; index < combos.length; index++) {
        console.log(combos[index]);
        for (let indey = 0; indey < this.ghdata.nodes.length; indey++) {
          console.log(this.ghdata.nodes[indey].id);
          if (this.ghdata.nodes[indey].id == combos[index]) {
            this.ghdata.nodes[indey].comboId = this.newCombo.id;
          }
        }
      }
      this.newCombo = {};
    },
    switchGrid() {
      this.ghgrid = !this.ghgrid;
      if (this.ghgrid) {
        this.grid = new G6.Grid();
        this.graph.addPlugin(this.grid);
      } else {
        this.graph.removePlugin(this.grid);
      }
    },
    print() {
      console.log(this.graph.save());
    },
    handleDragEnd(e) {
      let str = Math.round(Math.random() * 100).toString();
      let point = this.graph.getPointByClient(e.clientX, e.clientY);
      this.graph.addItem("node", {
        id: str,
        type: "ownrect",
        label: str,
        size: [80, 80],
        x: parseInt(point.x - 40),
        y: parseInt(point.y - 40),
        comboId: null
      });
    },
    update() {
      const item = this.graph.findById(this.select.id);
      const size = JSON.stringify(this.select.size).split(
        /[ [\]，。 !\\?'",;.]+/g
      );
      console.log(size);
      this.graph.updateItem(item, {
        label: this.select.label,
        size: [parseInt(size[1]), parseInt(size[2])],
        type: this.select.type,
        style: this.select.style
      });
    }
  }
};
</script>

<style scoped>
.home {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.main {
  position: relative;
}
.silder,
.menu {
  box-shadow: 0 0 10px #505050;
  padding: 10px;
}
#minimap {
  border: #505050 1px solid;
}
</style>
