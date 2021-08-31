<template>
  <div id="header">
    <div class="fake-title-bar">
      <span>wordDrawer - 1.0.8-beta.1</span>
      <div class="handle-bar"> <!-- 如果是windows系统 就加上模拟的操作按钮-->
        <a-icon class="icon" type="minus" @click="min"/>
        <a-icon class="icon" type="setting" />
        <a-icon class="icon" type="close" @click="close"/>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Header',
  methods: {
    min () {
      this.$electron.ipcRenderer.send('window-min')
    },
    close () {
      this.$electron.ipcRenderer.send('window-close')
    }
  }
}
</script>

<style lang="scss" scoped>
.fake-title-bar {
  background: #3f3c37!important;
  -webkit-app-region: drag;
  text-align: center;
  color: rgb(230, 230, 230);
  font-size: 12px;
  line-height: 22px;

  span {
    padding-left: 60px; 
  }
}
.handle-bar {
  -webkit-app-region: no-drag;
  float: right;
  font-size: 15px;
  .icon {
    margin-right: 3px;
  }
  .icon:hover {
    color: rgb(74, 201, 218);
  }
}
</style>