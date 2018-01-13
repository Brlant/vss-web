<style lang="less" scoped="">
  .power-style-part {
    margin: 12px 0;
    background-color: rgba(238, 238, 238, 0.5);
    padding: 2px 10px;
    border-radius: 4px;
    line-height: 30px;
    .el-checkbox {
      margin-left: 15px;
    }
  }

  .btn-submit-save {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 1;
    text-align: center;
    padding: 15px;
  }
</style>
<template>
  <div class="content-part">
    <div class="content-left">
      <h2 class="clearfix right-title">角色管理</h2>
      <div class="btn-submit-save">
        <div>
          <el-button type="primary" style="width: 100px" @click="onSubmit('roleform')" native-type="submit" :disabled="doing">保存
          </el-button>
        </div>
        <div>
          <el-button style="width: 100px" @click.prevent.stop="doClose">关闭</el-button>
        </div>
      </div>
    </div>
    <div class="content-right min-gutter">
      <el-form ref="roleform" :rules="rules" :model="form" label-width="100px" class="demo-ruleForm"
               @submit.prevent="onSubmit('roleform')" onsubmit="return false">
        <el-form-item label="角色名称" prop="title">
          <oms-input type="text" v-model="form.title" placeholder="请输入"></oms-input>
        </el-form-item>
        <el-form-item label="英文名称" prop="name">
          <oms-input type="text" v-model="form.name" placeholder="请输入"></oms-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <oms-input type="text" v-model="form.remark" placeholder="请输入"></oms-input>
        </el-form-item>
        <h4 class="clearfix">配置角色权限</h4>
        <!--<div v-if="tree.length === 0" class="empty-info">-->
        <!--暂无角色权限-->
        <!--</div>-->
        <!--<div v-else>-->
        <!--<div>-->
        <!--<el-checkbox label="全选" style="margin-bottom: 20px" v-model="checkAllRoles"-->
        <!--@change="checkAllChange(checkAllRoles)"></el-checkbox>-->
        <!--</div>-->
        <!--<div v-for="(menu,index) in tree">-->
        <!--<el-checkbox :indeterminate="menu.isIndeterminate" v-model="menu.status"-->
        <!--@change="handleCheckAllChange(menu)">-->
        <!--{{ roleMenu.menuList[menu.parentId] }}-->
        <!--</el-checkbox>-->
        <!--<el-checkbox-group style="margin-left: 12px" v-model="menu.checkedChildren"-->
        <!--@change="handleCheckedItemChange(menu)">-->
        <!--<div class="power-style-part" v-show="menu.children.length>0">-->
        <!--<div style="margin:10px 3px">-->
        <!--<el-checkbox v-for="child in menu.children" :label="child.id" :key="child.id" v-model="child.checked">-->
        <!--{{ roleMenu.menuList[child.id] }}-->
        <!--</el-checkbox>-->
        <!--</div>-->
        <!--</div>-->
        <!--</el-checkbox-group>-->
        <!--</div>-->
        <div>
          <el-checkbox label="全选" style="margin-bottom: 20px"
                       @change="checkAll()"></el-checkbox>
        </div>
        <el-tree :data="treeData" :props="defaultProps" show-checkbox node-key="id" default-expand-all
                 :expand-on-click-node="false" :render-content="renderContent">
        </el-tree>
        <!--</div>-->
      </el-form>
    </div>
  </div>
