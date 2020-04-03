<template>
  <div class="app-container calendar-list-container">
    <div class="top">
      <el-row style="height:10px; margin-bottom:20px">
        运输轨迹
      </el-row>
      <el-row>
        <el-col :span="12">运单号: {{lowerDetail.serial_id}}</el-col>
        <el-col :span="12">车牌号: {{lowerDetail.palate}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="12">线路名称: {{lowerDetail.start_short}}</el-col>
        <el-col :span="12">应付金额: {{lowerDetail.amount}}元</el-col>
      </el-row>
      <el-row>
        <el-col :span="12">出发时间: {{lowerDetail.start_time | parseTime('{y}-{m}-{d} {h}:{i}')}}</el-col>
        <el-col :span="12">出发地址: {{lowerDetail.start_loc}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="12">到达时间: {{lowerDetail.end_time | parseTime('{y}-{m}-{d} {h}:{i}')}}</el-col>
        <el-col :span="12">达到地址: {{lowerDetail.end_loc}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="12">供应商: {{lowerDetail.vendor}}</el-col>
        <el-col :span="12">签约主体: {{lowerDetail.invoice_org}}</el-col>
      </el-row>
    </div>

    <el-row style="height:10px">
      出发信息
    </el-row>
    <el-table ref="multipleTable" :data="listEnd" element-loading-text="数据加载中..." border fit
              highlight-current-row style="width: 100%" :default-sort = "{ prop: 'amount', order: 'descending'}">
      <el-table-column align="center" label="发车单号" prop="vendor">
        <template slot-scope="scope">{{ scope.row.serial_id }}</template>
      </el-table-column>
      <el-table-column align="center" label="运单时间">
        <template slot-scope="scope">
          <span>
          {{scope.row.start_time | parseTime('{y}-{m}-{d} {h}:{i}')}}
          </span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="单据类别">
        <template slot-scope="scope">
        <span>
          干线任务
        </span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="路线名称" prop='createTime'>
        <template slot-scope="scope">
          <span>{{scope.row.start_short}}--{{scope.row.end_short}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" class-name="status-col" label="车牌号">
        <template slot-scope="scope">
          <span>{{scope.row.palate}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" class-name="status-col" label="应付金额">
        <template slot-scope="scope">
          <span>{{scope.row.amount}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="上链ID">
        <template slot-scope="scope">
          <span>{{scope.row.txid}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button
            type="success"
            size="mini"
            plain
            @click="goWaybillDetail(scope.row.item_id)"
          >查看</el-button>
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

<script type="text/javascript" src="http://api.map.baidu.com/api?v=2.0&ak=yCM2VbguexR2Rccne1Tgamd2FwoRiXwV"></script>
    
<script>
import { fetchOrderStartList, fetchLowerPayment } from '@/api/user'
import { fetchRoleList } from '@/api/role'
import { mapGetters } from 'vuex'

export default {
  name: 'taskDetail',
  data() {
    return {
      downloadLoading: false,
      list: null,
      listLoading: false,
      listStart: null,
      listEnd: null,
      listAll: null,
      listPageParams: {
        pageNo: 1,
        pageNum: 20
      },
      queryParams: {
        lowerid: '',
        offset: 0,
        limit: 20
      },
      passProp: {
        start_longitude: 0,
        start_latitude: 0,
        end_longitude: 0,
        end_latitude: 0
      },
      lowerDetail: {
        serial_id: '',
        invoice_org: '',
        start_time: '',
        end_time: '',
        start_loc: '',
        end_loc: '',
        vendor: '',
        palate: '',
        start_short: '',
        end_short: '',
        create_time: '',
        amount: ''
      },
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
    // this.getRoleList()
    // 设置权限，后续将采用动态方式
    this.user_upd = this.permissions['user_upd']
    this.user_del = this.permissions['user_del']
    this.user_add = this.permissions['user_add']
  },
  methods: {
    getUserList() {
      const uid = this.queryParams.lowerid = this.$route.params.lowerid
      fetchLowerPayment(uid).then(res => {
        this.lowerDetail.serial_id = res.serial_id
        this.lowerDetail.invoice_org = res.invoice_org
        this.lowerDetail.vendor = res.vendor
        this.lowerDetail.start_time = res.start_time
        this.lowerDetail.end_time = res.end_time
        this.lowerDetail.start_loc = res.start_loc
        this.lowerDetail.end_loc = res.end_loc
        this.lowerDetail.create_time = res.create_time
        this.lowerDetail.amount = res.amount
        this.lowerDetail.palate = res.palate
        this.lowerDetail.start_short = res.start_short
        this.lowerDetail.end_short = res.end_short
      })
      fetchOrderStartList(this.queryParams).then(res => {
        this.listEnd = res.results
      })
    },
    getRoleList() {
      fetchRoleList().then(res => {
        this.editRolesOptions = res.data
      })
    },
    handleAdd() { // 添加
      this.formReset()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
    },
    handleSearch() { // 搜索
      this.listPageParams.pageNo = 0
      this.getUserList()
    },
    goWaybillDetail(id) {
      this.$router.push({ path: `/admin/taskdetail/${id}` })
    },
    handlePageNumChange(_pageNum) { // 每页显示数量变化
      this.listPageParams.pageNum = this.queryParams.limit = _pageNum
      this.getUserList()
    },
    handlePageNoChange(_pageNo) { // 页码变化
      this.listPageParams.pageNo = _pageNo
      this.queryParams.offset = this.listPageParams.pageNum * (_pageNo - 1)
      this.getUserList()
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
#map{
  min-height: 300px;
  max-height: 400px;
  max-width: 580px;
}
</style>

