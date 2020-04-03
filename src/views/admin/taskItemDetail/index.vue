<template>
  <div class="app-container calendar-list-container">
    <div class="top">
      <el-row style="height:10px; margin-bottom:20px">
        运单详情
      </el-row>
      <el-row>
        <el-col :span="12">运单号: {{ledgerDetail.serial_id}}</el-col>
        <el-col :span="12">货主: {{ledgerDetail.goods_owner}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="12">线路名称: {{ledgerDetail.router}}</el-col>
        <el-col :span="12">应付金额: {{ledgerDetail.amount}}元</el-col>
      </el-row>
      <el-row>
        <el-col :span="12">出发时间: {{ledgerDetail.create_time | parseTime('{y}-{m}-{d} {h}:{i}')}}</el-col>
        <el-col :span="12">重量: {{ledgerDetail.weight}}公斤</el-col>
      </el-row>
      <el-row>
        <el-col :span="12">尺寸: {{ledgerDetail.cube}}</el-col>
      </el-row>
    </div>
  </div>
</template>
   
<script>
import { fetchTaskitem } from '@/api/user'
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
        task_pk: '',
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
        goods_owner: '',
        router: '',
        create_time: '',
        weight: '',
        cube: '',
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
      const uid = this.queryParams.task_pk = this.$route.params.taskitemid
      fetchTaskitem(uid).then(res => {
        this.ledgerDetail.serial_id = res.serial_id
        this.ledgerDetail.goods_owner = res.goods_owner
        this.ledgerDetail.router = res.router
        this.ledgerDetail.amount = res.amount
        this.ledgerDetail.weight = res.weight
        this.ledgerDetail.cube = res.cube
        this.ledgerDetail.create_time = res.create_time
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
