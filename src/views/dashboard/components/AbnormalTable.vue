
<template>
  <div class="chart-wrapper" style="padding-bottom:20px">
    <div class="dashboard-text" style="text-align:center;margin-bottom:20px">综合监测评估指标数据统计</div>
    <el-table :key='tableKey' :data="listNg" v-loading="listLoading" element-loading-text="数据加载中..." border fit
              highlight-current-row style="width: 100%" :default-sort = "{ prop: 'amount', order: 'descending'}">
      <el-table-column align="center" label="时间">
        <template slot-scope="scope">
          {{scope.row.create_time | parseTime('{y}-{m}-{d}')}}
        </template>
      </el-table-column>
      <el-table-column align="center" label="运单号">
        <template slot-scope="scope">
          <span>
            {{ scope.row.serial_id }}
          </span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="车辆定位状态" show-overflow-tooltip>
        <template slot-scope="scope">
        <span>{{ scope.row.status | parseStatus()}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="车辆资质异常">
        <template slot-scope="scope">
          <span>-</span>
        </template>
      </el-table-column>
      <el-table-column align="center" class-name="status-col" label="运输合同异常">
        <template slot-scope="scope">
          <span>-</span>
        </template>
      </el-table-column>
      <el-table-column align="center" class-name="status-col" label="资金流水匹配">
        <template slot-scope="scope">
          <span>-</span>
        </template>
      </el-table-column>
      <el-table-column align="center" class-name="status-col" label="评分">
        <template slot-scope="scope">
          <span>-</span>
        </template>
      </el-table-column>
    </el-table>

    <!-- //  分页 -->
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination background
        @size-change="handlePageNumChange" @current-change="handlePageNoChange"
        :current-page.sync="listPageParams.pageNo"
        :page-sizes="[20,40,60,80,100]" :page-size="listPageParams.pageNum"
        layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
  </div>
</template>


<script>
import { orderstartNg } from '@/api/user'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      downloadLoading: false,
      listNg: null,
      listLoading: false,
      procedureStamp: 'procedureStamp',
      searchForm: {
        serial_id: '',
        vendor: '',
        time: '',
        invoice_org: '',
        min_create: '',
        max_create: '',
        offset: 0,
        limit: 20
      },
      listPageParams: {
        pageNo: 1,
        pageNum: 20,
        username: ''
      },
      chooseHead: {
        procedureStamp: ''
      },
      tableKey: 0,
      total: null,
      dialogFormVisible: false, // 表单是否显示
      dialogStatus: '',
      statusOptions: [0, 1]
    }
  },
  created() {
    this.getOrderstartNg()
  },
  methods: {
    getOrderstartNg() {
      orderstartNg().then(res => {
        this.listNg = res.results
        this.total = res.count
      })
    },
    getTimeString(d) {
      if (d) {
        return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes()
      } else {
        return ''
      }
    },
    reset() {
      this.searchForm.time = ''
      this.searchForm.vendor = this.searchForm.serial_id = this.searchForm.invoice_org = this.searchForm.min_create = this.searchForm.max_create = ''
      this.getUserList()
    },
    goWaybillDetail(id) {
      this.$router.push({ path: `orther/${id}` })
    },
    handleSearch() { // 搜索
      var d0 = this.searchForm.time[0]
      this.searchForm.min_create = this.getTimeString(d0)
      var d1 = this.searchForm.time[1]
      this.searchForm.max_create = this.getTimeString(d1)
      this.listPageParams.pageNo = 0
      this.getUserList()
    },
    handlePageNumChange(_pageNum) { // 每页显示数量变化
      this.listPageParams.pageNum = this.searchForm.limit = _pageNum
      this.listPageParams.pageNum = _pageNum
      this.getUserList()
    },
    handlePageNoChange(_pageNo) { // 页码变化
      this.listPageParams.pageNo = _pageNo
      this.searchForm.offset = this.listPageParams.pageNum * (_pageNo - 1)
      this.getUserList()
    },
    formCancel(_from) {
      this.dialogFormVisible = false
      this.$refs[_from].resetFields()
    }
  },
  computed: {
    ...mapGetters([
      'permissions'
    ])
  }
}
</script>


<style scoped>
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  border-radius: 4px;
}
</style>
