<template lang="html">
    <div class="hulk_table">
        <el-row class="mb-10" v-if="option.dynamicColumn">
            <el-dropdown class="fr">
                <el-button type="primary">
                更多菜单<i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                    <el-checkbox-group v-model="checkList">
                        <el-dropdown-item>
                            <el-checkbox label="复选框 A"></el-checkbox>
                        </el-dropdown-item>
                        <el-dropdown-item>
                            <el-checkbox label="复选框 B"></el-checkbox>
                        </el-dropdown-item>
                        <el-dropdown-item>
                            <el-checkbox label="复选框 C"></el-checkbox>
                        </el-dropdown-item>
                    </el-checkbox-group>
                </el-dropdown-menu>
            </el-dropdown>
        </el-row>
        <!-- 表格主体Begin -->
        <el-table :data="tableData"
                  highlight-current-row
                  tooltip-effect="dark"
                  stripe border
                  v-loading="option.listLoading">
            <!--普通列表-->
            <el-table-column v-for="(item, index) in table_config" v-if="item.type=='primary'"
                             :key="index"
                             :label="item.label"
                             :width="item.width"
                             :show-overflow-tooltip="true"
                             :min-width="item.minWidth ? item.minWidth: ''"
                             :prop="item.prop">
            </el-table-column>
            <!--标题展示列-->
            <el-table-column v-for="(item, index) in table_config" v-if="item.type=='title'"
                             :key="index"
                             :label="item.label"
                             min-width="220">
                <template slot-scope="scope">
                    <a :href="scope.row[item.url]" class="aclick" target="_blank">{{ scope.row[item.title] }}</a>
                </template>
            </el-table-column>
            <!--时间展示列-->
            <el-table-column v-for="(item, index) in table_config" v-if="item.type=='time'"
                             :key="index"
                             :label="item.label"
                             width="170">
                <template slot-scope="scope">
                    <i class="el-icon-time"></i>
                    <span v-if="scope.row[item.prop].indexOf(':') === -1">
                        {{ parseInt(scope.row[item.prop]) | parseTime('{y}-{m}-{d} {h}:{i}') }}
                    </span>
                    <span v-else>
                        {{ scope.row[item.prop] }}
                    </span>
                </template>
            </el-table-column>
            <!--Tag展示列-->
            <el-table-column v-for="(item, index) in table_config" v-if="item.type=='tag'"
                             :key="index"
                             :label="item.label"
                             :width="item.width">
                <template slot-scope="scope">
                    <el-tag :type="item.tagType(scope.row)">{{ item.tagText(scope.row) }}</el-tag>
                    {{ item.content ? scope.row[item.content]: '' }}
                </template>
            </el-table-column>
            <!--操作展示列-->
            <el-table-column v-for="(item, index) in table_config" v-if="item.type=='operation'"
                             :key="index"
                             align="left"
                             :width="buttonColumnWidth"
                             :label="item.label">
                <template slot-scope="scope">
                    <el-button v-for="(button, index) in item.buttons"
                               :key="index"
                               :type="button.type"
                               @click="button.hanleClick(scope.row)">
                        {{ button.name }}
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 表格主体End -->
        <!-- 分页Begin -->
        <el-row class="toolbar">
            <el-pagination
                @current-change="handleCurrentChange"
                @size-change="handleSizeChange"
                layout="total, sizes, prev, pager, next, jumper"
                :page-sizes="[10, 15, 20, 50, 100]"
                :page-size="pagination.pageSize"
                :current-page="pagination.currentPage"
                :total="pagination.total"
                background
                style="float:right;">
            </el-pagination>
        </el-row>
        <!-- 分页End -->
    </div>
</template>

<script>
export default {
    name: 'hulk_table',
    props: {
        tableData: {
            type: Array,
            default: () => {
                return []
            }
        },
        table_config: {
            type: Array,
            default: () => {
                return []
            }
        },
        getList: Function,
        pagination: {
            type: Object,
            default: {}
        },
        option: {
            type: Object,
            default: {}
        }
    },
    created(){
        this.getButtonColumnWidth()
    },
    data() {
        return {
            checkList: [],
            buttonColumnWidth: 140,
            currentPage: 1,
            pageSize: 10,
            total: 0
        }
    },
    methods: {
        // 操作列宽度自适应
        getButtonColumnWidth() {
            let buttonWidth = 0
            this.table_config.forEach(item => {
                if(item.type === 'operation') {
                    item.buttons.forEach(button => {
                        buttonWidth += button.name.length * 12 + 32 + 4
                    })
                }
            })
            buttonWidth += 28
            this.buttonColumnWidth = buttonWidth
        },
        // 分页
        handleSizeChange(val) {
            this.pagination.pageSize = val
            this.getList()
        },
        handleCurrentChange(val) {
            this.pagination.currentPage = val
            this.getList()
        }
    }
}
</script>

<style lang="scss" scoped="scoped">
.aclick {
    cursor: pointer;
    text-decoration: none;
    color: #666;
    display: block;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    width: 200px;
    &:hover {
        color: #58B7FF;
    }
}
</style>
