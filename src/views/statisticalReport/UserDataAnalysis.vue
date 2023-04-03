<template>
    <el-container direction="vertical">
        <el-row type="flex" justify="space-between">
            <div class="panel"></div>
            <div class="panel"></div>
            <div class="panel"></div>
            <div class="panel"></div>
        </el-row>


        <div class="main">
            <div class="page_head">
                <span class="title">用户数据统计</span>
                <el-radio-group v-model="userDataType" size="mini" fill="#4eac8f">
                    <el-radio-button label="1">当日</el-radio-button>
                    <el-radio-button label="2">本月</el-radio-button>
                    <el-radio-button label="3">季度</el-radio-button>
                    <el-radio-button label="4">年度</el-radio-button>
                </el-radio-group>
            </div>
            <div class="panel_box">
                <div class="panel_item">
                    <div class="panel_top">
                        <p class="panel_add_title"><span style="color: red;">新增老师</span><span>用户数</span></p>
                        <p class="panel_count">2,348</p>
                        <p class="panel_all_title"><span>老师</span><span>总用户数</span><span>234,524</span></p>
                    </div>
                    <div class="panel_bottom">
                        <span>对比上月</span>
                        <span>3,452</span>
                        <span class="red_per"><i class="el-icon-caret-bottom"><span
                                class="red_shape"></span></i>13%</span>
                    </div>
                </div>
                <div class="panel_item">
                    <div class="panel_top">
                        <p class="panel_add_title"><span style="color: red;">新增学生</span><span>用户数</span></p>
                        <p class="panel_count">2,348</p>
                        <p class="panel_all_title"><span>学生</span><span>总用户数</span><span>234,524</span></p>
                    </div>
                    <div class="panel_bottom">
                        <span>对比上月</span>
                        <span>3,452</span>
                        <span class="red_per"><i class="el-icon-caret-bottom"><span
                                class="red_shape"></span></i>13%</span>
                    </div>
                </div>
                <div class="panel_item">
                    <div class="panel_top">
                        <p class="panel_add_title"><span style="color: red;">新增家长</span><span>用户数</span></p>
                        <p class="panel_count">4,348</p>
                        <p class="panel_all_title"><span>家长</span><span>总用户数</span><span>234,524</span></p>
                    </div>
                    <div class="panel_bottom">
                        <span>对比上月</span>
                        <span>3,452</span>
                        <span><i class="el-icon-caret-top"><span class="green_shape"></span></i>13%</span>
                    </div>
                </div>
                <div class="panel_item">
                    <div class="panel_top">
                        <p class="panel_add_title"><span style="color: red;">新增学校</span><span>用户数</span></p>
                        <p class="panel_count">4,348</p>
                        <p class="panel_all_title"><span>学校</span><span>总用户数</span><span>234,524</span></p>
                    </div>
                    <div class="panel_bottom">
                        <span>对比上月</span>
                        <span>3,452</span>
                        <span><i class="el-icon-caret-top"><span class="green_shape"></span></i>13%</span>
                    </div>
                </div>
            </div>
            <div class="charts_line">
                <div class="page_head">
                    <span class="title">用户增长曲线图</span>
                    <div style="margin-left: 30px;">
                        <el-radio-group v-model="userAddDataType" size="mini" fill="#4eac8f">
                            <el-radio-button label="1">按月</el-radio-button>
                            <el-radio-button label="2">按季度</el-radio-button>
                            <el-radio-button label="3">按年</el-radio-button>
                        </el-radio-group>
                    </div>
                </div>
                <div id="charts_line" style="height: 50vh;"></div>
            </div>
            <div class="page_head">
                <span class="title">用户画像分析</span>
            </div>
            <div class="tab_box">
                <div class="tab_item" :class="tabType == 1 ? 'tab_item_background' : 'tab_item_border'"
                     @click="changeTab(1)">老师
                </div>
                <div class="tab_item" :class="tabType == 2 ? 'tab_item_background' : 'tab_item_border'"
                     @click="changeTab(2)">学生
                </div>
                <div class="tab_item" :class="tabType == 3 ? 'tab_item_background' : 'tab_item_border'"
                     @click="changeTab(3)">家长
                </div>
            </div>
            <div class="charts_pie">
                <div v-for="id in chartsIdList" :id="id" :key="id"
                     style="display: inline-block;height: 25vh;width: 400px;"></div>
            </div>
            <div class="page_head">
                <span class="title">用户数TOP20</span>
            </div>
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-table v-loading="isLoading" :data="tableData" border style="margin-bottom: 20px;">
                        <el-table-column align="center" type="index" label="排序"></el-table-column>
                        <el-table-column label="学校">
                            <template slot-scope="scope">
                                <p>{{scope.row.schoolName}}</p>
                                <p style="color: #d6d6d6;">
                                    <span>{{scope.row.province}}</span>
                                    <span style="margin-left: 5px;">{{scope.row.city}}</span>
                                    <span style="margin-left: 5px;">{{scope.row.area}}</span>
                                </p>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" prop="countNum" label="总数"></el-table-column>
                        <el-table-column align="center" prop="teacherNum" label="老师"></el-table-column>
                        <el-table-column align="center" prop="studentNum" label="学生"></el-table-column>
                        <el-table-column align="center" prop="parentNum" label="家长"></el-table-column>
                    </el-table>
                </el-col>
                <el-col :span="12">
                    <el-table v-loading="isLoading" :data="tableData" border style="margin-bottom: 20px;">
                        <el-table-column align="center" type="index" label="排序"></el-table-column>
                        <el-table-column label="学校">
                            <template slot-scope="scope">
                                <p><span>{{scope.row.province}}</span><span
                                        style="margin-left: 5px;">{{scope.row.city}}</span></p>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" prop="countNum" label="总数"></el-table-column>
                        <el-table-column align="center" prop="teacherNum" label="老师"></el-table-column>
                        <el-table-column align="center" prop="studentNum" label="学生"></el-table-column>
                        <el-table-column align="center" prop="parentNum" label="家长"></el-table-column>
                    </el-table>
                </el-col>
            </el-row>
        </div>
    </el-container>
