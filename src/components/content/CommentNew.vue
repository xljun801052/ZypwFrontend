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
      <div class="commentTime">{{ cTimeAfterTransform }}</div>

      <!-- 评论回复数 -->
      <div class="commentReplyCount" @click="replySubComment">
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
  </div>
</template>

<script>
import homepageRequest from "../../network/homepageRequest";
import moment from "moment";

export default {
  name: "CommentNew",
  props: {
    id: {
      type: Number,
    },
    parentId: {
      type: Number,
    },
    userAvatar: {
      type: String,
      default: null,
    },
    username: {
      type: String,
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
  },
  data() {
    return {
      commentReleaseTime: "",
      // 改变一下评论分割线的样式，但是目前没起作用!后面优化一下~
      // seperateLineOrientation: 1,
      // seperateLineSize: "small",

      isCurrentUserCommented: true,
    };
  },
  computed: {
    cTimeAfterTransform() {
      this.commentReleaseTime = moment(this.commentTime).fromNow();
      return this.commentReleaseTime;
    },
  },
  methods: {
    // 对子评论进行恢复
    replySubComment() {
      this.$emit("replySubComment", {
        id: this.id,
        username: this.username,
        commentContent: this.commentContent,
      });
    },
    deleteComment() {
      homepageRequest({
        url: "/comment/delete/" + this.id,
        method: "POST",
      }).then((res) => {
        if (res.data.msg == "success") {
          for (let i = 0; i < this.$parent.$parent.allSubComments.length; i++) {
            if (this.id == this.$parent.$parent.allSubComments[i].id) {
              console.log(
                "即将被删除的comment:" +
                  this.$parent.$parent.allSubComments[i].commentContent
              );
              this.$parent.$parent.allSubComments.splice(i, 1);
            }
          }
          alert("delete comment successfully!");
        } else {
          alert("服务器开小差了...请稍后重试");
        }
      });
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
</style>
