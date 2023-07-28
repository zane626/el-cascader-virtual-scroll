<script>
import CascaderNode from './cascader-node.vue'
import Locale from 'element-ui/lib/mixins/locale'
import { generateId } from 'element-ui/lib/utils/util'

export default {
  name: 'ElCascaderMenu',

  mixins: [Locale],

  inject: ['panel'],

  components: {
    CascaderNode
  },

  props: {
    nodes: {
      type: Array,
      required: true
    },
    index: Number,
    canScroll: {
      type: Boolean,
      default: true
    }
  },

  data () {
    return {
      activeNode: null,
      hoverTimer: null,
      id: generateId(),
      count: 0,
      lastScrollTop: null,
      distance: 34,
      lineTopHeight: 0,
      lineBottomHeight: 0,
      canLoadmore: true,
      previewList: [],
      displayCount: 0
    }
  },

  computed: {
    isEmpty () {
      return !this.nodes.length
    },
    menuId () {
      return `cascader-menu-${this.id}-${this.index}`
    },
    virtualScrollHeight () {
      return this.panel.props.hasOwnProperty('height') ? this.panel.props.height : 360
    },
    height () {
      return this.panel.props.hasOwnProperty('rowHeight') ? this.panel.props.rowHeight : 52
    }
  },

  mounted () {
    if (!this.isEmpty) {
      this.initData()
      this.handleScroll()
    }
  },

  methods: {
    handleExpand (e) {
      this.activeNode = e.target
    },
    handleMouseMove (e) {
      const { activeNode, hoverTimer } = this
      const { hoverZone } = this.$refs

      if (!activeNode || !hoverZone) return

      if (activeNode.contains(e.target)) {
        clearTimeout(hoverTimer)

        const { left } = this.$el.getBoundingClientRect()
        const startX = e.clientX - left
        const { offsetWidth, offsetHeight } = this.$el
        const top = activeNode.offsetTop
        const bottom = top + activeNode.offsetHeight

        hoverZone.innerHTML = `
          <path style="pointer-events: auto;" fill="transparent" d="M${startX} ${top} L${offsetWidth} 0 V${top} Z" />
          <path style="pointer-events: auto;" fill="transparent" d="M${startX} ${bottom} L${offsetWidth} ${offsetHeight} V${bottom} Z" />
        `
      } else if (!hoverTimer) {
        this.hoverTimer = setTimeout(this.clearHoverZone, this.panel.config.hoverThreshold)
      }
    },
    clearHoverZone () {
      const { hoverZone } = this.$refs
      if (!hoverZone) return
      hoverZone.innerHTML = ''
    },

    renderEmptyText (h) {
      return (
        <div class="el-cascader-menu__empty-text">{this.t('el.cascader.noData')}</div>
      )
    },
    renderNodeList (h) {
      const { menuId } = this
      const { isHoverMenu } = this.panel
      const events = { on: {} }

      if (isHoverMenu) {
        events.on.expand = this.handleExpand
      }

      const nodes = this.previewList.map((node, index) => {
        const { hasChildren } = node
        return (
          <cascader-node
            key={ node.uid }
            node={ node }
            node-id={ `${menuId}-${index}` }
            aria-haspopup={ hasChildren }
            aria-owns = { hasChildren ? menuId : null }
            { ...events }></cascader-node>
        )
      })

      return [
        ...nodes,
        isHoverMenu ? <svg ref="hoverZone" class="el-cascader-menu__hover-zone"></svg> : null
      ]
    },
    initData () {
      this._rowsInWindow = Math.ceil(this.virtualScrollHeight / this.height)
      this._above = this._rowsInWindow * 2
      this._below = this._rowsInWindow
      this._max = this._rowsInWindow * this.height
    },
    handleScroll () {
      let _scrollTop = this.$el.scrollTop
      let _height = this.$el.querySelectorAll('ul')[0].offsetHeight
      let _contentHeight = this.virtualScrollHeight
      // Counts the number of rows on the current screen
      if (_scrollTop / this.height - Math.floor(_scrollTop / this.height) > 0.5) {
        this.displayCount = Math.ceil(_scrollTop / this.height)
      } else {
        this.displayCount = Math.floor(_scrollTop / this.height)
      }

      // if the maximum height is exceeded, reset the previewList
      if (this.lastScrollTop === null || Math.abs(_scrollTop - this.lastScrollTop) > this._max) {
        this.lastScrollTop = _scrollTop
      } else {
        if (this.to === this.nodes.length && _height - _scrollTop - _contentHeight < this.distance) {
          this.canScroll && this.loadmore(this.from, this.to)
        }
        return
      }

      // get from and to count
      let _from = parseInt(_scrollTop / this.height) - this._above
      if (_from < 0) {
        _from = 0
      }
      let _to = _from + this._above + this._below + this._rowsInWindow
      if (_to > this.nodes.length) {
        _to = this.nodes.length
      }
      this.from = _from
      this.to = _to

      // set top height and bottom height
      this.lineTopHeight = _from * this.height
      this.lineBottomHeight = (this.nodes.length - _to) * this.height
      // dispatch data
      if (typeof this.dispatchData === 'function') {
        this.dispatchData(this)
      }

      this.resetPreviewList(_from, _to)

      this.$nextTick(() => {
        let _scrollTop = this.$el.scrollTop
        let _height = this.$el.querySelectorAll('ul')[0].offsetHeight
        let _contentHeight = this.virtualScrollHeight
        if (_to === this.nodes.length && _height - _scrollTop - _contentHeight < 100) {
          this.canScroll && this.loadmore(this.from, this.to)
        }
      })
    },
    loadmore (from, to) {
      if (!this.canLoadmore) return
      this.canLoadmore = false
      let _from = from
      let _to = to + this._below
      this.resetPreviewList(_from, _to)
      this.lineBottomHeight = (this.nodes.length - _to) * this.height
      this.handleScroll()
      this.canLoadmore = true
    },
    resetPreviewList (from, to) {
      this.previewList = []
      for (; from < to; from++) {
        if (this.nodes[from]) {
          this.previewList.push(this.nodes[from])
        }
      }
    }
  },

  render (h) {
    const { isEmpty, menuId } = this
    const events = { }

    // optimize hover to expand experience (#8010)
    if (this.panel.isHoverMenu) {
      events.mousemove = this.handleMouseMove
      // events.nativeOn.mouseleave = this.clearHoverZone;
    }
    const style = {
      paddingTop: this.lineTopHeight + 'px',
      paddingBottom: this.lineBottomHeight + 'px'
    }
    return (
      <div
        onScroll={this.handleScroll}
        class="infiniteList">
        <ul
          style={style}
          role="menu"
          id={menuId}
          class="el-cascader-menu"
          {...events}>
          {isEmpty ? this.renderEmptyText(h) : this.renderNodeList(h)}
        </ul>
      </div>
    )
  }
}
</script>

<style lang="scss" scoped>
.infiniteList {
  height: 100%;
  overflow-y: auto;

  &::scroll-bar {
    width: 0;
  }

  ul {
    box-sizing: content-box !important;
    overflow: hidden;
    margin: 0;
    padding: 0;
    height: auto;
    display: block;
    line-height: normal;

    li {
      align-items: center !important;

      ::v-deep {
        .el-cascader-node, .el-cascader-node__postfix {
          position: relative;
          top: auto;
          right: 0;
        }
      }
    }
  }
}
</style>
