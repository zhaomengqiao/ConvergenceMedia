# 融媒体开箱即用说明

## 公用方法

### 1. 时间格式转换 `parseTime`
> 引用方法
``` javascript
import {
    parseTime,
} from '@/utils'
```
> 使用方法
``` javascript
parseTime(time, '{y}-{m}-{d} {h}:{i}:{s}')
```

### 2. 视频播放组件 `vue-video-js`
> 引用方法
``` javascript
import 'video.js/dist/video-js.css'
import {
    videoPlayer
} from 'vue-video-player'
```
> 使用方法
``` javascript
components: {
    videoPlayer
}
<video-player :options="playerOptions" ref="videoPlayer"></video-player>
computed: {
    player() {
        return this.$refs.videoPlayer.player
    }
}
playerOptions: {
    height: '400',
    width: '560',
    autoplay: false,
    language: 'zh-CN',
    controls: true, //播放控制条是否显示
    preload: true, //是否预加载
    playbackRates: [0.7, 1.0, 1.5, 2.0],
    sources: [{
        type: "video/mp4",
        // mp4
        src: ''
    }]
}
```

### 3. datetimepicker 常用时间段设置
> 引用方法
``` javascript
import {
    contentRecommend
} from '@/utils'
```
> 使用方法
``` javascript
pickerOptions: {
    // 禁止选择之前时间
    disabledDate(time) {
        return time.getTime() < Date.now() - 8.64e7;
    },
    shortcuts: contentRecommend
}
```

### 4. 右侧滑块
> 引用方法
``` javascript
import sideslip from '@/components/sideslip'
```
> 使用方法
``` javascript
components: {
    sideslip
}
<sideslip :operationTrackShow='operationTrackShow'
          :boxWidth="宽度"
          @show="展示方法"
          @fold="折叠方法"
          title="滑块标题"
          icon="按钮样式">
    <!--自定义滑块内内容-->
</sideslip>
```

### 5. 编辑器转义富文本的方法
> 引用方法
``` javascript
import { contentToHtml } from '@/utils/contentTransform'
```
> 使用方法
``` javascript
// newExam为该新闻详情整个对象
this.form.content = contentEditorHtml(newExam);
```

### 6. 引入富文本编辑器
> 引用方法
``` javascript
import vueUEditor from '@/components/UEditor'
```
> 使用方法
```
components: {
    vueUEditor,
}
```
```
<vueUEditor @ready="editorReady" style="width: 100%;height: 400px;" ref="addVideo"></vueUEditor>
```
``` javascript
editorReady(editorInstance) {
    this.editorInstance = editorInstance;
    editorInstance.setContent(this.formData.content);
    editorInstance.addListener('contentChange', () => {
        this.formData.content = editorInstance.getContent();
    })
}
```

### 7. 表格下拉加载loadmore
> 引用方法
``` javascript
import loadmore from '@/directive/loadMore'
```
> 使用方法
``` javascript
directives: {
    loadmore
}
```
```html
<el-table highlight-current-row height="400" style="width: 100%" v-loadmore="loadMore"></el-table>
```

### 8. clipboard 复制到剪切板
> 引用方法
``` javascript
import clip from '@/utils/clipboard'
```
> 使用方法
``` javascript
@click="copy($event)"
copy(event){
    clip('要复制的文本', event)
}
```

### 9. 页面布局快速复制文档
> 布局
```html
<section class="页面class,方便写局部样式">
    <!--工具栏Begin-->
    <el-card>
        <el-form :inline="true" :model="form">
        </el-form>
    </el-card>
    <!--工具栏End-->
    <!--表格Begin-->
    <el-card class="mt-10">
        <el-table :data="tableData"
                  highlight-current-row
                  v-loading="listLoading"
                  style="width: 100%;"
                  tooltip-effect="dark"
                  stripe border>
        </el-table>
    </el-card>
    <!--表格End-->
</section>
```
工具栏 -> 时间
```html
<el-form-item label="标签名称">
    <!--UI2.3 时间组件datepicker Begin-->
    <el-date-picker value-format="yyyy-MM-dd HH:mm:ss"
                    :picker-options="pickerOptions"
                    v-model="form.timeQuantum"
                    type="datetimerange"
                    placeholder="选择时间范围"
                    @change="getTopTime">
    </el-date-picker>
    <!--UI2.3 时间组件datepicker End-->
    <!--UI1.3 时间组件datepicker Begin-->
    <el-date-picker format="yyyy-MM-dd HH:mm:ss"
                    v-model="form.timeQuantum"
                    type="datetimerange"
                    placeholder="选择时间范围" @change="getTopTime">
    </el-date-picker>
    <!--UI1.3 时间组件datepicker End-->
</el-form-item>
```
工具栏 -> 下拉组件
```html
<el-form-item label="标签名称">
    <!--下拉选择组件 Begin-->
    <el-select v-model="值" class="select-platform"
        filterable placeholder="placeholder">
        <el-option
            v-for="(item,index) in auditPeoples"
            :key="index"
            :label="item.realname"
            :value="item.uname">
        </el-option>
    </el-select>
    <!--下拉选择组件 End-->
</el-form-item>
```
工具栏 -> 输入框
```html
<el-form-item>
    <!--输入框 Begin-->
        <el-input v-model="值" placeholder="placeholder"></el-input>
    <!--输入框 End-->
</el-form-item>
```
工具栏 -> 按钮
```html
<el-form-item>
    <!--按钮 Begin-->
    <el-button type="primary" @click="方法">按钮名称</el-button>
    <!--按钮 End-->
</el-form-item>
```
表格 -> 时间展示
```html
<!--时间组件 时间戳转换格式有公用过滤器-->
<el-table-column label="标签" width="170" :show-overflow-tooltip="true">
    <template slot-scope="scope">
        <span>
            {{ parseInt(scope.row.audittime) | parseTime('{y}-{m}-{d} {h}:{i}') }}
        </span>
    </template>
</el-table-column>
```
表格 -> 普通
```html
<el-table-column prop="值" label="标签名" width="100" :show-overflow-tooltip="true">
</el-table-column>
```
表格 -> 标题
```html
<el-table-column label="标签名" min-width="220">
    <template slot-scope="scope">
        <a :href="scope.row.url" class="aclick" target="_blank">{{ scope.row.newstitle }}</a>
    </template>
</el-table-column>
```
表格 -> 分页
```html
<el-row class="toolbar">
    <el-pagination
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
      layout="total, sizes, prev, pager, next, jumper"
      :page-sizes="[10, 15, 20, 50, 100]"
      :page-size="pageSize"
      :current-page="currentPage"
      :total="total"
      background
      style="float:right;">
    </el-pagination>
</el-row>
```
```javascript
handleSizeChange(val) {
    this.pageSize = val
    this.getList()
},
handleCurrentChange(val) {
    this.currentPage = val
    this.getList()
}
```
```javascript
data() {
    return {
        form: {
            starttime: '',
            endtime: ''
        }
    }
}
```
### 10. 个人中心表格行数
> 引用方法
``` javascript
import {
    mapGetters
} from 'vuex';
computed: {
    ...mapGetters([
        'personalConfig'
    ])
},
this.pageSize = this.personalConfig.tableRowShow
```
