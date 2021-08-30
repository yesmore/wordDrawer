<template>
  <div id="wrapper">
    <a-row>
      <a-card
        class="main-card"
        style="width:100%"
        hoverable
        :bodyStyle={padding:0}
        :tab-list="tabList"
        :active-tab-key="key"
        @tabChange="key => onTabChange(key, 'key')" >

        <!-- 输入框 -->
        <a-input-search 
            v-if="searchType !== 'Kw' && searchType !== 'Abstract' "
            v-model="keyword" 
            :placeholder=placeholder 
            :disabled="searchType === 'Hot' "
            @search="onSearch" 
            @change="onChange"
            size="large"/>
        
        <a-input-group compact v-else >
          <!-- <a-select default-value="3" @change="choiceNum">
            <a-select-option value='3'>
              提取 3 个关键词
            </a-select-option>
            <a-select-option value='4'>
              提取 4 个关键词
            </a-select-option>
          </a-select> -->
          <a-textarea 
            allow-clear 
            @change="onChange"
            v-model="keyword"
            style="width: 100%" 
            :placeholder=placeholder  
            :rows="5"
            />
        </a-input-group>

        <!-- 加载图标 -->
        <div v-if="loading1" class="demo-loading-container">
          <a-spin>
            <a-icon slot="indicator" type="loading-3-quarters" style="font-size: 24px" spin />
          </a-spin>
        </div>

        <!-- 搜索结果 -->
        <div
          v-infinite-scroll="handleInfiniteOnLoad"
          class="demo-infinite-container"
          :infinite-scroll-disabled="busy"
          :infinite-scroll-distance="10" >
          <!-- 空 -->
          <a-empty v-if="searchList === ''" 
                   :description="false"
                   image="https://cdn.jsdelivr.net/gh/yesmore/img/imgs/202108301200714.png"
                   :image-style="{
                     height: '70px',
                   }">
            <a-button type="dashed">
              wordDrawer：开始探索吧！
            </a-button>
            <a-divider />
            <a-icon style="font-size: 24px" type="github" /><br>
            <img src="https://img.shields.io/github/stars/bai-23/italk-uniapp.svg" alt="">
            <img src="https://img.shields.io/github/downloads/molunerfinn/PicGo/total.svg" alt="">
          </a-empty>
          
          <!-- 翻译&缩写 -->
          <div v-else-if="searchType !== 'Idiom' && searchType !== 'Hot' && searchType !== 'Kw' && searchType !== 'Abstract' && searchType !== 'Xhzd'"
               class="search-res">
               <a-button style="float:right" class="tag-read" :data-clipboard-text="searchList" @click="copy" shape="round" size="small">copy</a-button>
            {{ searchList }}  
          </div>

          <!-- 成语 -->
          <a-list v-if="searchType === 'Idiom'" :data-source="searchList">
            <a-list-item slot="renderItem" slot-scope="item">
              <a-list-item-meta :description="'译：'+item.explanation">
                <a-button slot="title" style="float:right" class="tag-read" :data-clipboard-text="item.word" @click="copy" shape="round" size="small" >copy</a-button>
                <a slot="title" href="javascript:;;"><strong>{{ item.word }}</strong> （ {{ item.pinyin }}）</a>
              </a-list-item-meta>
              <a-divider type="vertical" />
              <a-list-item-meta :description="item.derivation">
                <a slot="title" href="javascript:;;">出自：</a>
              </a-list-item-meta>
            </a-list-item>    
          </a-list>

          <!-- 新华字典 -->
          <div class="xhzd" v-if="searchType === 'Xhzd' && searchList !== ''" >
            共查询到 <strong>{{searchList.length}}</strong> 条结果：
            <div style="margin: 10px 0"></div>
            <a-card v-for="item in searchList" :key="item.word"
                    :title="'《新华字典》：“'+item.word+'”'">
              <a-card-meta :title="item.word+' '+item.pinyin">
                <template slot="description">
                  笔画：{{ item.strokes }}，部首：{{ item.radical }}
                  <a-divider />
                  <a-button style="float:right" class="tag-read" :data-clipboard-text="item.explanation" @click="copy" shape="round" size="small">copy</a-button>
                  解释：{{ item.explanation || '无' }}
                  <a-divider />
                  <a-button style="float:right" class="tag-read" :data-clipboard-text="item.more" @click="copy" shape="round" size="small">copy</a-button>
                  更多：{{ item.more || '无' }}
                </template>
              </a-card-meta>
            </a-card>
          </div>
          
          <!-- 热词 -->
          <div v-if="searchType === 'Hot' && searchList !== ''">
            <a-divider>网路热词</a-divider>
            <a-badge
              v-for='item in searchList.hot'
              :key="item.link"
              :count=item.title
              :number-style="{
                backgroundColor: '#fff',
                color: '#999',
                fontSize: '14px',
                marginTop: '8px',
                marginRight: '8px',
                boxShadow: '0 0 0 1px #d9d9d9 inset',
              }"
            />
            <a-divider>最新热词</a-divider>
            <a-badge
              v-for='item in searchList.new'
              :key="item.link"
              :count=item.title
              :number-style="{
                backgroundColor: '#fff',
                color: '#999',
                fontSize: '14px',
                marginTop: '8px',
                marginRight: '8px',
                boxShadow: '0 0 0 1px #d9d9d9 inset',
              }"
            />
            <a-divider>更新日期：{{ searchList.last_update }}</a-divider>
          </div>

          <!-- 关键词 -->
          <div v-if="searchType === 'Kw' && searchList !== ''" class="search-res">
            <a-button slot="title" style="float:right" class="tag-read" :data-clipboard-text="searchList" @click="copy" shape="round" size="small" >copy</a-button>
            关键词：<strong>{{ searchList.join('，') }}</strong>
          </div>

          <!-- 摘要 -->
          <div v-if="searchType === 'Abstract' && searchList !== ''" class="search-res">
            <a-button slot="title" style="float:right" class="tag-read" :data-clipboard-text="searchList" @click="copy" shape="round" size="small" >copy</a-button>
            摘要：<strong>{{ searchList.join(`，`) }}</strong>
          </div>
        </div>
      </a-card>
    </a-row>
  </div>
