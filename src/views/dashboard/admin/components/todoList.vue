<template lang="html">
    <div class="todolist">
        <ul class="todolist-content">
            <li v-for="(item,index) in todoList" class="clearfix">
                <el-checkbox v-model="item.checked" @click.native="saveStorage" style="width:90%;float:left;">
                    <span :class="item.checked?'done-list':''" style="display:inline-block;overflow:hidden;text-overflow:ellipsis;width:100%;vertical-align:-3px;" :title="item.content">{{ item.content }}</span>
                </el-checkbox>
                <el-button type="text" class="pull-right" @click="delTodo(index)" size="primary" style="padding:0"><i class="el-icon-error"></i></el-button>
            </li>
        </ul>
        <!-- <el-row v-if="inputShow">
            <el-input v-model.trim="todoInput" @keyup.enter.native="addTodo" placeholder="请输入新增任务" style="margin:10px 0 4px 0"></el-input>
            <el-button type="primary" size="small" @click="addTodo">新增任务</el-button>
            <el-button type="text" @click="inputShow = false">取消</el-button>
        </el-row>
        <el-button type="text" @click="inputShow = true"><i class="el-icon-plus"></i> 新增任务</el-button> -->
    </div>
</template>

<script>
export default {
    props: [
        "todoList"
    ],
    data(){
        return {
            inputShow: false,
            user: ''
        }
    },
    created(){
        // 获取用户名
        this.user = this.$store.getters.name
    },
    methods: {
        delTodo(index){
            this.todoList.splice(index,1)
            this.$emit('delTodo', this.todoList)
            this.saveStorage()
        },
        saveStorage(){
            console.log(this.user)
            localStorage.setItem("todo" + this.user,JSON.stringify(this.todoList))
        }
    }
}
</script>

<style lang="scss" scoped>
    .todolist-content{
        list-style: none;
        padding: 0;
        margin: 0;
    }
    .done-list{
        text-decoration: line-through;
        color: #ccc;
    }
</style>
