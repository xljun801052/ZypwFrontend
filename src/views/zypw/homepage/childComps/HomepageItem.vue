<template>
  <div id="homepageItem">
    <!--帖子标题-->
    <div class="article_title" @click="showContentDetails">
      {{ item.title }}
    </div>

    <!--帖子的分类、标签、发布时间、阅读数等信息-->
    <div class="abstract">
      分类:{{item.category}}||标签：{{ item.tags }}||发布于:{{ formatReleaseTime(item.releaseTime) }}||阅读数:{{
        item.readTimes
      }}
    </div>

    <!--帖子内容信息-->
    <div>
      <div class="contentAbstract" v-html="item.content"></div>
      <div class="readMore">
        <a href="javascript:void(0);" @click="showContentDetails(item.id)"
          >阅读更多</a
        >
      </div>
    </div>

    <!---->
  </div>
</template>

<script>
import dayjs from "dayjs";
export default {
  name: "HomepageItem",
  props: {
    item: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  methods: {
    // 展示文章详情内容
    showContentDetails(arti_id) {
      this.$router.push("/article_detail/" + arti_id);
    },
    formatReleaseTime(date){
      return dayjs(date).format('YYYY-MM-DD');
    }
  },
};
</script>

<style scoped>
.article_title {
  font-family: 楷体;
  font-weight: bold;
  font-size: 30px;
  color: white;
  background: rgba(0, 255, 153, 0.5);
  border-radius: 15px;
}

.abstract {
  font-family: 楷体;
  font-weight: bold;
  font-size: 25px;
  color: #2dfdaa;
}

/*文本超过限制时用...进行显示代替*/
.contentAbstract {
  font-family: 楷体;
  font-size: 15px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  height: 100px;
  width: 1000px;
  color: #2dfdaa;
}

.readMore {
  font-family: 楷体;
  font-size: 18px;
  color: #2dfdaa;
  text-align: center;
  margin-top: 10px;
}

</style>
