class SimpleTopo {
  constructor({
    el,
    background,
    backgroundColor,
    direction = 'vertical',
    mode
  }) {
    this.canvas = document.getElementById(el)
    if (!el) {
      throw new Error('Private a canvas element')
    }
    this.resize()
    this.direction = direction

    this.stage = new JTopo.Stage(canvas)
    this.scene = new JTopo.Scene()
    mode && (this.scene.mode = mode)

    if (backgroundColor) this.scene.backgroundColor = backgroundColor
    if (background) this.scene.background = background

    this.stage.add(this.scene);

    this.nodeList = []
    this.nodeMap = {}

    this.linkList = []
    this.linkMap = {}

    this.bindEvent()
  }

  fit() {
    this.scene.centerAndZoom(1, 1, stage)
  }

  createNode({ x, y, img, id, alarm }) {
    var node = new JTopo.Node();
    // 路径需要修改
    node.setImage('/image/' + img, true);
    node.setLocation(x, y);
    node.uuid = id
    node.alarm = alarm
    return node
  }

  // 折线或者直线
  createLink(nodeA, nodeZ, type) {
    var link;
    switch (type) {
      // 折线
      case 'fold':
        link = new JTopo.FoldLink(nodeA, nodeZ);
        break;
      // 二次折线
      case 'flex':
        link = new JTopo.FlexionalLink(nodeA, nodeZ);
        link.shadow = false;
        link.offsetGap = 44;
        break;
      default:
        link = new JTopo.Link(nodeA, nodeZ);
        break;
    }
    link.direction = this.direction;
    return link
  }

  createFlexLink(nodeA, nodeZ) {
    var link = new JTopo.FlexionalLink(nodeA, nodeZ);

    return link;
  }

  createElement(type, data) {

  }

  resize() {
    let parat = this.canvas.parentElement
    canvas.width = parat.clientWidth
    canvas.height = parat.clientHeight
  }

  on() {

  }



  draw({ nodes, links }) {
    const { scene, nodeMap, nodeList, linkMap, linkList } = this

    if (nodes) {
      nodes.forEach(n => {
        const node = this.createNode(n)
        node.uuid = n.id
        nodeMap[n.id] = node
        nodeList.push(node)
        scene.add(node)
      })
    }

    if (links) {
      links.forEach(l => {
        const link = this.createLink(nodeMap[l.sId], nodeMap[l.eId], l.type)
        link.uuid = l.id
        linkMap[l.id] = link
        linkList.push(link)
        scene.add(link)
      })
    }
  }

  clear() {

  }

  remove() {

  }

  bindEvent() {
    let that = this
    window.addEventListener('resize', function (params) {
      that.resize()
    })
  }
}

// export default SimpleTopo
