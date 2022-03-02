<template>
  <el-card class="box-card">
    <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="68px">
      <el-form-item label="名称" prop="name">
        <el-select
          v-model="queryParams.name"
          placeholder="请选择"
          @change="selectTrigger(queryParams.name)">
          <el-option
            v-for="dict in cloudOptions"
            :key="dict.id"
            :label="dict.name"
            :value="dict.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="RAM" prop="userName">
        <el-input
          v-model="queryParams.userName"
          placeholder="请输入"
          clearable
          size="small"
          @keyup.enter.native="getRam"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="getRam">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          v-permisaction="['admin:cloudAccount:add']"
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
        >新增
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-permisaction="['admin:cloudAccount:edit']"
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
        >修改
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-permisaction="['admin:cloudAccount:remove']"
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
        >删除
        </el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="cloudAccountList" @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        width="55"
        align="center"
      />
      <el-table-column
        label="名称"
        align="center"
        prop="displayName"
        :show-overflow-tooltip="true"/>
      <el-table-column
        label="userName"
        align="center"
        prop="userName"
        :show-overflow-tooltip="true"/>
      <el-table-column
        label="备注"
        align="center"
        prop="comments"
        :show-overflow-tooltip="true"/>
      <el-table-column
        label="创建时间"
        align="center"
        prop="createDate"
        :show-overflow-tooltip="true"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            slot="reference"
            v-permisaction="['admin:cloudAccount:edit']"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
          >查看
          </el-button>
          <el-popconfirm
            class="delete-popconfirm"
            title="确认要删除吗?"
            confirm-button-text="删除"
            @onConfirm="handleDelete(scope.row)"
          >
            <el-button
              slot="reference"
              v-permisaction="['admin:cloudAccount:remove']"
              disabled
              size="mini"
              type="text"
              icon="el-icon-delete"
            >删除
            </el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageIndex"
      :limit.sync="queryParams.pageSize"
      @pagination="getRam"
    />

    <!-- 添加或修改对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">

        <el-form-item label="名称" prop="name">
          <el-input
            v-model="form.name"
            placeholder="名称"
          />
        </el-form-item>
        <el-form-item label="云类型" prop="type">
          <el-select
            v-model="form.type"
            placeholder="请选择">
            <el-option
              v-for="dict in typeOptions"
              :key="dict.name"
              :label="dict.name"
              :value="dict.name"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="ID" prop="accessId">
          <el-input
            v-model="form.accessId"
            placeholder="ID"
          />
        </el-form-item>
        <el-form-item label="Key" prop="accessKey">
          <el-input
            v-model="form.accessKey"
            placeholder="Key"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <!-- accountManager -->
    <el-dialog :title="title" :visible.sync="accountOpen" width="500px">
      <el-form ref="form" :model="accountForm" label-width="80px">
        <el-form-item label="名称" prop="name">
          <el-input
            disabled
            v-model="accountForm.name"
            placeholder="名称"
          />
        </el-form-item>
        <el-form-item label="userId" prop="userId">
          <el-input
            disabled
            v-model="accountForm.userId"
            placeholder="ID"
          />
        </el-form-item>
        <el-form-item label="登录状态" prop="value">
          <el-switch
            v-model="accountForm.value"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :disabled="disablevalue"
            @change="handleClose"
          >
          </el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="cancel">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </el-card>

</template>

<script>
import {
  addCloudAccount,
  delCloudAccount,
  listCloudAccount,
  updateCloudAccount,
  getRamList, getRamDetail, CloseRamAccount
} from '@/api/devops-tools/cloudAccount'

export default {
  name: 'CloudAccount',
  components: {},
  data() {
    return {
      nowSelect: 1,
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      accountOpen: false,
      isEdit: false,
      // 类型数据字典
      typeOptions: [
        { name: '阿里云' }
      ],
      cloudOptions: [],
      cloudAccountList: [],

      // 关系表类型

      // 查询参数
      queryParams: {
        pageIndex: 1,
        pageSize: 10,
        name: undefined,
        type: undefined

      },
      // 表单参数
      form: {},
      disablevalue: false,
      accountForm: {},
      // 表单校验
      rules: {
        name: [
          { required: true, message: '名称不能为空', trigger: 'blur' }
        ],
        accessId: [
          { required: true, message: 'accessId不能为空', trigger: 'blur' }
        ],
        accessKey: [
          { required: true, message: 'accessKey不能为空', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '类型不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getList()
    this.getRam()
  },
  methods: {
    /** 查询参数列表 */
    getList() {
      this.loading = true
      listCloudAccount(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
        this.cloudAccountList = response.data.list
        this.total = response.data.count
        this.cloudOptions = response.data.list
        this.queryParams.name = this.cloudOptions[0].id
        this.loading = false
      }
      )
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.accountOpen = false
      this.reset()
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        name: undefined,
        type: undefined,
        accessId: undefined,
        accessKey: undefined
      }
      this.resetForm('form')
    },
    getImgList: function() {
      this.form[this.fileIndex] = this.$refs['fileChoose'].resultList[0].fullUrl
    },
    fileClose: function() {
      this.fileOpen = false
    },
    // 关系
    // 文件
    /** 搜索按钮操作 */
    handleQuery() {
      console.log('test')
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = []
      this.resetForm('queryForm')
      this.handleQuery()
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.open = true
      this.title = '添加云账号'
      this.isEdit = false
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 修改按钮操作 */
    async handleUpdate(row) {
      var value1, disable1
      await getRamDetail({ id: this.nowSelect, userName: row.userName }).then(response => {
        value1 = response.data === 'faild' ? false : true
        disable1 = response.data === 'faild' ? true : false
      })
      this.accountForm.value = value1
      this.disablevalue = disable1
      this.accountForm.name = row.displayName || row.userName
      this.accountForm.userId = row.userId
      this.accountForm.userName = row.userName
      this.title = '云账号详情'
      this.accountOpen = true
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.id !== undefined) {
            updateCloudAccount(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess(response.msg)
                this.open = false
                this.getList()
              } else {
                this.msgError(response.msg)
              }
            })
          } else {
            addCloudAccount(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess(response.msg)
                this.open = false
                this.getList()
              } else {
                this.msgError(response.msg)
              }
            })
          }
        }
      })
    },
    selectTrigger(val) {
      this.loading = true
      this.nowSelect = val
      this.getRam()
      this.loading = false
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      var Ids = (row.id && [row.id]) || this.ids

      this.$confirm('是否确认删除编号为"' + Ids + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return delCloudAccount({ 'ids': Ids })
      }).then((response) => {
        if (response.code === 200) {
          this.msgSuccess(response.msg)
          this.open = false
          this.getList()
        } else {
          this.msgError(response.msg)
        }
      }).catch(function() {
      })
    },
    getRam() {
      getRamList(this.nowSelect, this.queryParams).then(response => {
        this.cloudAccountList = response.data.list
        this.total = response.data.count
      })
    },
    async handleClose() {
      await CloseRamAccount({ id: this.nowSelect, userName: this.accountForm.userName }).then(response => {
        if (response.code === 200) {
          this.accountForm.value = false
        } else {
          this.msgError(response.msg)
        }
      })
      if (!this.accountForm.value) {
        this.disablevalue = true
      }
    }
  }
}
</script>
