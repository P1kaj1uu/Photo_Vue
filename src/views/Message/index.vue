<template>
  <div class="message-container">
    <BreadCrumb :currentBreadName="currentBreadName" />

    <div class="query-box">
      <div class="content">
        <div class="desc">内容：</div>
        <el-input v-model="content" placeholder="请输入内容"></el-input>
      </div>
      <el-button type="primary" class="distance" @click="queryMessage"
        >查询</el-button
      >
      <el-button @click="clearContent">重置</el-button>
    </div>

    <el-table
      :data="messageList"
      border
      height="450"
      style="width: 100%; margin: 20px auto"
    >
      <el-table-column label="发布时间">
        <template slot-scope="scope">
          <p>{{ scope.row.createTime }}</p>
        </template>
      </el-table-column>
      <el-table-column label="用户id" width="120">
        <template slot-scope="scope">
          <p>{{ scope.row.userId }}</p>
        </template>
      </el-table-column>
      <el-table-column label="内容">
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
  messageListAPI,
  queryMessageAPI,
  deleteMessageAPI,
} from "@/api/message";

export default {
  name: "Message",
  components: {
    BreadCrumb,
  },
  data() {
    return {
      currentBreadName: "系统消息",
      messageList: [],
      currentPage: 1,
      pageNum: 1,
      pageSize: 10,
      total: 0,
      content: "",
    };
  },
  methods: {
    async getMessageList() {
      const req = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      };
      const res = await messageListAPI(req);
      this.messageList = res.data.list;
      this.total = res.data.total;
    },
    handleDelete(row) {
      this.$confirm(`此操作将永久删除该系统消息, 是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const req = {
            messageId: row.id,
          };
          const res = await deleteMessageAPI(req);
          if (res.code === 200) {
            this.$message.success(`删除成功`);
            this.getMessageList();
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch(() => {});
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getMessageList();
    },
    handleCurrentChange(val) {
      this.pageNum = val;
      this.getMessageList();
    },
    async queryMessage() {
      if (!this.content) {
        this.getMessageList();
        return;
      }
      const req = {
        content: this.content,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      };
      const res = await queryMessageAPI(req);
      this.messageList = res.data.list;
      this.total = res.data.total;
    },
    clearContent() {
      this.content = "";
    },
  },
  created() {
    this.getMessageList();
  },
};
</script>

<style lang="less" scoped>
.message-container {
  height: 400px;
  .query-box {
    display: flex;
    align-items: center;
    .content {
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