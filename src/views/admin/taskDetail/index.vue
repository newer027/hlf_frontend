<template>
  <div class="app-container calendar-list-container">
    <div class="top">
      <el-row style="height:10px; margin-bottom:20px">
        运输轨迹
      </el-row>
      <el-row>
        <el-col :span="12">运单号: {{ledgerDetail.serial_id}}</el-col>
        <el-col :span="12">车牌号: {{ledgerDetail.palate}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="12">线路名称: {{ledgerDetail.start_short}}-{{ledgerDetail.end_short}}</el-col>
        <el-col :span="12">应付金额: {{ledgerDetail.amount}}元</el-col>
      </el-row>
      <el-row>
        <el-col :span="12">出发时间: {{ledgerDetail.start_time | parseTime('{y}-{m}-{d} {h}:{i}')}}</el-col>
        <el-col :span="12">出发地址: {{ledgerDetail.start_loc}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="12">到达时间: {{ledgerDetail.end_time | parseTime('{y}-{m}-{d} {h}:{i}')}}</el-col>
        <el-col :span="12">达到地址: {{ledgerDetail.end_loc}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="12">供应商: {{ledgerDetail.vendor}}</el-col>
        <el-col :span="12">签约主体: {{ledgerDetail.invoice_org}}</el-col>
      </el-row>
    </div>
    <div>
    <el-row style="height:10px">
      运输轨迹
    </el-row>
  <div id="map">
  </div>
    </div>

    <el-row style="height:10px">
      出发信息
    </el-row>
    <el-table ref="multipleTable" :data="listStart" element-loading-text="数据加载中..." border fit
              highlight-current-row style="width: 100%" :default-sort = "{ prop: 'amount', order: 'descending'}">
      <el-table-column align="center" label="运单号" prop="vendor">
        <template slot-scope="scope">{{ scope.row.serial_id }}</template>
      </el-table-column>
      <el-table-column align="center" label="发车单号">
        <template slot-scope="scope">
          <span>
            {{ scope.row.item_id }}
          </span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="出发时间">
        <template slot-scope="scope">
        <span>
          {{scope.row.start_time | parseTime('{y}-{m}-{d} {h}:{i}')}}
        </span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="出发地址" prop='createTime'>
        <template slot-scope="scope">
          <span>{{scope.row.start_loc}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" class-name="status-col" label="GPS获取时间">
        <template slot-scope="scope">
          <span>{{scope.row.gps_time | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" class-name="status-col" label="GPS获取地址">
        <template slot-scope="scope">
          <span>{{scope.row.gps_loc}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" class-name="status-col" label="定位状态">
        <template slot-scope="scope">
          <span>{{scope.row.status | parseStatus()}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="上链ID">
        <template slot-scope="scope">
          <span>{{scope.row.txid}}</span>
        </template>
      </el-table-column>
    </el-table>

    <el-row style="height:10px">
      到达信息
    </el-row>

    <el-table ref="multipledTable" :data="listEnd" element-loading-text="数据加载中..." border fit
              highlight-current-row style="width: 100%" :default-sort = "{ prop: 'amount', order: 'descending'}">
      <el-table-column align="center" label="运单号" prop="vendor">
        <template slot-scope="scope">{{ scope.row.serial_id }}</template>
      </el-table-column>
      <el-table-column align="center" label="到达时间" show-overflow-tooltip>
        <template slot-scope="scope">
        <span>{{scope.row.end_time | parseTime('{y}-{m}-{d} {h}:{i}')}} </span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="到达地址" prop='createTime'>
        <template slot-scope="scope">
          <span>{{scope.row.end_loc}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" class-name="status-col"  label="GPS获取时间">
        <template slot-scope="scope">
          <span>{{scope.row.gps_time  | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" class-name="status-col" label="GPS获取地址">
        <template slot-scope="scope">
          <span>{{scope.row.gps_loc}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="上链ID">
        <template slot-scope="scope">
          <span>{{scope.row.txid}}</span>
        </template>
      </el-table-column>
    </el-table>

  </div>
</template>

<script type="text/javascript" src="http://api.map.baidu.com/api?v=2.0&ak=yCM2VbguexR2Rccne1Tgamd2FwoRiXwV"></script>
    
<script>
import BMap from 'BMap'
import { fetchOrderStartDetail, orderStart, orderEnd } from '@/api/user'
import { fetchRoleList } from '@/api/role'
import { mapGetters } from 'vuex'

export default {
  name: 'taskDetail',
  data() {
    return {
      downloadLoading: false,
      list: null,
      listStart: null,
      listEnd: null,
      listAll: null,
      componentKey: 0,
      listPageParams: {
        pageNo: 1,
        pageNum: 20
      },
      queryParams: {
        ledger: '',
        offset: 0,
        limit: 20
      },
      passProp: {
        start_longitude: 0,
        start_latitude: 0,
        end_longitude: 0,
        end_latitude: 0
      },
      ledgerDetail: {
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
      const uid = this.queryParams.item_id = this.$route.params.itemid
      fetchOrderStartDetail(uid).then(res => {
        this.ledgerDetail.serial_id = res.serial_id
        this.ledgerDetail.invoice_org = res.invoice_org
        this.ledgerDetail.vendor = res.vendor
        this.ledgerDetail.start_time = res.start_time
        this.ledgerDetail.end_time = res.end_time
        this.ledgerDetail.start_loc = res.start_loc
        this.ledgerDetail.end_loc = res.end_loc
        this.ledgerDetail.create_time = res.create_time
        this.ledgerDetail.amount = res.amount
        this.ledgerDetail.palate = res.palate
        this.ledgerDetail.start_short = res.start_short
        this.ledgerDetail.end_short = res.end_short
        this.passProp.start_longitude = parseFloat(res.start_longitude)
        this.passProp.start_latitude = parseFloat(res.start_latitude)
        this.passProp.end_longitude = parseFloat(res.end_longitude)
        this.passProp.end_latitude = parseFloat(res.end_latitude)
        this.componentKey += 1
        this.createMap()
      })
      orderStart(uid).then(res => {
        this.listStart = res
      })
      orderEnd(uid).then(res => {
        this.listEnd = res
      })
    },

    createMap() {
      var map = new BMap.Map('map')
      console.log(this.passProp.start_longitude)
      map.centerAndZoom(new BMap.Point(this.passProp.start_longitude, this.passProp.start_latitude), 11)

      if (this.passProp.end_longitude != null) {
        var p1 = new BMap.Point(this.passProp.start_longitude, this.passProp.start_latitude)
        var p2 = new BMap.Point(this.passProp.end_longitude, this.passProp.end_latitude)

        var driving = new BMap.DrivingRoute(map, { renderOptions: { map: map, autoViewport: true }})
        driving.search(p1, p2)
      }
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
