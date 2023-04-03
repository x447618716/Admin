<template>
    <div class="main">
        <div class="page_head">
            <span class="title">阅读数据统计</span>
            <div style="margin-left: 30px;">
                <el-radio-group v-model="raddDataType" size="mini" fill="#4eac8f">
                    <el-radio-button label="1">按月</el-radio-button>
                    <el-radio-button label="2">按季度</el-radio-button>
                    <el-radio-button label="3">按年</el-radio-button>
                </el-radio-group>
            </div>
        </div>
        <div class="panel_box">
            <div class="panel_item">
                <div class="panel_top">
                    <p class="panel_add_title"><span style="color: red;">参与阅读</span><span>用户数</span></p>
                    <p class="panel_count">2,348</p>
                </div>
                <div class="panel_bottom">
                    <span>对比上月</span>
                    <span>3,452</span>
                    <span class="red_per"><i class="el-icon-caret-bottom"><span class="red_shape"></span></i>13%</span>
                </div>
            </div>
            <div class="panel_item">
                <div class="panel_top">
                    <p class="panel_add_title"><span style="color: red;">人均</span><span>阅读量</span></p>
                    <p class="panel_count">2,348<span style="font-size: 12px;margin-left: 8px;color: #504cb0;">千字</span>
                    </p>
                </div>
                <div class="panel_bottom">
                    <span>对比上月</span>
                    <span>3,452千字</span>
                    <span class="red_per"><i class="el-icon-caret-bottom"><span class="red_shape"></span></i>13%</span>
                </div>
            </div>
            <div class="panel_item">
                <div class="panel_top">
                    <p class="panel_add_title"><span style="color: red;">人均</span><span>阅读质量</span></p>
                    <p class="panel_count">89<span style="font-size: 12px;margin-left: 8px;color: #504cb0;">分</span></p>
                </div>
                <div class="panel_bottom">
                    <span>对比上月</span>
                    <span>87分</span>
                    <span><i class="el-icon-caret-top"><span class="green_shape"></span></i>13%</span>
                </div>
            </div>
        </div>

        <div class="charts_box" v-for="(data,index) in readCountDataList" :key="index">
            <div class="page_head">
                <span class="title">{{data.label}}</span>
                <div style="margin-left: 30px;">
                    <el-radio-group v-model="data.model" size="mini" fill="#4eac8f">
                        <el-radio-button label="1">按周</el-radio-button>
                        <el-radio-button label="2">按月</el-radio-button>
                        <el-radio-button label="3">按年</el-radio-button>
                    </el-radio-group>
                </div>
            </div>
            <div :id="data.chartsId" style="height: 50vh;border: 1px solid #dddddd;"></div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                raddDataType: '1',
                readCountDataList: [
                    {
                        label: '人均阅读量（千字）统计', chartsId: 'charts_readStatistics', model: '1',
                        serie: {type: 'bar', barWidth: '25%'},
                        legendData: [],
                        xAxisData: ['一年级', '二年级', '三年级', '四年级', '五年级', '六年级'],
                        serieData: [
                            {
                                name: '人均阅读量（千字）统计',
                                color: '#e99121',
                                data: ['2600', '3800', '2900', '5000', '3300', '2000']
                            }
                        ]
                    },
                    {
                        label: '人均阅读量（千字）提升情况', chartsId: 'charts_readPromote', model: '1',
                        serie: {type: 'line'},
                        legendData: [],
                        xAxisData: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月'],
                        serieData: [
                            {
                                name: '',
                                color: '#3d7ce7',
                                data: ['2900', '2100', '3200', '2700', '3900', '3100', '4800', '3300']
                            }
                        ]
                    },
                    {
                        label: '阅读质量分析', chartsId: 'charts_readQuality', model: '1',
                        serie: {type: 'pie'},
                        legendData: ['优+  95分以上（包含95分）', '优   91-95分', '优-  86-90分',
                            '良+  81-85分', '良   76-80分', '良-  66-75分', '合格 60-65分', '不合格 59分以下（包含59分）'],
                        serieData: [
                            {name: '优+  95分以上（包含95分）', color: '', value: 20},
                            {name: '优   91-95分', color: '', value: 20},
                            {name: '优-  86-90分', color: '', value: 20},
                            {name: '良+  81-85分', color: '', value: 20},
                            {name: '良   76-80分', color: '', value: 20},
                            {name: '良-  66-75分', color: '', value: 20},
                            {name: '合格 60-65分', color: '', value: 20},
                            {name: '不合格 59分以下（包含59分）', color: '', value: 20},
                        ]
                    },
                    {
                        label: '阅读能力分析', chartsId: 'charts_readAbility', model: '1',
                        serie: {type: 'bar', barGap: 0},
                        legendData: ['一学段', '二学段', '三学段'],
                        yAxis: {max: '100', axisLabel: {formatter: '{value}%'}},
                        xAxisData: ['检索', '理解', '运用', '评鉴', '质疑与创新'],
                        serieData: [
                            {
                                name: '一学段',
                                color: '#e99122',
                                data: ['40', '55', '60', '60', '40']
                            },
                            {
                                name: '二学段',
                                color: '#3f9215',
                                data: ['60', '78', '90', '88', '60']
                            },
                            {
                                name: '三学段',
                                color: '#d93035',
                                data: ['50', '62', '71', '70', '50']
                            },
                        ]
                    },
                    {
                        label: '阅读兴趣分析', chartsId: 'charts_readInterest', model: '1',
                        serie: {type: 'pie'},
                        legendData: ['文学', '图画书', '国学', '故事', '百科'],
                        serieData: [
                            {name: '文学', color: '', value: 20},
                            {name: '图画书', color: '', value: 20},
                            {name: '国学', color: '', value: 20},
                            {name: '故事', color: '', value: 20},
                            {name: '百科', color: '', value: 20},
                        ]
                    },
                    {
                        label: '学生参与情况', chartsId: 'charts_student', model: '1',
                        serie: {type: 'bar', barWidth: '25%'},
                        legendData: [],
                        xAxisData: ['一年级', '二年级', '三年级', '四年级', '五年级', '六年级'],
                        serieData: [
                            {
                                name: '一学段',
                                color: '#e99122',
                                data: ['2600', '3800', '2900', '5000', '3300', '2000']
                            },
                        ]
                    },
                ],
                isLoading: false,
            }
        },
        components: {},
        methods: {
            initReadCountCharts() {
                this.readCountDataList.forEach(obj => {
                    let chartObj = this.$echarts.init(document.getElementById(obj.chartsId));
                    let chartOption = {};
                    if (obj.serie.type == 'pie') {
                        chartOption = {
                            legend: {
                                type: 'scroll',
                                bottom: '5%',
                                data: [],
                            },
                            grid: {}
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
                        obj.serieData.forEach(o => {
                            series.data.push({
                                name: o.name + ' ' + o.value + '%',
                                itemStyle: {color: o.color},
                                value: o.value
                            });
                            chartOption.legend.data.push({
                                name: o.name + ' ' + o.value + '%',
                                icon: 'roundRect'
                            });
                        })
                        chartOption.series = series;
                    } else {
                        chartOption = {
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
                            legend: {data: [], x: 'center', top: 10},
                            xAxis: {type: 'category', axisTick: false, data: []},
                            yAxis: {type: 'value', axisTick: false, splitLine: {show: false}},
                            series: []
                        }
                        Object.assign(chartOption.yAxis, obj.yAxis);
                        chartOption.xAxis.data = obj.xAxisData;
                        obj.serieData.forEach(o => {
                            let serie = {
                                name: o.name, tooltip: {trigger: "axis"}, lineStyle: {color: o.color},
                                itemStyle: {color: o.color}, symbol: 'circle', symbolSize: 8, yAxisIndex: 0, data: []
                            }
                            Object.assign(serie, obj.serie);
                            o.data.forEach(data => {
                                serie.data.push(data);
                            })
                            chartOption.series.push(serie);
                        })
                    }
                    if (obj.legendData.length > 0) {
                        obj.legendData.forEach(name => {
                            chartOption.legend.data.push({name: name, icon: 'roundRect'})
                        })
                    }
                    chartObj.setOption(chartOption);
                })
            },
        },
        created() {
            setTimeout(() => {
                this.$nextTick(function () {
                    this.initReadCountCharts()
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
        margin-top: 10%;
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

    .charts_box {
        display: inline-block;
        vertical-align: middle;
        width: 49%;
        font-size: 0;
        box-sizing: border-box;
    }

    .charts_box + .charts_box {
        margin-left: 1%
    }
</style>
