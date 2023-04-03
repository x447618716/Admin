<template>
    <div :class="className" :style="{height:height,width:width}"/>
</template>

<script>

    import resize from '../../mixins/resize'
    require('echarts/theme/macarons');

    export default {
        name: "LineChart",
        mixins: [resize],
        props: {
            className: {
                type: String,
                default: 'chart'
            },
            width: {
                type: String,
                default: '100%'
            },
            height: {
                type: String,
                default: '350px'
            },
            autoResize: {
                type: Boolean,
                default: true
            },
            chartData: {
                type: Object,
                required: true
            }
        },
        data() {
            return {
                chart: null
            }
        },
        watch: {
            chartData: {
                deep: true,
                handler(val) {
                    if (Object.keys(val).length) {
                        this.setOptions(val)
                    }
                }
            }
        },
        mounted() {
            this.initChart();
            if (Object.keys(this.chartData).length) {
                this.setOptions(this.chartData)
            }
        },
        beforeDestroy() {
            if (!this.chart) {
                return
            }
            this.chart.dispose()
            this.chart = null
        },
        methods: {
            //初始化
            initChart() {
                this.chart = this.$echarts.init(this.$el, 'macarons')
            },
            //设置数据
            setOptions({expectedData, actualData, labelData} = {}) {
                this.chart.setOption({
                    xAxis: {
                        data: labelData,
                        boundaryGap: false,
                        axisTick: {
                            show: false
                        }
                    },
                    grid: {
                        left: 10,
                        right: 10,
                        bottom: 20,
                        top: 30,
                        containLabel: true
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'cross'
                        },
                        padding: [5, 10]
                    },
                    yAxis: {
                        axisTick: {
                            show: false
                        }
                    },
                    legend: {
                        data: ['expected', 'actual']
                    },
                    series: [{
                        name: 'expected', itemStyle: {
                            normal: {
                                color: '#FF005A',
                                lineStyle: {
                                    color: '#FF005A',
                                    width: 2
                                }
                            }
                        },
                        smooth: true,
                        type: 'line',
                        data: expectedData,
                        animationDuration: 2800,
                        animationEasing: 'cubicInOut'
                    },
                        {
                            name: 'actual',
                            smooth: true,
                            type: 'line',
                            itemStyle: {
                                normal: {
                                    color: '#3888fa',
                                    lineStyle: {
                                        color: '#3888fa',
                                        width: 2
                                    },
                                    areaStyle: {
                                        color: '#f3f8ff'
                                    }
                                }
                            },
                            data: actualData,
                            animationDuration: 2800,
                            animationEasing: 'quadraticOut'
                        }]
                })
            }
        }
    }
</script>

<style scoped lang="less" type="text/less">

</style>
