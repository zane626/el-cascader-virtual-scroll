<template>
  <div class="App">
    <el-row>
      <el-col :span="4">
        1.切换demo
      </el-col>
      <el-col :span="20">
        <el-radio-group v-model="demo" size="small">
          <el-radio-button label="demo0">虚拟滚动</el-radio-button>
          <el-radio-button label="demo1">自定义高度</el-radio-button>
        </el-radio-group>
      </el-col>
    </el-row>
    <component :is="demo"/>
  </div>
</template>

<script>
/**
 * Created by zane on 2023/7/21 21:49
 * @description .
 */
import demo0 from './components/demo0'
import demo1 from './components/demo1'

export default {
  name: 'App',
  components: {
    demo0,
    demo1
  },
  data () {
    return {
      demo: 'demo0'
    }
  },
  methods: {}
}
</script>

<style scoped lang="scss">
.App {
}
</style>
