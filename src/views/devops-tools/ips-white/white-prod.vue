<template>
  <el-card class="box-card">
    <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="68px">
      <el-form-item label="地址簿" prop="cloudFirewall">
        <el-input
          v-model="queryParams.cloudFirewall"
          placeholder="请输入地址簿"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="安全组" prop="safeGroup">
        <el-input
          v-model="queryParams.safeGroup"
          placeholder="请输入安全组"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          v-permisaction="['admin:prodWhiteIps:add']"
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
        >新增
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-permisaction="['admin:prodWhiteIps:remove']"
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
        >删除
        </el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="prodWhiteIpsList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column
        label="地址簿"
        align="center"
        size="medium"
        prop="cloudFirewall"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="安全组"
        align="center"
        size="medium"
        prop="safeGroup"
        :show-overflow-tooltip="true"
      />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            slot="reference"
            v-permisaction="['admin:prodWhiteIps:edit']"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleCat(scope.row)"
          >查看
          </el-button>
          <el-button
            slot="reference"
            v-permisaction="['admin:prodWhiteIps:remove']"
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="addOpenFunc(scope.row)"
          >加白
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageIndex"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
    <!-- 添加或修改对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px">
      <el-form ref="form" :model="form" :rules="rules">
        <el-row :gutter="20">
          <el-col :span="6"><div class="grid-content bg-purple">
            <el-form-item label="地址簿" prop="cloudFirewall">
              <el-autocomplete
                class="inline-input"
                v-model="form.cloudFirewall"
                :fetch-suggestions="querySearch"
                placeholder="点击选择"
                :autofocus="true"
                @select="handleSelect"
              ></el-autocomplete>
            </el-form-item>
          </div></el-col>
          <el-col :span="6" :offset="6"><div class="grid-content bg-purple">
            <el-form-item label="安全组" prop="safeGroup">
              <el-autocomplete
                class="inline-input"
                v-model="form.safeGroup"
                :fetch-suggestions="querySearchSafeGroup"
                placeholder="点击选择"
                @select="handleSelectSafeGroup"
              ></el-autocomplete>
            </el-form-item>
          </div></el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">绑 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="title" :visible.sync="catopen" width="1000px">
      <el-row>
        <el-col :span="12"><div class="grid-content bg-purple">
          <el-table
            :data="cloudFirewallList"
            stripe
            border
            style="width: 100%">
            <el-table-column
              prop="sourceCidrIp"
              label="IP(云防火墙)">
            </el-table-column>
          </el-table>
        </div></el-col>
        <el-col :span="12"><div class="grid-content bg-purple-light">
          <el-table
            :data="safegroupList"
            stripe
            border
            style="width: 100%">
            <el-table-column
              prop="sourceCidrIp"
              label="IP(安全组)"
              width="160">
            </el-table-column>
            <el-table-column
              prop="portRange"
              label="端口"
              width="100">
            </el-table-column>
            <el-table-column
              prop="description"
              label="描述">
            </el-table-column>
          </el-table>
        </div></el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="cancel">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="title" :visible.sync="addopen" width="1000px">
      <el-form :model="IPformAdd" :rules="ipaddRule" ref="IPformAdd">
        <el-row>
          <el-col :span="12">
            <div class="grid-content bg-purple">
              <el-form-item label="IP地址" :label-width="formLabelWidth" prop="ip">
                <el-input v-model="IPformAdd.ip" placeholder="请输入IP"></el-input>
              </el-form-item>
              <el-form-item label="协议" :label-width="formLabelWidth" prop="type">
                <el-select v-model="IPformAdd.type" placeholder="协议">
                  <el-option label="TCP" value="tcp"></el-option>
                  <el-option label="UDP" value="udp"></el-option>
                </el-select>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="12">
            <div>
              <el-form-item label="端口" :label-width="formLabelWidth" prop="port">
                <el-input-number v-model="IPformAdd.port" placeholder="端口" :min="0" :max="65535"></el-input-number>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row style="margin-top: 10px">
          <el-form-item label="备注" :label-width="formLabelWidth" prop="remarks">
            <el-input v-model="IPformAdd.remarks" type="textarea"></el-input>
          </el-form-item>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addopen = false">取 消</el-button>
        <el-button type="primary" @click="handleIpAdd('IPformAdd')">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>
<script>

import {
  addProdWhiteIps,
  delProdWhiteIps,
  listProdWhiteIps,
  updateProdWhiteIps,
  getCloudFirewalld,
  getSafeGroup,
  GetCloudFirewalldDetail,
  GetSafeGroupDetail,
  AddIp
} from '@/api/devops-tools/prod-white'

