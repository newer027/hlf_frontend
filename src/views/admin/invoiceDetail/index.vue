<template>
  <div class="app-container calendar-list-container">
    <div class="top">
      <el-row style="height:10px; margin-bottom:20px">
        运输轨迹
      </el-row>
      <el-row>
        <el-col :span="12">发票批次号: {{invoiceDetail.batch_no}}</el-col>
        <el-col :span="12">发票总金额: {{invoiceDetail.amount}}元</el-col>
      </el-row>
    </div>
    <div>
    <el-row style="height:10px">
      关联发票号
    </el-row>
    </div>

    <el-table ref="multipleTable" :data="listStart" element-loading-text="数据加载中..." border fit
              highlight-current-row style="width: 100%" :default-sort = "{ prop: 'amount', order: 'descending'}">
      <el-table-column align="center" label="发票号" prop="vendor">
        <template slot-scope="scope">{{ scope.row|parseInvoiceNum() }}</template>
      </el-table-column>
      <el-table-column align="center" label="发票金额"> 
        <template slot-scope="scope">{{ scope.row|parseInvoiceAmt() }}元</template>
      </el-table-column>
    </el-table>

    <div>
    <el-row style="height:10px">
      关联运单号
    </el-row>
    </div>
    <el-table ref="multipleTable" :data="listEnd" element-loading-text="数据加载中..." border fit
              highlight-current-row style="width: 100%" :default-sort = "{ prop: 'amount', order: 'descending'}">
      <el-table-column align="center" label="发票号" prop="vendor">
        <template slot-scope="scope">{{ scope.row|parseInvoiceNum() }}</template>
      </el-table-column>
      <el-table-column align="center" label="发票金额"> 
        <template slot-scope="scope">{{ scope.row|parseInvoiceAmt() }}元</template>
      </el-table-column>
    </el-table>

  </div>
</template>


<script>
import { fetchInvoiceBatchList, fetchInvoice } from '@/api/user'
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
      componentKey: 0,
      listLoading: false,
      invoiceForm: {
        invoice_batch: ''
      },
      invoiceDetail: {
        batch_no: '',
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
      const uid = this.$route.params.invoiceid
      fetchInvoice(uid).then(res => {
        fetchInvoiceBatchList(res.invoice_batch).then(res => {
          this.invoiceDetail.batch_no = res.batch_no
          this.invoiceDetail.amount = res.amount
          this.listStart = res.invoice
          this.listEnd = res.taskitem
        })
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
