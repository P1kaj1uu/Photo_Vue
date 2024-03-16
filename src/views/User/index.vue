<template>
  <div class="user-container">
    <BreadCrumb :currentBreadName="currentBreadName" />

    <div class="query-box">
      <div class="username">
        <div class="desc">用户名：</div>
        <el-input v-model="username" placeholder="请输入用户名"></el-input>
      </div>
      <div class="name">
        <div class="desc">名称：</div>
        <el-input v-model="name" placeholder="请输入名称"></el-input>
      </div>
      <div class="role">
        <div class="desc">角色：</div>
        <el-select v-model="role" placeholder="请选择角色">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div>
      <el-button type="primary" class="distance" @click="queryUser"
        >查询</el-button
      >
      <el-button @click="clearContent">重置</el-button>
    </div>

    <el-table
      :data="userList"
      border
      height="450"
      style="width: 100%; margin: 20px auto"
    >
      <el-table-column label="用户名">
        <template slot-scope="scope">
          <p>{{ scope.row.username }}</p>
        </template>
      </el-table-column>
      <el-table-column label="名称" width="120">
        <template slot-scope="scope">
          <p>{{ scope.row.name }}</p>
        </template>
      </el-table-column>
      <el-table-column label="角色" width="80">
        <template slot-scope="scope">
          <p>{{ scope.row.role }}</p>
        </template>
      </el-table-column>
      <el-table-column label="简介" width="120">
        <template slot-scope="scope">
          <p>{{ scope.row.info }}</p>
        </template>
      </el-table-column>
      <el-table-column label="学号" width="130">
        <template slot-scope="scope">
          <p>{{ scope.row.stuNumber }}</p>
        </template>
      </el-table-column>
      <el-table-column label="摄影师号" width="130">
        <template slot-scope="scope">
          <p>{{ scope.row.photoNumber }}</p>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="handlePassword(scope.row)"
            >修改密码</el-button
          >
          <el-button
            size="mini"
            type="danger"
            v-if="userInfo.username !== scope.row.username"
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

    <el-dialog title="修改密码" :visible.sync="passwordDialog" :show-close="false">
      <el-form :model="passwordForm" :rules="passwordFormRules" ref="passwordFormRef">
        <el-form-item
          label="新密码"
          label-width="80"
          prop="newPassword"
        >
          <el-input
            v-model="passwordForm.newPassword"
            type="password"
            placeholder="请输入新密码"
            autocomplete="off"
            clearable
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item
          label="确认密码"
          label-width="80"
          prop="againPassword"
        >
          <el-input
            v-model="passwordForm.againPassword"
            type="password"
            placeholder="请输入确认密码"
            autocomplete="off"
            clearable
            show-password
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelPassword">取 消</el-button>
        <el-button type="primary" @click="confirmPassword"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import BreadCrumb from "@/components/BreadCrumb.vue";
import {
  userListAPI,
  userByConditionAPI,
  deleteUserAPI,
  userPasswordAPI,
} from "@/api/user";
import { mapState, mapMutations } from "vuex";
import { removeToken } from "@/utils/token";

export default {
  name: "User",
  components: {
    BreadCrumb,
  },
  computed: {
    ...mapState("User", ["userInfo"]),
  },
  data() {
    return {
      currentBreadName: "用户",
      userList: [],
      currentPage: 1,
      pageNum: 1,
      pageSize: 10,
      total: 0,
      username: "",
      name: "",
      role: "",
      options: [
        {
          value: "学生",
          label: "学生",
        },
        {
          value: "摄影师",
          label: "摄影师",
        },
        {
          value: "管理员",
          label: "管理员",
        },
      ],
      userId: 0,
      passwordDialog: false,
      passwordForm: {
        newPassword: "",
        againPassword: "",
      },
      passwordFormRules: {
        newPassword: [
          {
            required: true,
            message: "请输入新密码",
            trigger: "blur",
          },
        ],
        againPassword: [
          {
            required: true,
            message: "请输入确认密码",
            trigger: "blur",
          },
        ],
      },
      userForm: {
        username: "",
        role: "",
        newPassword: "",
        againPassword: "",
      },
      userFormRules: {
        username: [
          {
            required: true,
            message: "请输入用户名",
            trigger: "blur",
          },
        ],
        role: [
          {
            required: true,
            message: "请选择角色",
            trigger: "blur",
          },
        ],
        newPassword: [
          {
            required: true,
            message: "请输入新密码",
            trigger: "blur",
          },
        ],
        againPassword: [
          {
            required: true,
            message: "请输入确认密码",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    ...mapMutations("User", ["setUserInfo"]),
    async getUserList() {
      const req = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      };
      const res = await userListAPI(req);
      this.userList = res.data.list;
      this.total = res.data.total;
    },
    handlePassword(row) {
      this.userId = row.id;
      this.passwordDialog = true;
    },
    cancelPassword() {
      this.$refs.passwordFormRef.resetFields();
      this.passwordDialog = false;
    },
    async confirmPassword() {
      this.$refs.passwordFormRef.validate(async (valid) => {
        if (!valid) {
          this.$message.warning('请先输入必填项内容');
          return;
        }
        if (this.passwordForm.newPassword !== this.passwordForm.againPassword) {
          this.$message.warning('请检查两次输入的密码是否一致');
          return;
        }
        const req = {
          id: this.userId,
          password: this.passwordForm.againPassword,
        };
        const res = await userPasswordAPI(req);
        if (res.code === 200) {
          this.$message.success("修改密码成功");
          this.cancelPassword();
          if (this.userId === this.userInfo.id) {
            removeToken();
            this.setUserInfo(null);
            this.$router.push("/login");
          }
        } else {
          this.$message.error("修改密码失败，请稍后重试");
        }
      })
    },
    handleDelete(row) {
      this.$confirm(`此操作将永久删除该${row.role}, 是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const req = {
            userId: row.id,
          };
          const res = await deleteUserAPI(req);
          if (res.code === 200) {
            this.$message.success(`删除${row.role}成功`);
            this.getUserList();
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch(() => {});
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getUserList();
    },
    handleCurrentChange(val) {
      this.pageNum = val;
      this.getUserList();
    },
    async queryUser() {
      if (!this.username && !this.name && !this.role) {
        this.getUserList();
        return;
      }
      const req = {
        username: this.username,
        name: this.name,
        role: this.role,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      };
      const res = await userByConditionAPI(req);
      this.userList = res.data.list;
      this.total = res.data.total;
    },
    clearContent() {
      this.username = "";
      this.name = "";
      this.role = "";
    },
  },
  created() {
    this.getUserList();
  },
};
</script>

<style lang="less" scoped>
.user-container {
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
    .name {
      margin-left: 25px;
      display: flex;
      align-items: center;
      .desc {
        width: 70px;
      }
    }
    .role {
      margin-left: 25px;
      display: flex;
      align-items: center;
      .desc {
        width: 60px;
      }
    }
    .distance {
      margin-left: 25px;
    }
  }
}
</style>