</template>
<script type="text/jsx">
  import { Access } from '../../../../resources';

  export default {
    props: {
      formItem: {
        type: Object,
        required: true
      },
      action: {
        type: String,
        default: ''
      },
      actionType: {
        type: Boolean,
        default: true
      }
    },
    data: function () {

      let checkName = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入角色英文名称'));
        } else {
          let re = /^[A-Za-z]+$/ig;
          if (!re.test(value)) {
            callback(new Error('请输入正确的角色英文名称'));
          } else {
            callback();
          }
        }
      };
      return {
        treeData: [],
        form: this.formItem,
        permissionMenu: [], // 存储选择的权限
        tree: [], // 新封装的权限菜单的数据结构
        menuData: [], // 权限菜单的map,根据key，获取value
        checkAllRoles: false,
        doing: false,
        rules: {
          title: [
            {required: true, message: '请输入角色名称', trigger: 'blur'}
          ],
          name: [
            {required: true, message: '请输入角色英文名称', trigger: 'blur'},
            {type: 'name', message: '请输入正确的角色英文名称', validator: checkName, trigger: 'blur'}
          ],
          remark: [
            {required: true, message: '请输入角色描述', trigger: 'blur'}
          ]
        }
      };
    },
    computed: {
//      roleMenu () {
//        return this.$store.state.permList;
//      }
    },
    mounted: function () {
//      const self = this;
//      if (!this.roleMenu.tree) return;
//      this.roleMenu.tree.forEach(function (val) {
//        let temp = {
//          parentId: val.parentId,
//          status: false,
//          isIndeterminate: false,
//          children: [],
//          checkedChildren: []
//        };
//        val.children.forEach(function (val) {
//          let child = {
//            id: val,
//            checked: false
//          };
//          temp.children.push(child);
//        });
//        self.tree.push(temp);
//      });
      let userId = this.$store.state.user.userCompanyAddress;
      Access.getRoleMenus(userId).then(res => {
        this.treeData = res.data;
      });
    },
    watch: {
      formItem: function (val) {
        if (val.id) {
          this.form = this.formItem;
          this.selectExistMenu();
        } else {
          this.form = {
            title: '',
            name: '',
            remark: '',
            permissionList: []
          };
          this.selectExistMenu();
        }
        let userId = this.$store.state.user.userCompanyAddress;
        Access.getRoleMenus(userId).then(res => {
          this.treeData = res.data;
        });
      },
      showRight: function (val) {
        if (!val) {
          this.$refs['roleform'].resetFields();
        }
      },
      roleMenu (val) {
        if (!val) return;
        const self = this;
        val.tree.forEach(function (val) {
          let temp = {
            parentId: val.parentId,
            status: false,
            isIndeterminate: false,
            children: [],
            checkedChildren: []
          };
          val.children.forEach(function (val) {
            let child = {
              id: val,
              checked: false
            };
            temp.children.push(child);
          });
          self.tree.push(temp);
        });
      }
    },
    methods: {
      checkAll: function () {
        this.$refs.tree.setCheckedKeys([]);
      },
      renderContent(h, {node, data, store}) {
        return (
          <span
            style="flex: 1; display: flex; align-items: center; justify-content: space-between; font-size: 14px; padding-right: 8px;">
              <span>
                <span>{node.label}</span>
              </span></span>);
      },
      selectExistMenu () {// 选中已有的权限
        let self = this;
        self.tree.forEach(item => {// 清空已经选中的角色
          item.checkedChildren = [];
        });

        this.form.permissionList.forEach(function (obj) {// 遍历数据库返回已经选中的权限
          let val = obj.name;
          self.tree.forEach(function (m) {
            m.isIndeterminate = m.parentId === val;
            m.children.forEach(function (c) {
              c.checked = c.id === val;
              if (c.checked) {
                let index = m.checkedChildren.indexOf(val);
                if (index !== -1) return;
                m.checkedChildren.push(val);
              }
            });
          });
        });
        let m;
        for (let i = 0; i < this.tree.length; i++) {// 设置以及一级菜单的状态
          m = this.tree[i];
          m.status = m.checkedChildren.length === m.children.length;
          m.isIndeterminate = false;
          if (!m.status) {
            m.isIndeterminate = m.checkedChildren.length > 0;
          }
          if (m.children.length === 0) {
            m.status = false;
            this.form.permissionList.forEach(item => {
              if (item.name === m.parentId) {
                m.status = true;
              }
            });
          }
        }
      },
      handleCheckAllChange (menu) {// 一级菜单触发事件
        menu.checkedChildren = [];
        if (menu.status) {
          menu.children.forEach(item => {
            menu.checkedChildren.push(item.id);
          });
          menu.isIndeterminate = false;
        }
      },
      handleCheckedItemChange (m) {// 二级菜单触发事件
        m.children.forEach(item => {
          item.checked = m.checkedChildren.indexOf(item.id) !== -1;
        });
        m.status = m.checkedChildren.length >= m.children.length;
        m.isIndeterminate = false;
        if (!m.status) {
          m.isIndeterminate = m.checkedChildren.length > 0;
        }
      },
      checkAllChange (val) {// 全选触发事件
        if (val) {
          this.tree.forEach(item => {
            item.status = true;
            item.isIndeterminate = false;
            item.children.forEach(child => {
              item.checkedChildren.push(child.id);
            });
          });
        } else {
          this.tree.forEach(item => {
            item.status = false;
            item.isIndeterminate = false;
            item.checkedChildren = [];
          });
        }
      },
      onSubmit: function (formName) {
        this.$refs[formName].validate((valid) => {
          if (!valid || this.doing) {
            return false;
          }
          this.doing = true;
          let rolelist = [];
          let self = this;
          this.tree.forEach(item => {
            if (item.status || item.isIndeterminate) {
              rolelist.push({
                name: item.parentId,
                title: self.menuData[item.parentId]
              });
            }
            item.checkedChildren.forEach(val => {
              rolelist.push({
                name: val,
                title: self.menuData[val]
              });
            });
          });

          this.form.permissionList = rolelist;
          if (this.action === 'add') {
            this.form.objectId = 'wms-system';
            Access.save(this.form).then(() => {
              this.doing = false;
              this.$notify.success({
                duration: 2000,
                name: '成功',
                message: '新增角色"' + this.form.title + '"成功'
              });
              this.$emit('changed', this.form);
            }).catch(() => {
              this.$notify.error({
                duration: 2000,
                message: '新增角色"' + this.form.title + '"失败'
              });
              this.doing = false;
            });
          } else {
            Access.update(this.form.id, this.form).then(() => {
              this.doing = false;
              this.$notify.success({
                duration: 2000,
                name: '成功',
                message: '修改角色"' + this.form.title + '"成功'
              });
              this.$emit('changed', this.form);
            }).catch(() => {
              this.$notify.error({
                duration: 2000,
                message: '修改角色"' + this.form.title + '"失败'
              });
              this.doing = false;
            });
          }
        });
      },
      doClose: function () {
        this.$emit('close');
        this.$refs['roleform'].resetFields();
      }
    }
  };
</script>
