<template>
  <div class="comment_item">
    <Scroll ref="commentDetailRef">
      <!--父评论信息-->
      <div class="parentCommentContent">
        <CommentNew
          class="subComment"
          :userAvatar="parentComment.userAvatar"
          :username="parentComment.username"
          :commentContent="parentComment.commentContent"
          :commentTime="parentComment.commentTime"
          :commentFavoriteCount="parentComment.commentFavoriteCount"
          :isCurrentUserFavorite="parentComment.isCurrentUserFavorite"
        />
      </div>
      <Divider solid class="seperateLine" />

      <!--子评论信息-->
      <div
        class="allSubComments"
        v-for="(commentItem, index) in allSubComments"
        :key="index"
      >
        <CommentNew
          class="subComment"
          :id="commentItem.id"
          :userAvatar="commentItem.userAvatar"
          :username="commentItem.username"
          :commentContent="commentItem.commentContent"
          :commentTime="commentItem.commentTime"
          :commentFavoriteCount="commentItem.commentFavoriteCount"
          :isCurrentUserFavorite="commentItem.isCurrentUserFavorite"
        />
        <Divider dashed class="seperateLine" />
      </div>

      <!-- 发表评论部分 -->
      <div class="releaseCommentArea">
        <vue-editor v-model="comment"></vue-editor>
        <div class="commentInfoClick">
          <Button type="primary" class="commentHandle">爷,说两句</Button>
          <Button type="dashed" class="commentHandle">缄默不言</Button>
        </div>
        <div>{{ comment }}</div>
      </div>
    </Scroll>
  </div>
</template>

<script>
import { VueEditor, Quill } from "vue2-editor";
import homepageRequest from "../../network/homepageRequest";
import Scroll from "../common/Scroll";
import CommentNew from "./CommentNew";

export default {
  name: "Comment",
  components: {
    Scroll,
    CommentNew,
    VueEditor,
    Quill,
  },
  data() {
    return {
      commentReleaseTime: "",
      // 改变一下评论分割线的样式，但是目前没起作用!后面优化一下~
      // seperateLineOrientation: 1,
      // seperateLineSize: "small",
      allSubComments: [],
      parentComment: {
        id: null,
        userAvatar: null,
        username: null,
        commentContent: null,
        commentTime: null,
        commentFavoriteCount: null,
        commentReplyCount: null,
      },
    };
  },
  computed: {
    cTimeAfterTransform() {
      let newDate = new Date(); //传入一个时间格式，如果不传入就是获取现在的时间了，这样做不兼容火狐。
      let newTime = newDate.getTime(); // 获取指定时间点的时间戳
      let gapTime = (newTime - this.commentTime) / 1000;
      let day = Math.floor(gapTime / (24 * 3600));
      let hour = Math.floor((gapTime - day * 24 * 3600) / 3600);
      let minute = Math.floor((gapTime - day * 24 * 3600 - hour * 3600) / 60);
      let second = gapTime - day * 24 * 3600 - hour * 3600 - minute * 60;
      if (day > 0) {
        this.commentReleaseTime = day + "天前";
      } else if (hour > 0) {
        this.commentReleaseTime = hour + "小时前";
      } else if (minute > 0) {
        this.commentReleaseTime = minute + "分钟前";
      } else {
        this.commentReleaseTime = "刚刚";
      }
      return this.commentReleaseTime;
    },
  },
  methods: {
    reply(id) {
      console.log("進行回復...");
    },
    getSubCommentsContent(pid) {
      homepageRequest({
        url: "/article/subComments",
        method: "post",
        data: {
          parentId: pid,
          aaa: "bbb",
        },
      }).then((res) => {
        console.log("子评论数据:"+res.data);
        this.allSubComments = res.data;
      });
    },
  },
  created() {
    // 从路由中获取参数信息
    this.parentComment = this.$route.query;
    // 发送请求获取数据,
    // 这个地方有个BUG：如果循环引用会导致请求不停地发送....所以封装了CommentNew
    this.getSubCommentsContent(this.parentComment.id);
  },
  updated() {
    this.$refs.commentDetailRef.refresh();
  },
};
</script>

<style scoped>
.commentUserInfo {
  display: flex;
  font-size: 18px;
  font-weight: bolder;
  font-family: 楷体;
}

.avatar {
  height: 30px;
  width: 30px;
  border-radius: 50%;
  margin-left: 5px;
}

.commentUserInfo img {
  margin-right: 5px;
}

.commentFavoriteCount {
  display: flex;
  position: relative;
  right: -60%;
  align-items: center;
  overflow: hidden;
}

.commentContent {
  position: relative;
  left: 42px;
  width: 60%;
}

.commentRelatedInfo {
  display: flex;
}

.commentTime {
  position: relative;
  display: flex;
  justify-content: space-around;
  align-items: center;
  left: 42px;
  top: 10px;
  border: 1px dashed grey;
  width: 60px;
  border-radius: 20%;
  background: rgba(100, 50, 50, 0.1);
}

.commentReplyCount {
  position: relative;
  display: flex;
  justify-content: space-around;
  align-items: center;
  left: 60px;
  top: 10px;
  border: 1px dashed grey;
  width: 60px;
  border-radius: 20%;
  background: rgba(100, 50, 50, 0.1);
}

.favorite {
  position: relative;
  bottom: -30px;
  border-right: 20px solid transparent;
  -webkit-filter: drop-shadow(20px 0);
  filter: drop-shadow(0px -30px rgb(255, 0, 51));
}

.favoriteC {
  margin-left: -20px;
}

.releaseCommentArea {
  display: flex;
  flex-direction: column;
  background: rgba(255, 255, 255, 0.5);
}

.commentInfoClick {
  padding-top: 10px;
  padding-bottom: 10px;
  display: flex;
  justify-content: space-evenly;
}
.commentHandle {
  font-size: 15px;
  font-family: 楷体;
}
</style>
