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

  createNode({ x, y, img, id, alarm, width, height }) {
    var node = new JTopo.Node();
    // 路径需要修改
    node.setImage('/image/' + img, !width);
    node.uuid = id
    node.alarm = alarm
    width ? node.setBound(x, y, width, height) : node.setLocation(x, y)
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

  resize() {
    let parat = this.canvas.parentElement
    canvas.width = parat.clientWidth
    canvas.height = parat.clientHeight
  }

  on(name, callback) {
    this.scene.addEventListener(name, callback)
  }

  draw({ nodes, links }) {
    const { scene, nodeMap, nodeList, linkMap, linkList } = this

    if (nodes) {
      nodes.forEach(n => {
        const node = this.createNode(n)
        node.uuid = n.id
        node.tips = n.tips
        nodeMap[n.id] = node
        nodeList.push(node)
        scene.add(node)
      })
    }

    if (links) {
      links.forEach(l => {
        const link = this.createLink(nodeMap[l.sId], nodeMap[l.eId], l.type)
        link.uuid = l.id
        link.tips = l.tips
        linkMap[l.id] = link
        linkList.push(link)
        scene.add(link)
      })
    }
  }

  clear() {
    this.scene.clear()
  }

  removeNode(id) {
    this._removeElement('node', id)
  }

  removeLink(id) {
    this._removeElement('link', id)
  }

  _removeElement(type, id) {
    let map, list, element
    switch (type) {
      case 'node':
        map = this.nodeMap
        list = this.nodeList
        break;
      case 'link':
        map = this.linkMap
        list = this.linkList
        break
      default:
        return
    }

    element = map[id]

    if (!element) {
      return
    }

    this.scene.remove(element)
    delete map[id]
    removeFromArray(list, element)
  }

  bindEvent() {
    let that = this
    window.addEventListener('resize', function (params) {
      that.resize()
    })

    let hoverTarget = null

    this.on('mouseover', function (e) {
      let target = e.target
      console.log(target)
      if (!target || !target.tips) {
        return
      }
      hoverTarget = target
      target.text = target.tips
    })

    this.on('mouseout', function (e) {
      if (!hoverTarget) {
        return
      }
      hoverTarget.text = undefined
      hoverTarget = null
    })

  }
}

function removeFromArray(arr, el) {
  arr.splice(arr.indexOf(el), 1)
}

// export default SimpleTopo
