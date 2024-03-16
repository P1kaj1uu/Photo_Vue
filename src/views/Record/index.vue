<template>
  <div class="record-container">
    <BreadCrumb :currentBreadName="currentBreadName" />

    <div class="query-box">
      <div class="status">
        <div class="desc">状态：</div>
        <el-select v-model="status" placeholder="请选择订单状态">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div>
      <el-button type="primary" class="distance" @click="queryRecord"
        >查询</el-button
      >
      <el-button @click="clearContent">重置</el-button>
    </div>

    <el-table
      :data="recordList"
      border
      height="450"
      style="width: 100%; margin: 20px auto"
    >
      <el-table-column label="创建时间" width="170">
        <template slot-scope="scope">
          <p>{{ scope.row.createTime }}</p>
        </template>
      </el-table-column>
      <el-table-column label="订单名称" width="180">
        <template slot-scope="scope">
          <p>{{ scope.row.name }}</p>
        </template>
      </el-table-column>
      <el-table-column label="订单内容" width="200">
        <template slot-scope="scope">
          <p>{{ scope.row.content }}</p>
        </template>
      </el-table-column>
      <el-table-column label="订单价格" width="100">
        <template slot-scope="scope">
          <p>{{ scope.row.price }}</p>
        </template>
      </el-table-column>
      <el-table-column label="订单状态" width="100">
        <template slot-scope="scope">
          <p>{{ scope.row.status === 0 ? "待支付" : scope.row.status === 1 ? "已支付" : "已取消" }}</p>
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
  recordListAPI,
  queryRecordAPI,
  deleteRecordAPI,
} from "@/api/record";

export default {
  name: "Record",
  components: {
    BreadCrumb,
  },
  data() {
    return {
      currentBreadName: "订单记录",
      recordList: [],
      currentPage: 1,
      pageNum: 1,
      pageSize: 10,
      total: 0,
      status: "",
      options: [
        {
          value: 0,
          label: "待支付",
        },
        {
          value: 1,
          label: "已支付",
        },
        {
          value: 2,
          label: "已取消",
        },
      ],
    };
  },
  methods: {
    async getRecordList() {
      const req = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      };
      const res = await recordListAPI(req);
      this.recordList = res.data.list;
      this.total = res.data.total;
    },
    handleDelete(row) {
      this.$confirm(`此操作将永久删除该订单记录, 是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const req = {
            recordId: row.id,
          };
          const res = await deleteRecordAPI(req);
          if (res.code === 200) {
            this.$message.success(`删除成功`);
            this.getRecordList();
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch(() => {});
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getRecordList();
    },
    handleCurrentChange(val) {
      this.pageNum = val;
      this.getRecordList();
    },
    async queryRecord() {
      if (this.status === "") {
        this.getRecordList();
        return;
      }
      const req = {
        status: this.status,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      };
      const res = await queryRecordAPI(req);
      this.recordList = res.data.list;
      this.total = res.data.total;
    },
    clearContent() {
      this.status = "";
    },
  },
  created() {
    this.getRecordList();
  },
};
</script>

<style lang="less" scoped>
.record-container {
  height: 400px;
  .query-box {
    display: flex;
    align-items: center;
    .status {
      display: flex;
      align-items: center;
      .desc {
        width: 50px;
      }
    }
    .distance {
      margin-left: 25px;
    }
  }
}
</style>