<template>
  <div id="footer">
    <div class="foot-bar"> <!-- 如果是windows系统 就加上模拟的操作按钮-->
      <a-icon class="icon" type="info-circle" @click="info"/>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Footer',
  methods: {
    info () {
      const h = this.$createElement
      this.$info({
        title: '隐私协议',
        content: h('div', {}, [
          h('p', '本软件尊重并保护所有使用用户的个人隐私权。本软件承诺，不会进行任何收集、保存使用者信息、搜索记录（本软件未使用数据库，无法存储使用者的数据），若后期进行版本升级，会及时告知用户并保持承诺。请放心使用。')
        ]),
        onOk () {}
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.foot-bar {
  position: fixed;
  bottom: 0;
  left: 4px;
  color: rgb(230, 230, 230)
}
.icon {
    margin-right: 3px;
  }
  .icon:hover {
    color: rgb(74, 201, 218);
  }
</style>