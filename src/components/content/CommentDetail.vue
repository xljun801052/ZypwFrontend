<template>
  <div class="comment_item">
    <Scroll ref="commentDetailRef">
      <div id="commentDetail">
        <!--parent comment info-->
        <div class="parentCommentContent">
          <CommentNew
            :id="Number.parseInt(parentComment.id)"
            :opusId="Number.parseInt(parentComment.opusId)"
            :parentId="parentComment.parentId"
            :userAvatar="parentComment.userAvatar"
            :username="parentComment.username"
            :commentContent="parentComment.commentContent"
            :commentTime="Number.parseInt(parentComment.commentTime)"
            :commentFavoriteCount="parentComment.commentFavoriteCount"
            :isCurrentUserFavorite="parentComment.isCurrentUserFavorite"
          />
        </div>
        <Divider solid class="seperateLine" />

        <!--sub comment info-->
        <div v-for="(commentItem, index) in allSubComments" :key="index">
          <CommentNew
            class="subComment"
            :id="commentItem.id"
            :parentId="commentItem.parentId"
            :opusId="Number.parseInt(commentItem.opusId)"
            :commentOwner="commentItem.commentOwner"
            :userAvatar="commentItem.avatar"
            :username="commentItem.userName"
            :commentContent="commentItem.content"
            :commentTime="commentItem.commentTime"
            :commentFavoriteCount="Number.parseInt(commentItem.favoriteCount)"
            :isCurrentUserFavorite="
              Boolean(commentItem.isCurrentUserFavorite)
            "
            @replySubComment="prepareForReply"
          />
          <Divider dashed class="seperateLine" />
        </div>

        <!-- 发表评论部分 -->
        <div class="releaseCommentArea">
          <Editor
            v-model="commentContent"
            :init="init"
            api-key="pdydaeaw072fplacdenbcb8lepf9j3gjob8m37s4sj7omj30"
            class="editor"
          >
          </Editor>
          <div class="commentInfoClick">
            <Button
              type="primary"
              class="commentHandle"
              @click="releaseReplyForSubComment"
              >爷,说两句</Button
            >
            <Button type="dashed" class="commentHandle">缄默不言</Button>
          </div>
        </div>
      </div>
    </Scroll>
  </div>
</template>

<script>
import homepageRequest from "../../network/homepageRequest";
import Scroll from "../common/Scroll";
import CommentNew from "./CommentNew";
import Editor from "@tinymce/tinymce-vue";
import moment from "moment";