</template>

<script>
    export default {
        data() {
            return {
                userDataType: '2',
                userAddDataType: '1',
                tabType: 1,
                lineDataList: [
                    {teacher: 2100, student: 1200, parent: 2700, time: '1月'},
                    {teacher: 1100, student: 3300, parent: 2000, time: '2月'},
                    {teacher: 1800, student: 3100, parent: 2800, time: '3月'},
                    {teacher: 1400, student: 4100, parent: 2400, time: '4月'},
                    {teacher: 2600, student: 4500, parent: 3800, time: '5月'},
                    {teacher: 2200, student: 3400, parent: 2800, time: '6月'},
                    {teacher: 2800, student: 3000, parent: 4000, time: '7月'},
                    {teacher: 2700, student: 3800, parent: 3000, time: '8月'},
                    {teacher: 2600, student: 3400, parent: 2800, time: '9月'},
                    {teacher: 2200, student: 3000, parent: 2400, time: '10月'},
                    {teacher: 2700, student: 3800, parent: 3000, time: '11月'},
                    {teacher: 2600, student: 3100, parent: 2800, time: '12月'},
                ],
                pieDataList: {
                    registerSource: {
                        selfRegistration: {color: '#70d0cf', value: 38},
                        parent: {color: '#cf3f4f', value: 34},
                        teacher: {color: '#e99223', value: 28}
                    },
                    sex: {
                        man: {color: '#70d0cf', value: 48},
                        women: {color: '#cf3f4f', value: 52}
                    },
                    age: {
                        20: {color: '#70d0cf', value: 48},
                        30: {color: '#cf3f4f', value: 52},
                        40: {color: '#e99223', value: 28},
                        50: {color: '#2a4a80', value: 12},
                    },
                    area: {
                        fj: {color: '#70d0cf', value: 38},
                        zj: {color: '#cf3f4f', value: 34},
                        jx: {color: '#e99223', value: 28},
                        hn: {color: '#2a4a80', value: 12},
                    }
                },
                chartsIdList: [],
                pieLabel: {
                    registerSource: '注册来源', selfRegistration: '自行注册', parent: '家长推荐', teacher: '合作老师',
                    sex: '性别', man: '男', women: '女',
                    age: '年龄层', 20: '20-30岁', 30: '30-40岁', 40: '40-50岁', 50: '50岁以上',
                    area: '省份地区', fj: '福建省', zj: '浙江省', jx: '江西省', hn: '海南省',
                },
                tableData: [
                    {
                        id: 1,
                        schoolName: '福建师范小学',
                        province: '福建省',
                        city: '龙岩市',
                        area: '新罗区',
                        countNum: '243',
                        teacherNum: '243',
                        studentNum: '2435',
                        parentNum: '1232',
                    },
                    {
                        id: 1,
                        schoolName: '福建师范小学',
                        province: '福建省',
                        city: '龙岩市',
                        area: '新罗区',
                        countNum: '243',
                        teacherNum: '243',
                        studentNum: '2435',
                        parentNum: '1232',
                    },
                    {
                        id: 1,
                        schoolName: '福建师范小学',
                        province: '福建省',
                        city: '龙岩市',
                        area: '新罗区',
                        countNum: '243',
                        teacherNum: '243',
                        studentNum: '2435',
                        parentNum: '1232',
                    },
                    {
                        id: 1,
                        schoolName: '福建师范小学',
                        province: '福建省',
                        city: '龙岩市',
                        area: '新罗区',
                        countNum: '243',
                        teacherNum: '243',
                        studentNum: '2435',
                        parentNum: '1232',
                    },
                    {
                        id: 1,
                        schoolName: '福建师范小学',
                        province: '福建省',
                        city: '龙岩市',
                        area: '新罗区',
                        countNum: '243',
                        teacherNum: '243',
                        studentNum: '2435',
                        parentNum: '1232',
                    },
                ],
                isLoading: false,
            }
        },
        components: {},
        methods: {
            changeTab(tabType) {
                this.tabType = tabType;
                if (this.tabType == 1) {
                    return false;
                } else if (this.tabType == 2) {
                    return false;
                }
            },
            * gen() {
                yield 'a';
                yield 'b';
            },
            initLineCharts() {
                let chartOption = {
                    grid: {left: '15%'},
                    tooltip: {
                        textStyle: {
                            align: 'left'
                        },
                        trigger: 'axis',
                        axisPointer: {
                            animation: false
                        }
                    },
                    legend: {data: [], x: 'center'},
                    xAxis: {type: 'category', axisTick: false, data: []},
                    yAxis: [{type: 'value', axisTick: false, splitLine: {show: false}}],
                    series: []
                };
                let chartObj = this.$echarts.init(document.getElementById('charts_line'));
                let xAxisList = [];
                let teacher = {
                    name: '老师',
                    tooltip: {trigger: "axis"},
                    lineStyle: {color: '#222229'},
                    itemStyle: {color: '#222229'},
                    symbol: 'circle',
                    symbolSize: 8,
                    yAxisIndex: 0,
                    data: [],
                    type: 'line'
                }
                let student = {
                    name: '学生',
                    tooltip: {trigger: "axis"},
                    lineStyle: {color: '#d93034'},
                    itemStyle: {color: '#d93034'},
                    symbol: 'circle',
                    symbolSize: 8,
                    yAxisIndex: 0,
                    data: [],
                    type: 'line'
                }
                let parent = {
                    name: '家长',
                    tooltip: {trigger: "axis"},
                    lineStyle: {color: '#4776e6'},
                    itemStyle: {color: '#4776e6'},
                    symbol: 'circle',
                    symbolSize: 8,
                    yAxisIndex: 0,
                    data: [],
                    type: 'line'
                }
                this.lineDataList.forEach(obj => {
                    teacher.data.push(obj.teacher);
                    student.data.push(obj.student);
                    parent.data.push(obj.parent);
                    xAxisList.push(obj.time);
                })
                chartOption.legend.data = [{name: '老师', icon: 'roundRect'}, {
                    name: '学生',
                    icon: 'roundRect'
                }, {name: '家长', icon: 'roundRect'}];
                chartOption.series.push(teacher);
                chartOption.series.push(student);
                chartOption.series.push(parent);
                chartOption.xAxis.data = xAxisList;
                chartObj.setOption(chartOption);
            },
            createPieCharts() {
                this.chartsIdList.forEach(obj => {
                    let chartObj = this.$echarts.init(document.getElementById(obj));
                    let chartOption = {
                        legend: {
                            orient: 'vertical',
                            top: '30%',
                            right: 0,
                            data: [],
                        },
                        grid: {
                            left: 0, right: 0, top: 0, bottom: 0
                        },
                        graphic: {
                            type: 'text',
                            left: 'center',
                            top: 'center',
                            style: {
                                text: this.pieLabel[obj],
                                textAlign: 'center',
                                font: '1.5vh sans-serif'
                            }
                        }
                    };
                    let series = {
                        name: '',
                        type: 'pie',
                        center: '50%',
                        radius: ['40%', '60%'],
                        label: {normal: {show: false}},
                        labelLine: {normal: {show: false}},
                        data: []
                    }
                    Object.keys(this.pieDataList[obj]).forEach(o => {
                        series.data.push({
                            name: this.pieLabel[o] + ' ' + this.pieDataList[obj][o].value + '%',
                            itemStyle: {color: this.pieDataList[obj][o].color},
                            value: this.pieDataList[obj][o].value
                        });
                        chartOption.legend.data.push({
                            name: this.pieLabel[o] + ' ' + this.pieDataList[obj][o].value + '%',
                            icon: 'roundRect'
                        });
                    })
                    chartOption.series = series;
                    chartObj.setOption(chartOption);
                })
            },
        },
        created() {
            setTimeout(() => {
                this.initLineCharts()
                this.chartsIdList = Object.keys(this.pieDataList);
                this.$nextTick(function () {
                    this.createPieCharts()
                })
            }, 100);
        }
    }
