<template>
    <div class="main">
        <div class="page_head">
            <span class="title">活动发布情况</span>
            <div style="margin-left: 30px;">
                <el-radio-group v-model="activePublishType" size="mini" fill="#4eac8f">
                    <el-radio-button label="1">当日</el-radio-button>
                    <el-radio-button label="2">本月</el-radio-button>
                    <el-radio-button label="3">季度</el-radio-button>
                    <el-radio-button label="4">年度</el-radio-button>
                </el-radio-group>
            </div>
        </div>
        <div class="panel_box">
            <div class="panel_item">
                <div class="panel_top">
                    <p class="panel_add_title"><span style="color: red;">新增评测</span><span>活动数</span></p>
                    <p class="panel_count">2,348</p>
                    <p class="panel_all_title"><span>评测</span><span>参与</span><span>234,524</span><span>人次</span></p>
                </div>
                <div class="panel_bottom">
                    <span>对比上月</span>
                    <span>3,452</span>
                    <span class="red_per"><i class="el-icon-caret-bottom"><span class="red_shape"></span></i>13%</span>
                </div>
            </div>
            <div class="panel_item">
                <div class="panel_top">
                    <p class="panel_add_title"><span style="color: red;">新增考试</span><span>活动数</span></p>
                    <p class="panel_count">2,348</p>
                    <p class="panel_all_title"><span>考试</span><span>参与</span><span>234,524</span><span>人次</span></p>
                </div>
                <div class="panel_bottom">
                    <span>对比上月</span>
                    <span>3,452</span>
                    <span class="red_per"><i class="el-icon-caret-bottom"><span class="red_shape"></span></i>13%</span>
                </div>
            </div>
            <div class="panel_item">
                <div class="panel_top">
                    <p class="panel_add_title"><span style="color: red;">新增比赛</span><span>活动数</span></p>
                    <p class="panel_count">4,348</p>
                    <p class="panel_all_title"><span>比赛</span><span>参与</span><span>234,524</span><span>人次</span></p>
                </div>
                <div class="panel_bottom">
                    <span>对比上月</span>
                    <span>3,452</span>
                    <span><i class="el-icon-caret-top"><span class="green_shape"></span></i>13%</span>
                </div>
            </div>
            <div class="panel_item">
                <div class="panel_top">
                    <p class="panel_add_title"><span style="color: red;">新增文曲星活动</span><span>活动数</span></p>
                    <p class="panel_count">4,348</p>
                    <p class="panel_all_title"><span>文曲星活动</span><span>参与</span><span>234,524</span><span>人次</span></p>
                </div>
                <div class="panel_bottom">
                    <span>对比上月</span>
                    <span>3,452</span>
                    <span><i class="el-icon-caret-top"><span class="green_shape"></span></i>13%</span>
                </div>
            </div>
        </div>

        <div class="charts_line" v-for="(data,index) in lineDataList" :key="index">
            <div class="page_head">
                <span class="title">{{data.label}}</span>
                <div style="margin-left: 30px;">
                    <el-radio-group v-if="index == 0" v-model="activePublishAddDataType" size="mini" fill="#4eac8f">
                        <el-radio-button label="1">按月</el-radio-button>
                        <el-radio-button label="2">按季度</el-radio-button>
                        <el-radio-button label="3">按年</el-radio-button>
                    </el-radio-group>
                    <el-radio-group v-else v-model="activePartakeAddDataType" size="mini" fill="#4eac8f">
                        <el-radio-button label="1">按月</el-radio-button>
                        <el-radio-button label="2">按季度</el-radio-button>
                        <el-radio-button label="3">按年</el-radio-button>
                    </el-radio-group>
                </div>
            </div>
            <div :id="data.chartsId" style="height: 50vh;"></div>
        </div>

        <div class="page_head">
            <span class="title">活动参与数据分析</span>
            <div style="margin-left: 30px;">
                <el-radio-group v-model="activePartakeType" size="mini" fill="#4eac8f">
                    <el-radio-button label="1">按月</el-radio-button>
                    <el-radio-button label="2">按季度</el-radio-button>
                    <el-radio-button label="3">按年</el-radio-button>
                </el-radio-group>
            </div>
        </div>

        <div class="charts_pie">
            <div v-for="id in Object.keys(this.pieDataObj)" :key="id" :id="id"
                 style="display: inline-block;height: 25vh;width: 50%"></div>
        </div>

        <el-row :gutter="20">
            <el-col :span="12">
                <div class="page_head">
                    <span class="title">活动发布TOP20</span>
                    <div style="margin-left: 30px;">
                        <el-radio-group v-model="activePublishTableType" size="mini" fill="#4eac8f">
                            <el-radio-button label="1">按活动种类</el-radio-button>
                            <el-radio-button label="2">按年级</el-radio-button>
                        </el-radio-group>
                    </div>
                </div>
                <el-table v-show="activePublishTableType == 1" v-loading="isLoading" :data="tableData" border
                          style="margin-bottom: 20px;">
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
                    <el-table-column align="center" prop="evaluating" label="评测"></el-table-column>
                    <el-table-column align="center" prop="examination" label="考试"></el-table-column>
                    <el-table-column align="center" prop="match" label="比赛"></el-table-column>
                    <el-table-column align="center" prop="wqx" label="文曲星"></el-table-column>
                </el-table>
                <el-table v-show="activePublishTableType == 2" v-loading="isLoading" :data="tableData" border
                          style="margin-bottom: 20px;">
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
                    <el-table-column v-show="activePublishTableType == 2" align="center" prop="grade1"
                                     label="一年级"></el-table-column>
                    <el-table-column v-show="activePublishTableType == 2" align="center" prop="grade2"
                                     label="二年级"></el-table-column>
                    <el-table-column v-show="activePublishTableType == 2" align="center" prop="grade3"
                                     label="三年级"></el-table-column>
                    <el-table-column v-show="activePublishTableType == 2" align="center" prop="grade4"
                                     label="四年级"></el-table-column>
                    <el-table-column v-show="activePublishTableType == 2" align="center" prop="grade5"
                                     label="五年级"></el-table-column>
                    <el-table-column v-show="activePublishTableType == 2" align="center" prop="grade6"
                                     label="六年级"></el-table-column>
                </el-table>
            </el-col>
            <el-col :span="12">
                <div class="page_head">
                    <span class="title">活动参与TOP20</span>
                </div>
                <el-table v-show="activePublishTableType == 1" v-loading="isLoading" :data="tableData" border
                          style="margin-bottom: 20px;">
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
                    <el-table-column align="center" prop="evaluating" label="评测"></el-table-column>
                    <el-table-column align="center" prop="examination" label="考试"></el-table-column>
                    <el-table-column align="center" prop="match" label="比赛"></el-table-column>
                    <el-table-column align="center" prop="wqx" label="文曲星"></el-table-column>
                </el-table>
                <el-table v-show="activePublishTableType == 2" v-loading="isLoading" :data="tableData" border
                          style="margin-bottom: 20px;">
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
                    <el-table-column v-show="activePublishTableType == 2" align="center" prop="grade1"
                                     label="一年级"></el-table-column>
                    <el-table-column v-show="activePublishTableType == 2" align="center" prop="grade2"
                                     label="二年级"></el-table-column>
                    <el-table-column v-show="activePublishTableType == 2" align="center" prop="grade3"
                                     label="三年级"></el-table-column>
                    <el-table-column v-show="activePublishTableType == 2" align="center" prop="grade4"
                                     label="四年级"></el-table-column>
                    <el-table-column v-show="activePublishTableType == 2" align="center" prop="grade5"
                                     label="五年级"></el-table-column>
                    <el-table-column v-show="activePublishTableType == 2" align="center" prop="grade6"
                                     label="六年级"></el-table-column>
                </el-table>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                activePublishType: '2',
                activePublishAddDataType: '1',
                activePartakeAddDataType: '1',
                activePartakeType: '1',
                activePublishTableType: '1',
                lineDataList: [
                    {
                        label: '活动发布数增长曲线图', chartsId: 'charts_line_publish',
                        listData: [
                            {
                                evaluating: {color: '#222229', value: '2100'},
                                examination: {color: '#d93034', value: '1200'},
                                match: {color: '#4776e6', value: '2700'},
                                wqx: {color: '#e99223', value: '1500'},
                                time: '1月'
                            },
                            {
                                evaluating: {color: '#222229', value: '1100'},
                                examination: {color: '#d93034', value: '3300'},
                                match: {color: '#4776e6', value: '2000'},
                                wqx: {color: '#e99223', value: '1500'},
                                time: '2月'
                            },
                            {
                                evaluating: {color: '#222229', value: '1800'},
                                examination: {color: '#d93034', value: '3100'},
                                match: {color: '#4776e6', value: '2800'},
                                wqx: {color: '#e99223', value: '1500'},
                                time: '3月'
                            },
                            {
                                evaluating: {color: '#222229', value: '1400'},
                                examination: {color: '#d93034', value: '4100'},
                                match: {color: '#4776e6', value: '2400'},
                                wqx: {color: '#e99223', value: '1500'},
                                time: '4月'
                            },
                            {
                                evaluating: {color: '#222229', value: '2600'},
                                examination: {color: '#d93034', value: '4500'},
                                match: {color: '#4776e6', value: '3800'},
                                wqx: {color: '#e99223', value: '1500'},
                                time: '5月'
                            },
                            {
                                evaluating: {color: '#222229', value: '2200'},
                                examination: {color: '#d93034', value: '3400'},
                                match: {color: '#4776e6', value: '2800'},
                                wqx: {color: '#e99223', value: '1500'},
                                time: '6月'
                            },
                            {
                                evaluating: {color: '#222229', value: '2800'},
                                examination: {color: '#d93034', value: '3000'},
                                match: {color: '#4776e6', value: '4000'},
                                wqx: {color: '#e99223', value: '1500'},
                                time: '7月'
                            },
                            {
                                evaluating: {color: '#222229', value: '2700'},
                                examination: {color: '#d93034', value: '3800'},
                                match: {color: '#4776e6', value: '3000'},
                                wqx: {color: '#e99223', value: '1500'},
                                time: '8月'
                            },
                        ]
                    },
                    {
                        label: '活动参与数增长曲线图', chartsId: 'charts_line_partake',
                        listData: [
                            {
                                evaluating: {color: '#222229', value: '2100'},
                                examination: {color: '#d93034', value: '1200'},
                                match: {color: '#4776e6', value: '2700'},
                                wqx: {color: '#e99223', value: '1500'},
                                time: '1月'
                            },
                            {
                                evaluating: {color: '#222229', value: '1100'},
                                examination: {color: '#d93034', value: '3300'},
                                match: {color: '#4776e6', value: '2000'},
                                wqx: {color: '#e99223', value: '1500'},
                                time: '2月'
                            },
                            {
                                evaluating: {color: '#222229', value: '1800'},
                                examination: {color: '#d93034', value: '3100'},
                                match: {color: '#4776e6', value: '2800'},
                                wqx: {color: '#e99223', value: '1500'},
                                time: '3月'
                            },
                            {
                                evaluating: {color: '#222229', value: '1400'},
                                examination: {color: '#d93034', value: '4100'},
                                match: {color: '#4776e6', value: '2400'},
                                wqx: {color: '#e99223', value: '1500'},
                                time: '4月'
                            },
                            {
                                evaluating: {color: '#222229', value: '2600'},
                                examination: {color: '#d93034', value: '4500'},
                                match: {color: '#4776e6', value: '3800'},
                                wqx: {color: '#e99223', value: '1500'},
                                time: '5月'
                            },
                            {
                                evaluating: {color: '#222229', value: '2200'},
                                examination: {color: '#d93034', value: '3400'},
                                match: {color: '#4776e6', value: '2800'},
                                wqx: {color: '#e99223', value: '1500'},
                                time: '6月'
                            },
                            {
                                evaluating: {color: '#222229', value: '2800'},
                                examination: {color: '#d93034', value: '3000'},
                                match: {color: '#4776e6', value: '4000'},
                                wqx: {color: '#e99223', value: '1500'},
                                time: '7月'
                            },
                            {
                                evaluating: {color: '#222229', value: '2700'},
                                examination: {color: '#d93034', value: '3800'},
                                match: {color: '#4776e6', value: '3000'},
                                wqx: {color: '#e99223', value: '1500'},
                                time: '8月'
                            },
                        ]
                    },
                ],
                pieDataObj: {
                    activePublishDataAnalysis: {
                        evaluating: {color: '#70d0cf', value: 38},
                        examination: {color: '#cf3f4f', value: 34},
                        match: {color: '#e99223', value: 28},
                        wqx: {color: '#2a4a80', value: 28}
                    },
                    publishActiveArea: {
                        fj: {color: '#70d0cf', value: 38},
                        zj: {color: '#cf3f4f', value: 34},
                        jx: {color: '#e99223', value: 28},
                        hn: {color: '#2a4a80', value: 12},
                    },
                    partakeDataAnalysis: {
                        1: {color: '#70d0cf', value: 38},
                        2: {color: '#cf3f4f', value: 34},
                        3: {color: '#e99223', value: 28},
                        4: {color: '#2a4a80', value: 12},
                        5: {color: 'yellow', value: 38},
                        6: {color: 'green', value: 34},
                    },
                    partakeDataArea: {
                        fj: {color: '#70d0cf', value: 38},
                        zj: {color: '#cf3f4f', value: 34},
                        jx: {color: '#e99223', value: 28},
                        hn: {color: '#2a4a80', value: 12},
                    }
                },
                pageLabel: {
                    activePublishDataAnalysis: '活动发布\n数据分析',
                    evaluating: '评测',
                    examination: '考试',
                    match: '比赛',
                    wqx: '文曲星',
                    publishActiveArea: '发布活跃\n省份地区',
                    fj: '福建省',
                    zj: '浙江省',
                    jx: '江西省',
                    hn: '海南省',
                    partakeDataAnalysis: '参与数据分析',
                    1: '一年级',
                    2: '二年级',
                    3: '三年级',
                    4: '四年级',
                    5: '五年级',
                    6: '六年级',
                    partakeDataArea: '参与数据\n省份地区',
                },
                tableData: [
                    {
                        id: 1,
                        schoolName: '福建师范小学',
                        province: '福建省',
                        city: '龙岩市',
                        area: '新罗区',
                        countNum: '243',
                        evaluating: '243',
                        examination: '2435',
                        match: '1232',
                        wqx: '1232',
                        grade1: 2435,
                        grade2: 1232,
                        grade3: 1232,
                        grade4: 1232,
                        grade5: 1232,
                        grade6: 1232
                    },
                    {
                        id: 1,
                        schoolName: '福建师范小学',
                        province: '福建省',
                        city: '龙岩市',
                        area: '新罗区',
                        countNum: '243',
                        evaluating: '243',
                        examination: '2435',
                        match: '1232',
                        wqx: '1232',
                        grade1: 2435,
                        grade2: 1232,
                        grade3: 1232,
                        grade4: 1232,
                        grade5: 1232,
                        grade6: 1232
                    },
                    {
                        id: 1,
                        schoolName: '福建师范小学',
                        province: '福建省',
                        city: '龙岩市',
                        area: '新罗区',
                        countNum: '243',
                        evaluating: '243',
                        examination: '2435',
                        match: '1232',
                        wqx: '1232',
                        grade1: 2435,
                        grade2: 1232,
                        grade3: 1232,
                        grade4: 1232,
                        grade5: 1232,
                        grade6: 1232
                    },
                    {
                        id: 1,
                        schoolName: '福建师范小学',
                        province: '福建省',
                        city: '龙岩市',
                        area: '新罗区',
                        countNum: '243',
                        evaluating: '243',
                        examination: '2435',
                        match: '1232',
                        wqx: '1232',
                        grade1: 2435,
                        grade2: 1232,
                        grade3: 1232,
                        grade4: 1232,
                        grade5: 1232,
                        grade6: 1232
                    },
                    {
                        id: 1,
                        schoolName: '福建师范小学',
                        province: '福建省',
                        city: '龙岩市',
                        area: '新罗区',
                        countNum: '243',
                        evaluating: '243',
                        examination: '2435',
                        match: '1232',
                        wqx: '1232',
                        grade1: 2435,
                        grade2: 1232,
                        grade3: 1232,
                        grade4: 1232,
                        grade5: 1232,
                        grade6: 1232
                    },
                ],
                isLoading: false,
            }
        },
        components: {},
        methods: {
            initLineCharts() {
                this.lineDataList.forEach(obj => {
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
                    let chartObj = this.$echarts.init(document.getElementById(obj.chartsId));
                    Object.keys(obj.listData[0]).forEach(key => {
                        if (key !== 'time') {
                            chartOption.legend.data.push({name: this.pageLabel[key], icon: 'roundRect'})
                            let serie = {
                                name: this.pageLabel[key],
                                tooltip: {trigger: "axis"},
                                lineStyle: {color: obj.listData[0][key].color},
                                itemStyle: {color: obj.listData[0][key].color},
                                symbol: 'circle',
                                symbolSize: 8,
                                yAxisIndex: 0,
                                data: [],
                                type: 'line'
                            }
                            obj.listData.forEach(o => {
                                serie.data.push(o[key].value);
                            })
                            chartOption.series.push(serie);
                        } else {
                            obj.listData.forEach(o => {
                                chartOption.xAxis.data.push(o.time);
                            })
                        }
                    });
                    chartObj.setOption(chartOption);
                })
            },
            createPieCharts() {
                Object.keys(this.pieDataObj).forEach(obj => {
                    let chartObj = this.$echarts.init(document.getElementById(obj));
                    let chartOption = {
                        legend: {
                            type: 'scroll',
                            orient: 'vertical',
                            top: '20%',
                            right: '10%',
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
                                text: this.pageLabel[obj],
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
                    Object.keys(this.pieDataObj[obj]).forEach(o => {
                        series.data.push({
                            name: this.pageLabel[o] + ' ' + this.pieDataObj[obj][o].value + '%',
                            itemStyle: {color: this.pieDataObj[obj][o].color},
                            value: this.pieDataObj[obj][o].value
                        });
                        chartOption.legend.data.push({
                            name: this.pageLabel[o] + ' ' + this.pieDataObj[obj][o].value + '%',
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
                this.$nextTick(function () {
                    this.initLineCharts()
                    this.createPieCharts()
                })
            }, 100);
        }
    }
</script>

<style scoped>
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
        margin-left: 4px;
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
        font-size: 0
    }

    .charts_line + .charts_line {
        margin-left: 1%
    }

    .charts_pie {
        font-size: 0;
        border: 2px solid #eaeaea;
        border-top: 2px solid #bdbdbd;
        width: 80%;
    }
</style>