</template>

<script>
  import infiniteScroll from 'vue-infinite-scroll'
  import Clipboard from 'clipboard'
  
  const clipboard = new Clipboard('.tag-read')
  // 防抖
  function debounce (fn, t) {
    let delay = t || 400
    let timer
    return function () {
      let args = arguments
      if (timer) {
        clearTimeout(timer)
      }
      timer = setTimeout(() => {
        timer = null
        fn.apply(this, args)
      }, delay)
    }
  }

  export default {
    directives: { infiniteScroll },
    name: 'landing-page',
    components: {},
    data () {
      return {
        clipboard,
        keyword: '', // 搜索关键词
        searchList: '', // 搜索结果
        searchType: 'Translate',
        placeholder: '请输入翻译内容，按 Enter 开始搜索',
        tabList: [
          {
            key: 'Translate',
            tab: '翻译',
            scopedSlots: { tab: 'customRender' }
          },
          {
            key: 'Abbr',
            tab: '缩写'
          },
          {
            key: 'Xhzd',
            tab: '新华字典'
          },
          {
            key: 'Idiom',
            tab: '成语'
          },
          {
            key: 'Kw',
            tab: '关键词'
          },
          {
            key: 'Abstract',
            tab: '摘要生成'
          },
          {
            key: 'Hot',
            tab: '热词'
          }
        ],
        key: 'Translate',
        loading: false,
        loading1: false,
        busy: false,
        num: 3 // 提取关键词个数
      }
    },
    methods: {
      async onSearch () {
        this.loading1 = true
        let res
        if (this.keyword !== '') {
          if (this.searchType === 'Translate') {
            res = await this.$http.get('http://dict.youdao.com/suggest?num=1&doctype=json&q=' + this.keyword)
            if (res.data.result.code === 200) {
              this.searchList = res.data.data.entries[0].explain
            } else {
              this.$message.warning('换个词试试')
            }
            this.loading1 = false
          } else if (this.searchType === 'Abbr') {
            res = await this.$http.get('https://v2.alapi.cn/api/abbr?token=XRvwH8gtamy4uOga&abbr=' + this.keyword)
            if (res.data.code === 406) {
              this.$message.warning('换个缩写试试')
            } else {
              this.searchList = res.data.data.explain
            }
            this.loading1 = false
          } else if (this.searchType === 'Xhzd') {
            res = await this.$http.get('https://v2.alapi.cn/api/word?token=XRvwH8gtamy4uOga&word=' + this.keyword)
            if (res.data.code === 200) {
              this.searchList = res.data.data
            } else {
              this.$message.warning('请输入汉字')
            }
            this.loading1 = false
          } else if (this.searchType === 'Idiom') {
            res = await this.$http.get('https://v2.alapi.cn/api/idiom?token=XRvwH8gtamy4uOga&abbr&word=' + this.keyword)
            if (res.data.code === 200) {
              this.searchList = res.data.data
            } else {
              this.$message.warning('换一个试试')
            }
            this.loading1 = false
          } else if (this.searchType === 'Kw') {
            res = await this.$http.get('https://v2.alapi.cn/api/nlp/keyword?token=XRvwH8gtamy4uOga&text=' + this.keyword + '&num=' + this.num)
            if (res.data.code === 200) {
              this.searchList = res.data.data
            } else {
              this.$message.warning('提取失败')
            }
            this.loading1 = false
          } else if (this.searchType === 'Abstract') {
            res = await this.$http.get('https://v2.alapi.cn/api/nlp/summary?token=XRvwH8gtamy4uOga&text=' + this.keyword + '&num=' + this.num)
            if (res.data.code === 200) {
              this.searchList = res.data.data
            } else {
              this.$message.warning('生成失败')
            }
            this.loading1 = false
          }
        } else {
          this.openNotificationWithIcon('warning')
        }
        this.loading1 = false
      },
      onChange: debounce(function () {
        if (this.keyword !== '') {
          this.onSearch()
        }
      }),
      onTabChange (key, type) {
        this.searchList = ''
        this.keyword = ''
        this[type] = key
        if (key === 'Translate') {
          this.searchType = 'Translate'
          this.placeholder = '请输入翻译内容，按Enter查询'
        } else if (key === 'Abbr') {
          this.searchType = 'Abbr'
          this.placeholder = '请输入缩写，例如“yyds”、“awsl”、“nmsl”...'
        } else if (key === 'Xhzd') {
          this.searchType = 'Xhzd'
          this.placeholder = '请输入汉字'
        } else if (key === 'Idiom') {
          this.searchType = 'Idiom'
          this.searchList = []
          this.placeholder = '请输入字符，例如“天”、“一日”、“你”...'
        } else if (key === 'Hot') {
          this.searchType = 'Hot'
          this.fetchHot()
          this.placeholder = '网络热词系列'
        } else if (key === 'Kw') {
          this.searchType = 'Kw'
          this.placeholder = `键入您需要提取关键词的文本，例如“希尔排序按其设计者希尔（Donald Shell）的名字命名，该算法由1959年公布；希尔算法首次突破了计算机界一直认为的算法的时间复杂度都是O(N2)的大关，为了纪念该算法里程碑式的意义，用Shell来命名该算法。” 
关键词：算法, 希尔, Shell`
        } else if (key === 'Abstract') {
          this.searchType = 'Abstract'
          this.placeholder = `键入您需要生成摘要的文本，例如“希尔排序按其设计者希尔（Donald Shell）的名字命名，该算法由1959年公布；希尔算法首次突破了计算机界一直认为的算法的时间复杂度都是O(N2)的大关，为了纪念该算法里程碑式的意义，用Shell来命名该算法。” 
摘要：希尔排序按其设计者希尔（Donald Shell）的名字命名；用Shell来命名该算法；例如`
        }
      },
      choiceNum (value) {
        this.num = value
      },
      async fetchHot () {
        this.searchList = ''
        this.loading1 = true
        let res = await this.$http.get('https://v2.alapi.cn/api/tophub/wiki?token=XRvwH8gtamy4uOga')
        if (res.data.code === 200) {
          this.searchList = res.data.data
        } else {
          this.$message.warning('出错了')
        }
        this.loading1 = false
      },
      handleInfiniteOnLoad () {
        const data = this.searchList
        if (data.length > 9) {
          // this.$message.warning('换个词试试')
          this.busy = true
        }
      },
      openNotificationWithIcon (type) {
        this.$message.warning('请输入内容')
      },
      copy () {
        this.clipboard.on('success', e => {
          this.$message.success('复制成功', 1)
          //  释放内存
          this.clipboard.destory()
        })
        this.clipboard.on('error', e => {
          // 不支持复制
          this.$message.warning('出错了', 1)
          // 释放内存
          this.clipboard.destory()
        })
      }
    }
  }
</script>

<style>
.demo-infinite-container {
  border-radius: 4px;
  /* overflow: auto; */
  overflow-y: auto;
  padding: 8px 24px;
  height: 300px;
}
.demo-loading-container {
  position: absolute;
  margin-top: 120px;
  width: 100%;
  text-align: center;
}
.search-res {
  font-size: 20px;
  font-family:'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
}
.main-card {
  background: #000;
}
.xhzd .ant-card-head {
  background: rgba(214, 213, 213, 0.445);
}
</style>
