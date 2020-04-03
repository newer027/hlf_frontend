<template>
  <div class="app-container calendar-list-container">
    <div class="top">
      <el-row>
        <p class="title">基本信息</p>
      </el-row>
      <el-row>
        <el-col :span="8">供应商: {{ledgerDetail.vendor}}</el-col>
        <el-col :span="8">签约主体: {{ledgerDetail.invoice_org}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="8">对账单号: {{ledgerDetail.serial_id}}</el-col>
        <el-col :span="8">对账单总金额: {{ledgerDetail.amount}}元</el-col>
      </el-row>
      <el-row>
        <el-col :span="8">对账时间: {{ledgerDetail.create_time | parseTime('{y}-{m}-{d} {h}:{i}')}}</el-col>
      </el-row>
    </div>
      <el-row>
    <el-col :span="12"><p class="title">单据明细</p></el-col>
    <el-col :span="12"><el-button :loading="downloadLoading" style="margin-bottom:20px; float:right" type="primary" v-waves icon="search" @click="handleDownload()">导出</el-button></el-col>
    </el-row>
    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="数据加载中..." border fit
              highlight-current-row style="width: 100%" :default-sort = "{ prop: 'create_time', order: 'descending'}">
      <el-table-column align="center" label="单据单号" prop="serial_id">
        <template slot-scope="scope">{{ scope.row.serial_id }}</template>
      </el-table-column>
      <el-table-column align="center" sortable label="创建时间">
        <template slot-scope="scope">
          <span>
            {{scope.row.create_time | parseTime('{y}-{m}-{d} {h}:{i}')}}
          </span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="单据类别" show-overflow-tooltip>
        <template slot-scope="scope">
        <span>{{scope.row.category}} </span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="路线名称" prop='createTime'>
        <template slot-scope="scope">
          <span>{{scope.row.start_loc}}--{{scope.row.end_loc}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" class-name="status-col" label="车牌号">
        <template slot-scope="scope">
          <el-tag>{{scope.row.palate}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" sortable label="应付金额">
        <template slot-scope="scope">
          <span>{{scope.row.amount}}元</span>
        </template>
      </el-table-column>
      <el-table-column align="center" class-name="status-col" label="上链ID">
        <template slot-scope="scope">
          <a style="color:green" type="primary" :href="'http://106.75.67.41:8080/#/transactions/'+scope.row.txid" target="_blank">{{scope.row.txid}}</a>
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
import { fetchOrderList, fetchLedgerDetail } from '@/api/user'
import { mapGetters } from 'vuex'
import waves from '@/directive/waves/index.js' // 点击按钮时候显示水波纹动画

export default {
  directives: {
    waves
  },
  data() {
    return {
      downloadLoading: false,
      list: null,
      listAll: null,
      listLoading: false,
      listPageParams: {
        pageNo: 1,
        pageNum: 20
      },
      queryParams: {
        ledger: '',
        offset: 0,
        limit: 20
      },
      ledgerDetail: {
        serial_id: '',
        invoice_org: '',
        vendor: '',
        create_time: '',
        amount: ''
      },
      tableKey: 0,
      total: null,
      dialogFormVisible: false, // 表单是否显示
      dialogStatus: '',
      dialogTitleMap: {
        update: '编辑',
        create: '创建'
      },
      editForm: {
        username: '',
        password: '',
        statu: '',
        deptName: '',
        roleId: ''
      },
      editFormRules: {
        username: [{ required: true, message: '请输入用户名', trigger: 'blur' }, { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }, { min: 5, max: 10, message: '长度在 5 到 10 个字符', trigger: 'blur' }],
        roleId: [{ required: true, message: '请选择角色', trigger: 'blur' }],
        statu: [{ required: true, message: '请选择状态', trigger: 'blur' }]
      },
      editRolesOptions: [],
      editIsDisabled: {
        0: false, 1: true
      },
      statusOptions: [0, 1]
    }
  },
  created() {
    this.getUserList()
    this.user_upd = this.permissions['user_upd']
    this.user_del = this.permissions['user_del']
    this.user_add = this.permissions['user_add']
  },
  methods: {
    getUserList() {
      const uid = this.queryParams.ledger = this.$route.params.ledgerid
      this.listLoading = true
      fetchOrderList(this.queryParams).then(res => {
        this.list = res.results
        this.total = res.count
        this.listLoading = false
      })
      fetchLedgerDetail(uid).then(res => {
        this.ledgerDetail.serial_id = res.serial_id
        this.ledgerDetail.invoice_org = res.invoice_org
        this.ledgerDetail.vendor = res.vendor
        this.ledgerDetail.create_time = res.create_time
        this.ledgerDetail.amount = res.amount
      })
    },
    handlePageNumChange(_pageNum) { // 每页显示数量变化
      this.listPageParams.pageNum = this.queryParams.limit = _pageNum
      this.getUserList()
    },
    handlePageNoChange(_pageNo) { // 页码变化
      this.listPageParams.pageNo = _pageNo
      this.queryParams.offset = this.listPageParams.pageNum * (_pageNo - 1)
      this.getUserList()
    },
    handleDownload() {
      fetchOrderList({ ledger: this.queryParams.ledger }).then(res => {
        const listExcl0 = res.results
        // var listExcl = JSON.parse(JSON.stringify(listExcl0));
        this.downloadLoading = true
        // this.handleListAll(listExcl)
        fetchLedgerDetail(this.queryParams.ledger).then(ledgerRes => {
          var listExcl = listExcl0.map(function(a) {
            var o = Object.assign({}, a)
            const orderDate = new Date(a.create_time * 1000)
            o.create_time = orderDate.toLocaleString()
            o.vendor = ledgerRes.vendor
            o.invoice_org = ledgerRes.invoice_org
            o.ledger_id = ledgerRes.serial_id
            const ledgerDate = new Date(ledgerRes.create_time * 1000)
            o.ledger_time = ledgerDate.toLocaleString()
            o.ledger_amount = ledgerRes.amount
            return o
          })
          import('./Export2Excel').then(excel => {
            const tHeader = ['单据单号', '创建时间', '单据类别', '出发地', '目的地', '车牌号', '应付金额', '供应商', '签约主体', '对账单号', '对账时间', '对账单总金额']
            const filterVal = ['serial_id', 'create_time', 'category', 'start_loc', 'end_loc', 'palate', 'amount', 'vendor', 'invoice_org', 'ledger_id', 'ledger_time', 'ledger_amount']
            const data = this.formatJson(filterVal, listExcl)
            excel.export_json_to_excel({
              header: tHeader,
              data,
              filename: this.filename
            })
            this.downloadLoading = false
          })
        })
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
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
  .top{
    margin: 0 0px;
    border-bottom: 1px solid rgb(179, 179, 179);
  }
  .el-row {
    margin-top: 15px;
    margin-bottom: 15px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .el-col {
    border-radius: 4px;
    font-size: 14px;
  }
  .title{
    font-weight: 600;
    font-size: 18px;
  }
  .filter-item{
    margin-top: 10px;
    float: right;
  }
</style>