</script>

<style scoped>
    .panel {
        width: calc((100% - 250px) / 4);
        min-width: 200px;
        height: 150px;
        padding: 25px;
        text-align: center;
        background-color: #fafbfe;
        border: 1px solid #f0f2f9;
        /*border-radius: 8px;*/
        /*box-shadow: 0 0 5px slategray;*/
    }


    div {
        box-sizing: border-box;
    }

    .title {
        font-size: 22px;
        font-weight: bold;
        color: #626267;
    }

    .panel_box {
        width: 80%;
        font-size: 0;
    }

    .panel_item {
        position: relative;
        display: inline-block;
        vertical-align: middle;
        font-size: 18px;
        width: 24%;
        background-color: #f6f6f6;
    }

    .panel_item + .panel_item {
        margin-left: 1%;
    }

    .panel_top {
        margin-left: 8%;
    }

    .panel_add_title {
        font-size: 12px;
        margin-top: 10px;
    }

    .panel_add_title span + span {
        margin-left: 5px;
    }

    .panel_all_title {
        font-size: 12px;
        color: #585fba;
    }

    .panel_all_title span + span {
        margin-left: 5px;
    }

    .panel_all_title span:last-child {
        margin-left: 10px;
    }

    .panel_count {
        font-size: 24px;
        color: #e98850;
        margin-top: 10px;
    }

    .panel_bottom {
        display: flex;
        align-items: center;
        height: 30px;
        width: 100%;
        background-color: #dbdbdb;
        font-size: 12px;
        margin-top: 8%;
        padding-left: 8%;
        color: #568142;
    }

    .panel_bottom > span + span {
        margin-left: 5px;
    }

    .panel_bottom > span:last-child {
        margin-left: 10px;
    }

    .red_per {
        position: relative;
        color: red;
    }

    .red_shape {
        position: absolute;
        top: 2px;
        left: 6px;
        background-color: red;
        width: 2px;
        height: 4px;
    }

    .el-icon-caret-bottom {
        position: relative;
        font-size: 15px;
        top: 2px;
    }

    .green_shape {
        position: absolute;
        bottom: 2px;
        left: 7px;
        background-color: #568142;
        width: 2px;
        height: 4px;
    }

    .el-icon-caret-top {
        position: relative;
        font-size: 15px;
        top: -2px;
    }

    .tab_box {
        padding-top: 0;
    }

    .tab_item {
        padding: 0 35px;
    }

    .charts_line {
        display: inline-block;
        vertical-align: middle;
        width: 49%;
    }

    .charts_pie {
        font-size: 0;
        border: 2px solid #eaeaea;
        border-top: 2px solid #bdbdbd;
        width: 80%;
    }
</style>
