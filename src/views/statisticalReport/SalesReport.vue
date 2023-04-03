<template>
    <div class="main">
        <div class="page_head">
            <span class="title">销售情况</span>
            <div style="margin-left: 30px;">
                <el-radio-group v-model="salesDataType" size="mini" fill="#4eac8f">
                    <el-radio-button label="1">按月</el-radio-button>
                    <el-radio-button label="2">按季度</el-radio-button>
                    <el-radio-button label="3">按年</el-radio-button>
                </el-radio-group>
            </div>
        </div>
        <div class="panel_box">
            <div class="panel_item">
                <div class="panel_top">
                    <p class="panel_add_title"><span style="color: red;">商城</span><span>订单数</span></p>
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
                    <p class="panel_add_title"><span style="color: red;">商城</span><span>销售额</span></p>
                    <p class="panel_count">2,348<span style="font-size: 12px;margin-left: 8px;color: #504cb0;">元</span>
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
                    <p class="panel_add_title"><span style="color: red;">阅读报告</span><span>订单数</span></p>
                    <p class="panel_count">89</p>
                </div>
                <div class="panel_bottom">
                    <span>对比上月</span>
                    <span>87分</span>
                    <span><i class="el-icon-caret-top"><span class="green_shape"></span></i>13%</span>
                </div>
            </div>
            <div class="panel_item">
                <div class="panel_top">
                    <p class="panel_add_title"><span style="color: red;">阅读报告</span><span>销售额</span></p>
                    <p class="panel_count">89<span style="font-size: 12px;margin-left: 8px;color: #504cb0;">元</span></p>
                </div>
                <div class="panel_bottom">
                    <span>对比上月</span>
                    <span>87元</span>
                    <span><i class="el-icon-caret-top"><span class="green_shape"></span></i>13%</span>
                </div>
            </div>
        </div>

        <div class="charts_box" v-for="(data,index) in salesDataList" :key="index">
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
                salesDataType: '1',
                salesDataList: [
                    {
                        label: '阅读报告销售额提升情况', chartsId: 'charts_reportPromote', model: '1',
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
                        label: '商城销售额提升情况', chartsId: 'charts_shopPromote', model: '1',
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
                        label: '商城购买力分析', chartsId: 'charts_shopPower', model: '1',
                        serie: {type: 'pie'},
                        legendData: ['福建省', '浙江省', '江西省', '海南省'],
                        serieData: [
                            {name: '福建省', color: '', value: 20, price: 4352},
                            {name: '浙江省', color: '', value: 20, price: 4352},
                            {name: '江西省', color: '', value: 20, price: 4352},
                            {name: '海南省', color: '', value: 20, price: 4352},
                        ]
                    },
                    {
                        label: '阅读报告购买力分析', chartsId: 'charts_reportPower', model: '1',
                        serie: {type: 'pie'},
                        legendData: ['福建省', '浙江省', '江西省', '海南省'],
                        serieData: [
                            {name: '福建省', color: '', value: 20, price: 4352},
                            {name: '浙江省', color: '', value: 20, price: 4352},
                            {name: '江西省', color: '', value: 20, price: 4352},
                            {name: '海南省', color: '', value: 20, price: 4352},
                        ]
                    },
                ],
                isLoading: false,
            }
        },
        components: {},
        methods: {
            initSalesReportCharts() {
                this.salesDataList.forEach(obj => {
                    let chartObj = this.$echarts.init(document.getElementById(obj.chartsId));
                    let chartOption = {};
                    if (obj.serie.type == 'pie') {
                        chartOption = {
                            legend: {
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
                                name: o.name + ' ' + o.value + '%' + ' ￥' + o.price,
                                itemStyle: {color: o.color},
                                value: o.value
                            });
                            chartOption.legend.data.push({
                                name: o.name + ' ' + o.value + '%' + ' ￥' + o.price,
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
                    this.initSalesReportCharts()
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