export default {
  name: 'ProdWhiteIps',
  components: {},
  data() {
    return {
      ipaddData: [],
      restaurants: [],
      safegroupList: [],
      formLabelWidth: '120px',
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
      catopen: false,
      addopen: false,
      isEdit: false,
      IPformAdd: {
        ip: '',
        port: '',
        remarks: '',
        type: ''
      },
      // 类型数据字典
      typeOptions: [],
      prodWhiteIpsList: [],
      safeGroupList: [],
      cloudFirewallList: [],
      // 查询参数
      queryParams: {
        pageIndex: 1,
        pageSize: 10,
        cloudFirewall: undefined,
        safeGroup: undefined,
        status: undefined

      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        cloudFirewall: [{ required: true, message: '地址簿不能为空', trigger: 'blur' }],
        safeGroup: [{ required: true, message: '安全组不能为空', trigger: 'blur' }]
      },
      ipaddRule: {
        ip: [
          { required: true, message: '请输入IP', trigger: 'blur' },
          {
            required: true,
            pattern: /^(((25[0-5]|2[0-4]\d|1?\d?\d)\.){3}(25[0-5]|2[0-4]\d|1?\d?\d)[\/](32)[,$]?)+$/,
            message: '示例：192.168.1.1/32,192.168.2.1/32',
            trigger: 'blur'
          }
        ],
        port: [
          { required: true, message: '请选择端口', trigger: 'blur' },
          {
            required: true,
            pattern: /^.+$/,
            message: '',
            trigger: 'blur'
          }
        ],
        remarks: [
          { required: true, message: '请输备注', trigger: 'blur' },
          {
            required: true,
            pattern: /^.+$/,
            message: '备注不能为空',
            trigger: 'blur'
          }
        ],
        type: [
          { required: true, message: '请输协议', trigger: 'blur' },
          {
            required: true,
            pattern: /^.+$/,
            message: '协议不能为空',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    /** 查询参数列表 */
    getList() {
      this.loading = true
      listProdWhiteIps(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
        this.prodWhiteIpsList = response.data.list
        this.total = response.data.count
        this.loading = false
      }
      )
    },
    // 取消按钮
    cancel() {
      this.addopen = false
      this.open = false
      this.catopen = false
      this.reset()
    },
    // 表单重置
    reset() {
      this.form = {

        id: undefined,
        cloudFirewall: undefined,
        safeGroup: undefined
      }
      this.resetForm('form')

      this.IPformAdd = {

        ip: undefined,
        port: undefined,
        type: undefined,
        remarks: undefined
      }
      this.resetForm('IPformAdd')
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
      this.queryParams.pageIndex = 1
      this.getList()
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
      this.loadData()
      this.open = true
      this.title = '添加绑定组'
      this.isEdit = false
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 修改按钮操作 */
    handleCat(row) {
      this.title = '查看白名单详情'
      this.catopen = true
      this.getDataDetail(row)
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.id !== undefined) {
            updateProdWhiteIps(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess(response.msg)
                this.open = false
                this.getList()
              } else {
                this.msgError(response.msg)
              }
            })
          } else {
            addProdWhiteIps(this.form).then(response => {
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
    /** 删除按钮操作 */
    handleDelete(row) {
      var Ids = (row.id && [row.id]) || this.ids

      this.$confirm('是否确认删除编号为"' + Ids + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return delProdWhiteIps({ 'ids': Ids })
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
    querySearch(queryString, cb) {
      var restaurants = this.restaurants
      var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants
      cb(results)
    },
    querySearchSafeGroup(queryString, cb) {
      var restaurants = this.safegroupList
      var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants
      cb(results)
    },
    createFilter(queryString) {
      return (restaurant) => {
        return (restaurant.value.toLowerCase().search(queryString.toLowerCase()) >= 0)
      }
    },
    handleSelect(item) {
      this.form.cloudFirewall = item.value + ' | ' + item.groupUuid
    },
    handleSelectSafeGroup(item) {
      this.form.safeGroup = item.value + ' | ' + item.groupUuid
    },
    loadData(querystr) {
      getCloudFirewalld({ select: querystr }).then(response => {
        if (response.code === 200) {
          this.restaurants = response.data
        } else {
          this.msgError(response.msg)
        }
      })
      getSafeGroup().then(response => {
        if (response.code === 200) {
          this.safegroupList = response.data
        } else {
          this.msgError(response.msg)
        }
      })
    },
    getDataDetail(row) {
      GetCloudFirewalldDetail(row).then(response => {
        if (response.code === 200) {
          this.cloudFirewallList = response.data
        } else {
          this.msgError(response.msg)
        }
      })
      GetSafeGroupDetail(row).then(response => {
        if (response.code === 200) {
          this.safegroupList = response.data
        } else {
          this.msgError(response.msg)
        }
      })
    },
    addOpenFunc(row) {
      this.title = '添加IP'
      this.addopen = true
      this.ipaddData = row
      this.reset()
    },
    handleIpAdd(form) {
      var data = {
        ip: this.IPformAdd.ip,
        remarks: this.IPformAdd.remarks,
        port: this.IPformAdd.port.toString(),
        type: this.IPformAdd.type,
        cloudFirewall: this.ipaddData.cloudFirewall,
        safeGroup: this.ipaddData.safeGroup

      }
      this.$refs[form].validate((valid) => {
        if (valid) {
          AddIp(data).then(response => {
            if (response.code === 200) {
              this.msgSuccess(response.msg)
              this.addopen = false
              this.getList()
            } else {
              this.msgError(response.msg)
            }
          })
        } else {
          console.log('error submit!!')
        }
      })
    }
  }
}
</script>
