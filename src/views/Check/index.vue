<template>
  <div class="check-container">
    <BreadCrumb :currentBreadName="currentBreadName" />

    <div class="query-box">
      <div class="username">
        <div class="desc">用户名：</div>
        <el-input v-model="username" placeholder="请输入申请人用户名"></el-input>
      </div>
      <div class="isPass">
        <div class="desc">状态：</div>
        <el-select v-model="isPass" placeholder="请选择审核状态">
          <el-option
            v-for="item in passOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div>
      <div class="type">
        <div class="desc">类型：</div>
        <el-select v-model="type" placeholder="请选择审核类型">
          <el-option
            v-for="item in typeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div>
      <el-button type="primary" class="distance" @click="queryCheck"
        >查询</el-button
      >
      <el-button @click="clearContent">重置</el-button>
    </div>

    <el-table
      :data="checkList"
      border
      height="450"
      style="width: 100%; margin: 20px auto"
    >
      <el-table-column label="申请人用户名">
        <template slot-scope="scope">
          <p>{{ scope.row.username }}</p>
        </template>
      </el-table-column>
      <el-table-column label="审核内容">
        <template slot-scope="scope">
          <p>{{ scope.row.content }}</p>
        </template>
      </el-table-column>
      <el-table-column label="审核类型">
        <template slot-scope="scope">
          <p>{{ scope.row.type === 1 ? "学生验证" : scope.row.type === 2 ? "摄影师认证" : "举报投诉" }}</p>
        </template>
      </el-table-column>
      <el-table-column label="审核状态">
        <template slot-scope="scope">
          <p>{{ scope.row.isPass === 1 ? "审核中" : scope.row.isPass === 2 ? "未通过" : "已通过" }}</p>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.isPass === 1"
            size="mini"
            type="primary"
            @click="handleOk(scope.row)"
            >通过</el-button
          >
          <el-button
            v-if="scope.row.isPass === 1"
            size="mini"
            type="danger"
            @click="handleNotOk(scope.row)"
            >驳回</el-button
          >
          <el-button
            v-if="scope.row.isPass !== 1"
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
  checkListAPI,
  queryCheckAPI,
  deleteCheckAPI,
  editCheckAPI,
} from "@/api/check";
import { addMessageAPI } from "@/api/message";
import { editUserStuAPI, editUserPhoAPI } from "@/api/user";

export default {
  name: "Check",
  components: {
    BreadCrumb,
  },
  data() {
    return {
      currentBreadName: "审核",
      checkList: [],
      currentPage: 1,
      pageNum: 1,
      pageSize: 10,
      total: 0,
      username: "",
      isPass: "",
      type: "",
      passOptions: [
        {
          value: 1,
          label: "审核中",
        },
        {
          value: 2,
          label: "未通过",
        },
        {
          value: 3,
          label: "已通过",
        },
      ],
      typeOptions: [
        {
          value: 1,
          label: "学生验证",
        },
        {
          value: 2,
          label: "摄影师认证",
        },
        {
          value: 3,
          label: "举报投诉",
        },
      ],
    };
  },
  methods: {
    async getCheckList() {
      const req = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      };
      const res = await checkListAPI(req);
      this.checkList = res.data.list;
      this.total = res.data.total;
    },
    // 获取当前时间
    getCurrentTime() {
      return new Date(+new Date() + 8 * 3600 * 1000)
	      .toJSON()
	      .substr(0, 19)
	      .replace("T", " ")
    },
    // 新增系统消息
    async addMessage(content, userId) {
      const req = {
        id: Math.round(Math.random() * 9999) + 1,
        content: content,
        createTime: this.getCurrentTime(),
        userId: userId,
      };
      await addMessageAPI(req);
    },
    // 学生验证/摄影师认证
    async checkInfo(type, userId, content) {
      // 学生验证
      if (type === 1) {
        const req = {
          id: userId,
          role: "学生",
          stuNumber: content,
          isStuIdentify: 1
        }
        await editUserStuAPI(req);
        return;
      }
      // 摄影师认证
      if (type === 2) {
        const req = {
          id: userId,
          role: "摄影师",
          photoNumber: content,
          isPhoIdentify: 1
        }
        await editUserPhoAPI(req);
      }
    },
    // 通过
    handleOk(row) {
      let typeList = ["学生验证", "摄影师认证", "举报投诉"];
      let typeName = typeList[row.type - 1];
      this.$confirm(`此操作将永久通过该审核记录, 是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const req = {
            id: row.id,
            isPass: 3,
          };
          const res = await editCheckAPI(req);
          if (res.code === 200) {
            this.$message.success(`审核已通过`);
            this.getCheckList();
            this.addMessage(`通过${typeName}的审核`, row.userId);
            this.checkInfo(row.type, row.userId, row.content);
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch(() => {});
    },
    // 驳回
    handleNotOk(row) {
      let typeList = ["学生验证", "摄影师认证", "举报投诉"];
      let typeName = typeList[row.type - 1];
      this.$confirm(`此操作将永久驳回该审核记录, 是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const req = {
            id: row.id,
            isPass: 2,
          };
          const res = await editCheckAPI(req);
          if (res.code === 200) {
            this.$message.success(`审核已驳回`);
            this.getCheckList();
            this.addMessage(`驳回${typeName}的审核`, row.userId);
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch(() => {});
    },
    handleDelete(row) {
      this.$confirm(`此操作将永久删除该审核记录, 是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const req = {
            checkId: row.id,
          };
          const res = await deleteCheckAPI(req);
          if (res.code === 200) {
            this.$message.success(`删除成功`);
            this.getCheckList();
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch(() => {});
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getCheckList();
    },
    handleCurrentChange(val) {
      this.pageNum = val;
      this.getCheckList();
    },
    async queryCheck() {
      if (!this.username && !this.isPass && !this.type) {
        this.getCheckList();
        return;
      }
      const req = {
        username: this.username,
        isPass: this.isPass === "" ? 0 : this.isPass,
        type: this.type === "" ? 0 : this.type,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      };
      const res = await queryCheckAPI(req);
      this.checkList = res.data.list;
      this.total = res.data.total;
    },
    clearContent() {
      this.username = "";
      this.isPass = "";
      this.type = "";
    },
  },
  created() {
    this.getCheckList();
  },
};
</script>

<style lang="less" scoped>
.check-container {
  height: 400px;
  .query-box {
    display: flex;
    align-items: center;
    .username {
      display: flex;
      align-items: center;
      .desc {
        width: 90px;
      }
    }
    .isPass {
      margin-left: 10px;
      display: flex;
      align-items: center;
      .desc {
        width: 55px;
      }
    }
    .type {
      margin-left: 10px;
      display: flex;
      align-items: center;
      .desc {
        width: 55px;
      }
    }
    .distance {
      margin-left: 25px;
    }
  }
}
</style>