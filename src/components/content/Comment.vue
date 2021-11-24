<template>
  <div class="comment_item">
    <!-- 评论者信息 -->
    <div class="commentUserInfo">
      <img v-if="userAvatar" :src="userAvatar" alt="" class="avatar" />
      <img v-else src="~assets/imgs/theme/tutu.png" alt="" class="avatar" />
      <div>{{ username }}:</div>
      <!-- 评论获赞数 -->
      <div class="commentFavoriteCount">
        <img
          src="~assets/imgs/utils/favorite.png"
          alt=""
          :class="{ favorite: isCurrentUserFavorite === 0 ? true : false }"
          @click="changeFavoriteStatus(id)"
        />
        <div :class="{ favoriteC: isCurrentUserFavorite === 0 ? true : false }">
          {{ commentFavoriteCount }}
        </div>
      </div>
    </div>

    <!-- 评论内容 -->
    <div class="commentContent" v-html="commentContent"></div>

    <!-- 评论相关信息 -->
    <div class="commentRelatedInfo">
      <!-- 评论时间 -->
      <div class="commentTime">
        {{ cTimeAfterTransform }}
      </div>

      <!-- 评论回复数 -->
      <div class="commentReplyCount" @click="showSubComment">
        {{ commentReplyCount }}回复
      </div>

      <div
        class="commentDelete"
        v-if="isCurrentUserCommented"
        @click="deleteComment"
      >
        删除
      </div>
    </div>
    <Divider dashed class="seperateLine" />
  </div>
</template>

<script>
import homepageRequest from "../../network/homepageRequest";

export default {
  name: "Comment",
  props: {
    id: {
      type: Number,
      default: 1,
    },
    userAvatar: {
      type: String,
      default: null,
    },
    username: {
      type: String,
      default: "夏李逸笙-parentComment",
    },
    commentContent: {
      type: String,
      default: "",
    },
    // 注意：这里的commentTime最好改成Date!后续优化
    commentTime: {
      type: Number,
      default: 0,
    },
    commentFavoriteCount: {
      type: Number,
      default: 0,
    },
    commentReplyCount: {
      type: Number,
      default: 0,
    },
    isCurrentUserFavorite: {
      type: Number,
      default: 0,
    },
    isCurrentUserCommented: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      commentReleaseTime: "",
      // 改变一下评论分割线的样式，但是目前没起作用!后面优化一下~
      // seperateLineOrientation: 1,
      // seperateLineSize: "small",
      parentId: null,
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
    // 显示子评论详情
    showSubComment() {
      // @TODO:这里要优化一下！哪能这么传参数...
      this.$router.push({
        path: "/subComments",
        query: {
          id: this.id,
          userAvatar: this.userAvatar,
          username: this.username,
          commentContent: this.commentContent,
          commentTime: this.commentTime,
          commentFavoriteCount: this.commentFavoriteCount,
          commentReplyCount: this.commentReplyCount,
        },
      });
    },
    changeFavoriteStatus(cid) {
      // 向后台发送请求更改点赞信息
      homepageRequest({
        url: "/article/changeFavorite",
        method: "post",
        data: {
          cid: cid,
        },
      })
        .then((res) => {
          // 成功了之后改变点赞状态
          if (isCurrentUserFavorite == 0) {
            this.isCurrentUserFavorite = 1;
          } else {
            this.isCurrentUserFavorite = 0;
          }
        })
        .catch((res) => {
          alert("点赞有点小问题");
        });
    },
    deleteComment() {
      homepageRequest({
        url:"/comment/delete/"+this.id,
        method:"POST"
      }).then(res=>{
        if(res.data.msg=="success"){
          this.$emit("commentDelete",this.id)
          for (let i = 0; i < this.$parent.$parent.historyComments.length; i++) {
            if (this.id == this.$parent.$parent.historyComments[i].id) {
              console.log("即将被删除的comment:"+this.$parent.$parent.historyComments[i].commentContent)
              this.$parent.$parent.historyComments.splice(i,1);
            }
          }
          alert("delete comment successfully!")
        }else{
          alert("服务器开小差了...请稍后重试")
        }
      })
    },
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
  position: absolute;
  right: 20%;
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

.commentDelete {
  position: relative;
  display: flex;
  justify-content: space-around;
  align-items: center;
  left: 78px;
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
</style>
