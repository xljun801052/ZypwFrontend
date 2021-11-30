<template>
  <div>
    <Scroll ref="articleDetailScroll">
      <div id="articleDetail">
        <!-- 文章详情部分 -->
        <div>
          <Back class="backItem" />
          <h2 class="article_title">{{ article.title }}</h2>
          <div class="article_readAndCollectInfo">
            <!-- <span>发布时间: {{ article.pubTime }}</span> -->
            <span class="article_readTimes"
              >阅读数: {{ article.readTimes }}</span
            >
            <span class="article_collectTimes"
              >收藏数量: {{ article.collectTimes }}</span
            >
          </div>
          <Divider />
          <div class="article_content">
            <p v-html="article.content"></p>
          </div>
        </div>
        <Divider />

        <!-- 历史评论展示 -->
        <div class="historyCommentArea">
          <div class="commentIndicator">
            <img src="~assets/imgs/homepage/comment.png" alt="" />
            <div>
              人生好比白驹过隙 不如小憩评论一句
              <img src="~assets/imgs/emotions/2018new_aini_org.png" alt="" />
            </div>
          </div>

          <div v-for="(commentItem, index) in historyComments" :key="index">
            <Comment
              :id="commentItem.id"
              :userAvatar="commentItem.userAvatar"
              :username="commentItem.username"
              :commentContent="commentItem.commentContent"
              :commentTime="commentItem.commentTime"
              :commentFavoriteCount="commentItem.commentFavoriteCount"
              :commentReplyCount="commentItem.commentReplyCount"
              :isCurrentUserFavorite="commentItem.isCurrentUserFavorite"
              @commentDelete="commentDeleted"
            />
          </div>
        </div>

        <!-- 发表评论部分 -->
        <div class="releaseCommentArea">
          <!-- @TODO bug:can't get the focus when enter the page. -->
          <!-- <vue-editor ref="commentEditor" v-model="comment"></vue-editor> -->
          <Editor v-model="comment" :init="init"></Editor>
          <div class="commentInfoClick">
            <Button
              type="primary"
              class="commentHandle"
              @click="releaseParentComment"
              >爷,说两句</Button
            >
            <Button
              type="dashed"
              class="commentHandle"
              @click="cancelTheRelease"
              >缄默不言</Button
            >
          </div>
        </div>
      </div>
    </Scroll>
  </div>
</template>

<script>
// import { VueEditor } from "vue2-editor";
// import VueQuillEditor from "vue-quill-editor";
// import "quill/dist/quill.core.css";
// import "quill/dist/quill.snow.css";
// import "quill/dist/quill.bubble.css";
import homepageRequest from "../../../../network/homepageRequest";
import moment from "moment";

import Back from "../../../../components/common/Back";
import Scroll from "../../../../components/common/Scroll";
import Comment from "../../../../components/content/Comment";
import Editor from "@tinymce/tinymce-vue";

export default {
  name: "ArticleDetail",
  components: {
    Editor,
    Scroll,
    Back,
    Comment,
  },
  data() {
    return {
      aId: "",
      historyComments: [],
      comment: "",
      article: {
        id: 0,
        title: "",
        readTimes: 0,
        collectTimes: 0,
        content: "",
      },
      init: {
        language_url: "${this.baseUrl}/tinymce/langs/zh_CN.js", // 语言包的路径
        language: "zh_CN", //语言
        height: 300, //编辑器高度
        branding: false, //是否禁用“Powered by TinyMCE”
        menubar: true, //顶部菜单栏显示,
        toolbar:
          "undo redo | formatselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | code codesample link help",
        plugins: [
          "advlist autolink lists link image charmap print preview anchor",
          "searchreplace visualblocks code fullscreen",
          "insertdatetime media table paste code help wordcount",
          "codesample",
        ],
      },
      // get the api-key from here: https://www.tiny.cloud/my-account/dashboard/
      apiKey: "pdydaeaw072fplacdenbcb8lepf9j3gjob8m37s4sj7omj30",
    };
  },
  methods: {
    // release the parent comment
    releaseParentComment() {
      const commentTime = moment().format("YYYY-MM-DD hh:mm:ss");
      // encapsulate the param
      let newAddedComment = {
        opusId: this.article.id,
        parentId: null,
        content: this.comment,
        imgLinks: null,
        // @todo:get the user info from vuex
        commentOwner: 1,
        anonymousFlag: 0,
        favoriteCount: 0,
        replyCount: 0,
        commentTime: commentTime,
        modifyTime: commentTime,
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
          this.historyComments.unshift({
            // @todo fill the comment id after the request
            id: res.data.data.commentId,
            // @todo get the comment user info from vuex
            userAvatar:
              "https://himg.bdimg.com/sys/portraitn/item/dd75gd21301000000",
            username: "妞妞宝宝",
            commentContent: this.comment,
            commentTime: commentTime,
            commentFavoriteCount: 0,
            commentReplyCount: 0,
            isCurrentUserFavorite: 1,
          });
          this.resetCommentContent();
          alert("添加评论成功!");
          this.$refs.articleDetailScroll.refresh();
        } else {
          alert("服务器休息了!请稍后再试...");
        }
      });
    },
    cancelTheRelease() {
      this.resetCommentContent();
    },
    // get the historic comments data
    getLatestComments() {
      homepageRequest({
        url: "/article/comments/" + this.aId,
        method: "post",
        data: {
          aaa: "abd",
        },
      }).then((res) => {
        this.historyComments = res.data;
      });
    },
    resetCommentContent() {
      this.comment = "";
    },
    commentDeleted(cid) {
      // for (let i = 0; i < this.historyComments.length; i++) {
      //       if (cid== this.$parent.$parent.historyComments[i]) {
      //         console.log("即将被删除的comment:"+this.$parent.$parent.historyComments[i].commentContent)
      //         this.$parent.$parent.historyComments.splice(i,1);
      //       }
      //     }
      // this.historyComments.
    },
  },
  created() {
    this.aId = this.$route.params.id;

    // 获取文章详情数据
    homepageRequest({
      url: "/article/detail/" + this.aId,
      method: "post",
      data: {
        aaa: "abc",
      },
    }).then((res) => {
      this.article = res.data;
    });

    // get the historic comments data
    this.getLatestComments();
  },
  updated() {
    this.$refs.articleDetailScroll.refresh();
  },
};
</script>

<style scoped>
.backItem {
  padding-top: 15px;
  padding-left: 20px;
}

#articleDetail {
  background: rgba(192, 243, 134, 0.8);
  border-radius: 5px;
}

.article_title {
  padding-top: 10px;
  text-align: center;
  font-size: 30px;
  font-family: 楷体;
}

.article_readAndCollectInfo {
  display: flex;
  justify-content: flex-end;
}

#articleDetail span {
  margin-top: -10px;
  margin-left: 10px;
  margin-right: 10px;
  font-size: 12px;
  color: #121514;
}

.commentIndicator {
  display: flex;
  align-items: baseline;
  font-family: 楷体;
  font-size: 22px;
  font-weight: bolder;
  color: red;
}

.commentIndicator img {
  height: 20px;
  width: 20px;
  margin-right: 5px;
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
