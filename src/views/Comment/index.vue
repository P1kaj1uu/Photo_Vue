<template>
  <div class="comment-container">
    <BreadCrumb :currentBreadName="currentBreadName" />

    <div class="query-box">
      <div class="name">
        <div class="desc">名称：</div>
        <el-input v-model="name" placeholder="请输入名称"></el-input>
      </div>
      <div class="content">
        <div class="desc">内容：</div>
        <el-input v-model="content" placeholder="请输入内容"></el-input>
      </div>
      <el-button type="primary" class="distance" @click="queryComment"
        >查询</el-button
      >
      <el-button @click="clearContent">重置</el-button>
    </div>

    <el-table
      :data="commentList"
      border
      height="450"
      style="width: 100%; margin: 20px auto"
    >
      <el-table-column label="发布时间">
        <template slot-scope="scope">
          <p>{{ scope.row.createTime }}</p>
        </template>
      </el-table-column>
      <el-table-column label="商品id">
        <template slot-scope="scope">
          <p>{{ scope.row.goodsId }}</p>
        </template>
      </el-table-column>
      <el-table-column label="用户id">
        <template slot-scope="scope">
          <p>{{ scope.row.userId }}</p>
        </template>
      </el-table-column>
      <el-table-column label="名称" width="120">
        <template slot-scope="scope">
          <p>{{ scope.row.name }}</p>
        </template>
      </el-table-column>
      <el-table-column label="内容" width="120">
        <template slot-scope="scope">
          <p>{{ scope.row.content }}</p>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="10"
      layout="total, sizes, prev, pager, next"
      :total="total"
    >
    </el-pagination>
  </div>
</template>

<script>
import BreadCrumb from "@/components/BreadCrumb.vue";
import {
  commentListAPI,
  queryCommentAPI,
  deleteCommentAPI,
} from "@/api/comment";

export default {
  name: "Comment",
  components: {
    BreadCrumb,
  },
  data() {
    return {
      currentBreadName: "评论评价",
      commentList: [],
      currentPage: 1,
      pageNum: 1,
      pageSize: 10,
      total: 0,
      name: "",
      content: "",
    };
  },
  methods: {
    async getCommentList() {
      const req = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      };
      const res = await commentListAPI(req);
      this.commentList = res.data.list;
      this.total = res.data.total;
    },
    handleDelete(row) {
      this.$confirm(`此操作将永久删除该评论评价, 是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const req = {
            commentId: row.id,
          };
          const res = await deleteCommentAPI(req);
          if (res.code === 200) {
            this.$message.success(`删除成功`);
            this.getCommentList();
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch(() => {});
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getCommentList();
    },
    handleCurrentChange(val) {
      this.pageNum = val;
      this.getCommentList();
    },
    async queryComment() {
      if (!this.name && !this.content) {
        this.getCommentList();
        return;
      }
      const req = {
        name: this.name,
        content: this.content,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      };
      const res = await queryCommentAPI(req);
      this.commentList = res.data.list;
      this.total = res.data.total;
    },
    clearContent() {
      this.name = "";
      this.content = "";
    },
  },
  created() {
    this.getCommentList();
  },
};
</script>

<style lang="less" scoped>
.comment-container {
  height: 400px;
  .query-box {
    display: flex;
    align-items: center;
    .name {
      display: flex;
      align-items: center;
      .desc {
        width: 65px;
      }
    }
    .content {
      margin-left: 10px;
      display: flex;
      align-items: center;
      .desc {
        width: 65px;
      }
    }
    .distance {
      margin-left: 25px;
    }
  }
}
</style>