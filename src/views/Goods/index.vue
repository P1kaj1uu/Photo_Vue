<template>
  <div class="goods-container">
    <BreadCrumb :currentBreadName="currentBreadName" />

    <div class="query-box">
      <div class="content">
        <div class="desc">内容：</div>
        <el-input v-model="content" placeholder="请输入内容"></el-input>
      </div>
      <div class="content">
        <div class="desc">位置：</div>
        <el-input v-model="position" placeholder="请输入位置"></el-input>
      </div>
      <div class="content">
        <div class="desc">类型：</div>
        <el-input v-model="type" placeholder="请输入类型"></el-input>
      </div>
      <el-button type="primary" class="distance" @click="queryGoods"
        >查询</el-button
      >
      <el-button @click="clearContent">重置</el-button>
    </div>

    <el-table
      :data="goodsList"
      border
      height="450"
      style="width: 100%; margin: 20px auto"
    >
      <el-table-column label="发布时间">
        <template slot-scope="scope">
          <p>{{ scope.row.createTime }}</p>
        </template>
      </el-table-column>
      <el-table-column label="约拍标题">
        <template slot-scope="scope">
          <p>{{ scope.row.title }}</p>
        </template>
      </el-table-column>
      <el-table-column label="约拍内容">
        <template slot-scope="scope">
          <p>{{ scope.row.content }}</p>
        </template>
      </el-table-column>
      <el-table-column label="约拍价格">
        <template slot-scope="scope">
          <p>{{ scope.row.price }}</p>
        </template>
      </el-table-column>
      <el-table-column label="约拍地点">
        <template slot-scope="scope">
          <p>{{ scope.row.position }}</p>
        </template>
      </el-table-column>
      <el-table-column label="约拍类型">
        <template slot-scope="scope">
          <p>{{ scope.row.type }}</p>
        </template>
      </el-table-column>
      <el-table-column label="约拍天数">
        <template slot-scope="scope">
          <p>{{ scope.row.continueTime }}</p>
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
  goodsListAPI,
  queryGoodsAPI,
  deleteGoodsAPI,
} from "@/api/goods";

export default {
  name: "Goods",
  components: {
    BreadCrumb,
  },
  data() {
    return {
      currentBreadName: "约拍商品",
      goodsList: [],
      currentPage: 1,
      pageNum: 1,
      pageSize: 10,
      total: 0,
      content: "",
      position: "",
      type: "",
    };
  },
  methods: {
    async getGoodsList() {
      const req = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      };
      const res = await goodsListAPI(req);
      this.goodsList = res.data.list;
      this.total = res.data.total;
    },
    handleDelete(row) {
      this.$confirm(`此操作将永久删除该约拍商品, 是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const req = {
            goodsId: row.id,
          };
          const res = await deleteGoodsAPI(req);
          if (res.code === 200) {
            this.$message.success(`删除成功`);
            this.getGoodsList();
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch(() => {});
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getGoodsList();
    },
    handleCurrentChange(val) {
      this.pageNum = val;
      this.getGoodsList();
    },
    async queryGoods() {
      if (!this.content && !this.position && !this.type) {
        this.getGoodsList();
        return;
      }
      const req = {
        content: this.content,
        position: this.position,
        type: this.type,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      };
      const res = await queryGoodsAPI(req);
      this.goodsList = res.data.list;
      this.total = res.data.total;
    },
    clearContent() {
      this.content = "";
      this.position = "";
      this.type = "";
    },
  },
  created() {
    this.getGoodsList();
  },
};
</script>

<style lang="less" scoped>
.goods-container {
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