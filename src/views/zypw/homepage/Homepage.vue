<template>
  <div>
    <div id="homepage">
      <div id="homepage-title">
        <span>小日春和-随笔</span>
      </div>

      <Scroll ref="homepageScroll">
        <div id="homepage-content">
          <HomepageItem
            class="homepage-item"
            v-for="(item, index) in currentPageArticles"
            :key="index"
            :item="item"
          >
          </HomepageItem>
        </div>

        <Pagehelper
          @pageChanged="loadCorrespondingPageData"
          class="pagehelper"
          :total="totalActicleCount"
          :pageSize="pageSize"
        />
      </Scroll>
    </div>
  </div>
</template>

<script>
//使用懒加载模式导入组件：当路由被访问时才加载对应的代码，这样就更加高效率了
import homepageAxiosInstance from "../../../network/homepageRequest";

const HomepageItem = () => import("./childComps/HomepageItem");
const Pagehelper = () => import("components/common/Pagehelper");
import Scroll from "../../../components/common/Scroll";

export default {
  name: "homepage",
  components: {
    HomepageItem,
    Pagehelper,
    Scroll,
  },
  data() {
    return {
      currentPageArticles: [],
      totalActicleCount: 0,
      pageSize: 3, // default 3 articles per page.
      currentPage: 1,
    };
  },
  methods: {
    // get corresponding page data
    getCurrentPageArticles(pageSize, currentPage) {
      console.log("current pageSize:"+pageSize+" current page:"+currentPage)
      homepageAxiosInstance({
        url: "/article/detail/more",
        method: "POST",
        data: {
          pageSize,
          currentPage,
        },
      })
        .then((res) => {
          let data = JSON.parse(res.data.data)
          this.currentPageArticles = data.articles;
          this.totalActicleCount = data.total;
        })
        .catch((error) => {
          alert("The server is busy, please try again later.");
          console.log("Error occurs: " + error);
        });
    },
    loadCorrespondingPageData(page) {
      this.currentPage = page;
      this.getCurrentPageArticles(this.pageSize, this.currentPage);
    },
  },
  created() {
    // initialize the first page data
    // let token = window.localStorage.getItem("token")
    // // 组件创建的时候去请求数据，保存在data中
    // homepageRequest({
    //   url: "/article/detail/all",
    //   method: "post",
    //   // 避免请求体为空，导致后台无法获取到requestBody,从而无法修改其内容将userId添加进去
    //   data:{
    //     'aaa':'bbb'
    //   }
    // }).then((res) => {
    //   // console.log(res);
    //   this.allPosts = res;
    //   this.totalActicleCount = res.length;
    // });
  },
  mounted() {
    this.getCurrentPageArticles(this.pageSize, 1);
    // setTimeout(() => {
    //   console.log(this.$refs.homepageScroll.scrollHeight);
    //   this.$refs.homepageScroll.refresh()
    // }, 3000)
    // this.$nextTick(() => {
    //
    //   // console.log("homepage-scrollHeight刷新完毕...")
    // })
  },
  updated() {
    // 因为我这里是静态资源，所以可以不用抖动处理，直接刷新滚动区域高度
    this.$refs.homepageScroll.refresh();
  },
};
</script>

<style>
#homepage {
  position: relative;
  border-radius: 10px;
  height: 400px;
}

span {
  font-family: 楷体;
  font-size: 30px;
  color: rgb(1, 253, 203);
  /*text-shadow: 0 0 20px #fdec84,*/
  /*10px -10px 30px #ffae35,*/
  /*20px -20px 40px #ec760c,*/
  /*-20px -60px 50px #cd4607,*/
  /*0px -80px 60px #973717,*/
  /*10px -40px 70px #451b0e;*/
}

/*头部样式设置：居中对齐*/
#homepage-title {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 10px;
  margin-bottom: 10px;
}

#homepage-content {
  overflow: hidden;
}

/*整体内容样式布局：居中对齐*/
.homepage-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 10px;
  margin-bottom: 40px;
}

.pagehelper {
  font-family: 楷体;
  font-size: 15px;
  text-align: center;
  margin-bottom: 10px;
}
</style>