export default {
  name: "CommentDetail",
  components: {
    Scroll,
    CommentNew,
    Editor,
  },
  data() {
    return {
      renderComponent: true,
      commentReleaseTime: "",
      // 改变一下评论分割线的样式，但是目前没起作用!后面优化一下~
      // seperateLineOrientation: 1,
      // seperateLineSize: "small",
      allSubComments: [],
      parentComment: {
        id: 0,
        opusId:null,
        parentId:null,
        userAvatar: "",
        username: "",
        commentContent: "",
        commentTime: "",
        commentFavoriteCount: 0,
        commentReplyCount: 0,
        isCurrentUserFavorite: false,
      },
      currentReplySubCommentInfo: {
        replySubCommentId: 0,
        replySubCommentUser: "",
        replySubCommentContent: "",
      },
      commentContent: "",
      init: {
        height: 350,
        menubar: false,
        plugins: [
          "advlist autolink lists link image charmap print preview anchor",
          "searchreplace visualblocks code fullscreen",
          "insertdatetime media table paste code help wordcount",
        ],
        toolbar:
          "undo redo | formatselect | bold italic backcolor | \
           alignleft aligncenter alignright alignjustify | \
           bullist numlist outdent indent | removeformat | help",
        setup: function (editor) {
          editor.on("focus", function (data) {
            console.log(data.content, data.mode, data.source);
            console.log("focusing....");
            console.log(data);
            alert(window.parentComment.commentContent);
            this.commentContent = "rininainai";
            this.commentContent =
              "@" +
              this.currentReplySubCommentInfo.replySubCommentUser +
              ":" +
              this.currentReplySubCommentInfo.replySubCommentContent;
            // Apply custom filtering by mutating data.content
            const content = data.content;
            const newContent = yourCustomFilter(content);
            data.content = newContent;
          });
        },
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
    // prepare for the subComment reply
    prepareForReply(subCommentInfo) {
      console.log(
        "ready to reply for this comment:{" +
          subCommentInfo.id +
          "---" +
          subCommentInfo.username +
          "---" +
          subCommentInfo.commentContent +
          "}..."
      );
      this.commentContent = "";
      this.currentReplySubCommentInfo.replySubCommentId = subCommentInfo.id;
      this.currentReplySubCommentInfo.replySubCommentUser =
        subCommentInfo.username;
      this.currentReplySubCommentInfo.replySubCommentContent =
        subCommentInfo.commentContent;
      // @todo 跳转到评论框的时候使其自动获取光标焦点.
      // @todo 不能将textarea放在新加的评论上面，要不后面就识别不出来了。。。换了其他标签也没用
      // @todo 回复时将原引用内容剔除掉
      // @todo 内部原评论需要将HTML标签移除
      // @todo 原评论需要加上跳转链接
      this.commentContent =
        "<p>" +
        this.commentContent +
        "</p><textarea readonly style='background-color:lightgray;border-radius:20px;color:white; height:60px; width:440px; overflow:hidden;padding-left:20px;padding-top:10px;'>回复@" +
        this.currentReplySubCommentInfo.replySubCommentUser +
        ":\n" +
        this.currentReplySubCommentInfo.replySubCommentContent +
        "</textarea>";
      // scroll to editor
      let editorEle = document.querySelector(".releaseCommentArea");
      this.$refs.commentDetailRef.scrollToElement(editorEle);
    },
    // get the subCommentContent info
    getSubCommentsContent(pid) {
      homepageRequest({
        url: "/comment/allLayerSubComments",
        method: "post",
        data: {
          scid: Number.parseInt(pid),
        },
      }).then((res) => {
        this.allSubComments = JSON.parse(res.data.data);
        // for (let i = 0; i < this.allSubComments.length; i++) {
        //   console.log(typeof this.allSubComments[i].commentTime)
        //   console.log(typeof this.allSubComments[i].favoriteCount)
        //   this.allSubComments[i].commentTime = Number.parseInt(this.allSubComments[i].commentTime);
        //   this.allSubComments[i].favoriteCount = Number.parseInt(this.allSubComments[i].favoriteCount);
        // }
        this.$forceUpdate();
      });
    },
    // release the reply for subComment
    releaseReplyForSubComment() {
      const commentTime = moment().format("YYYY-MM-DD hh:mm:ss");
      // encapsulate the param
      let newAddedComment = {
        opusId: this.parentComment.opusId,
        parentId: this.currentReplySubCommentInfo.replySubCommentId,
        content: this.commentContent,
        imgLinks: null,
        commentOwner: this.$store.state.currentUserId,
        anonymousFlag: 0,
        favoriteCount: 0,
        replyCount: 0,
        commentTime: commentTime,
        modifyTime: commentTime,
        validFlag: 1,
      };
      homepageRequest({
        url: "comment/add",
        method: "POST",
        headers: {
          "content-type": "application/json; charset=UTF-8",
        },
        data: newAddedComment,
      }).then((res) => {
        if (res.data.msg == "success") {
          this.allSubComments.unshift({
            id: res.data.data.commentId,
            parentId: this.currentReplySubCommentInfo.replySubCommentId,
            opusId:this.parentComment.opusId,
            commentOwner: this.$store.state.currentUserId,
            avatar: this.$store.state.currentUserAvatar,
            userName: this.$store.state.currentUserName,
            content: this.commentContent,
            commentTime: commentTime,
            favoriteCount: 0,
            isCurrentUserFavorite: false,
          });
          this.commentContent = "";
          alert("添加评论成功!");
          this.$refs.commentDetailRef.refresh();
          let subComment_element = document.querySelectorAll(".subComment")[0];
          this.$refs.commentDetailRef.scrollToElement(subComment_element);
        } else {
          alert("服务器休息了!请稍后再试...");
        }
      });
    },
  },
  created() {
    // 从路由中获取参数信息
    this.parentComment = this.$route.query;
    // 发送请求获取数据,
    // 这个地方有个BUG：如果循环引用会导致请求不停地发送....所以封装了CommentNew
    this.getSubCommentsContent(this.parentComment.id);
    this.currentReplySubCommentInfo.replySubCommentId = this.parentComment.id;
    this.currentReplySubCommentInfo.replySubCommentUser =
      this.parentComment.username;
    this.currentReplySubCommentInfo.replySubCommentContent =
      this.parentComment.commentContent;
  },
  updated() {
    this.$refs.commentDetailRef.refresh();
  },
};
</script>

<style scoped>
#commentDetail {
  background: rgba(192, 243, 134, 0.8);
  border-radius: 5px;
}
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

textarea {
  color: red;
  height: 80px;
  width: 100px;
}
</style>
