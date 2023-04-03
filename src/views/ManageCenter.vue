<template>
    <el-container direction="vertical">
        <!-- 主体内容  -->
        <div class="main">
            <div class="header">
                <span>{{$t("system.welcome")}}，{{roleInfo.name}}--{{userInfo.name}}</span><span class="header__time">{{$utils.dateFormat(new Date().getTime(), 'YYYY-MM-dd')}} {{$utils.weekDate(new Date().getTime())}} {{nowData}}</span>
            </div>
            <!--面板-->
            <el-row :gutter="40" class="panel-group">
                <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
                    <div class="card-panel" @click="handleSetLineChartData('newVisitis')">
                        <div class="card-panel-icon-wrapper icon-people">
                            <i class="sx-icon-mall card-panel-icon"/>
                        </div>
                        <div class="card-panel-description">
                            <div class="card-panel-text">
                                总收入
                            </div>
                            <count-to :start-val="0" :end-val="102400" :duration="2600" class="card-panel-num"/>
                        </div>
                    </div>
                </el-col>
                <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
                    <div class="card-panel" @click="handleSetLineChartData('messages')">
                        <div class="card-panel-icon-wrapper icon-message">
                            <i class="sx-icon-mall card-panel-icon"/>
                        </div>
                        <div class="card-panel-description">
                            <div class="card-panel-text">
                                总销量
                            </div>
                            <count-to :start-val="0" :end-val="81212" :duration="3000" class="card-panel-num"/>
                        </div>
                    </div>
                </el-col>
                <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
                    <div class="card-panel" @click="handleSetLineChartData('purchases')">
                        <div class="card-panel-icon-wrapper icon-money">
                            <i class="sx-icon-mall card-panel-icon"/>
                        </div>
                        <div class="card-panel-description">
                            <div class="card-panel-text">
                              库存告警
                            </div>
                            <count-to :start-val="0" :end-val="9280" :duration="3200" class="card-panel-num"/>
                        </div>
                    </div>
                </el-col>
                <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
                    <div class="card-panel" @click="handleSetLineChartData('shoppings')">
                        <div class="card-panel-icon-wrapper icon-shopping">
                            <i class="sx-icon-mall card-panel-icon"/>
                        </div>
                        <div class="card-panel-description">
                            <div class="card-panel-text">
                              总订单数
                            </div>
                            <count-to :start-val="0" :end-val="13600" :duration="3600" class="card-panel-num"/>
                        </div>
                    </div>
                </el-col>
            </el-row>
          <el-row :gutter="40" class="panel-group">
            <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
              <div class="card-panel" @click="handleSetLineChartData('shoppings')">
                <div class="card-panel-icon-wrapper icon-shopping">
                  <i class="sx-icon-mall card-panel-icon"/>
                </div>
                <div class="card-panel-description">
                  <div class="card-panel-text">
                    入住商户数
                  </div>
                  <count-to :start-val="0" :end-val="13600" :duration="3600" class="card-panel-num"/>
                </div>
              </div>
            </el-col>
            <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
              <div class="card-panel" @click="handleSetLineChartData('newVisitis')">
                <div class="card-panel-icon-wrapper icon-people">
                  <i class="sx-icon-mall card-panel-icon"/>
                </div>
                <div class="card-panel-description">
                  <div class="card-panel-text">
                    目前待处理订单数
                  </div>
                  <count-to :start-val="0" :end-val="102400" :duration="2600" class="card-panel-num"/>
                </div>
              </div>
            </el-col>
            <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
              <div class="card-panel" @click="handleSetLineChartData('messages')">
                <div class="card-panel-icon-wrapper icon-message">
                  <i class="sx-icon-mall card-panel-icon"/>
                </div>
                <div class="card-panel-description">
                  <div class="card-panel-text">
                    新增会员数
                  </div>
                  <count-to :start-val="0" :end-val="81212" :duration="3000" class="card-panel-num"/>
                </div>
              </div>
            </el-col>
            <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
              <div class="card-panel" @click="handleSetLineChartData('purchases')">
                <div class="card-panel-icon-wrapper icon-money">
                  <i class="sx-icon-mall card-panel-icon"/>
                </div>
                <div class="card-panel-description">
                  <div class="card-panel-text">
                    新增分销员数
                  </div>
                  <count-to :start-val="0" :end-val="9280" :duration="3200" class="card-panel-num"/>
                </div>
              </div>
            </el-col>
          </el-row>
            <!--折线图-->
            <line-chart :chart-data="chartData"></line-chart>
            <!--其他图-->
            <el-row :gutter="32">
                <el-col :xs="24" :sm="24" :lg="8">
                    <div class="chart-wrapper">
                        <raddar-chart></raddar-chart>
                    </div>
                </el-col>
                <el-col :xs="24" :sm="24" :lg="8">
                    <div class="chart-wrapper">
                        <pie-chart></pie-chart>
                    </div>
                </el-col>
                <el-col :xs="24" :sm="24" :lg="8">
                    <div class="chart-wrapper">
                        <bar-char></bar-char>
                    </div>
                </el-col>
            </el-row>
            <tiny-mce-editor></tiny-mce-editor>
        </div>
    </el-container>
</template>

<script>
    import {mapState} from 'vuex'

    require('echarts/theme/macarons');
    import resize from '../components/mixins/resize'

    const lineChartData = {
        newVisitis: {
            expectedData: [100, 120, 161, 134, 105, 160, 165],
            actualData: [120, 82, 91, 154, 162, 140, 145],
            labelData:  ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        messages: {
            expectedData: [200, 192, 120, 144, 160, 130, 140],
            actualData: [180, 160, 151, 106, 145, 150, 130],
            labelData:  ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        purchases: {
            expectedData: [80, 100, 121, 104, 105, 90, 100],
            actualData: [120, 90, 100, 138, 142, 130, 130],
            labelData:  ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        shoppings: {
            expectedData: [130, 140, 141, 142, 145, 150, 160],
            actualData: [120, 82, 91, 154, 162, 140, 130],
            labelData:  ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        }
    };


    export default {
        mixins: [resize],
        data() {
            return {
                chartData: lineChartData.newVisitis,
                nowData: this.$utils.dateFormat(new Date().getTime(), 'hh:mm:ss')
            }
        },
        computed: {
            ...mapState([
                'userInfo',
                'roleInfo'
            ]),
        },
        methods: {
            handleSetLineChartData(type) {
                this.chartData = lineChartData[type];
            },
        },
        created() {
            setInterval(() => {
                this.nowData = this.$utils.dateFormat(new Date().getTime(), 'hh:mm:ss')
            }, 1000)
        }
    }
</script>


<style lang="scss" scoped>
    .header {
        line-height: 50px;
        color: #626262;
        font-size: 20px;
        font-weight: bold;
        border-bottom: 2px solid #ededed;

        .header__time {
            font-size: 14px;
            font-weight: normal;
            margin-left: 20px;
        }
    }

    .panel-group {
        margin-top: 18px;

        .card-panel-col {
            margin-bottom: 32px;
        }

        .card-panel {
            cursor: pointer;
            font-size: 12px;
            position: relative;
            overflow: hidden;
            color: #666;
            background: #fff;
            height: 108px;
            border-radius: 8px;
            text-align: center;
            box-shadow: 0 0 5px slategray;

            &:hover {
                .card-panel-icon-wrapper {
                    color: #fff;
                }

                .icon-people {
                    background: #40c9c6;
                }

                .icon-message {
                    background: #36a3f7;
                }

                .icon-money {
                    background: #f4516c;
                }

                .icon-shopping {
                    background: #34bfa3
                }
            }

            .icon-people {
                color: #40c9c6;
            }

            .icon-message {
                color: #36a3f7;
            }

            .icon-money {
                color: #f4516c;
            }

            .icon-shopping {
                color: #34bfa3
            }

            .card-panel-icon-wrapper {
                float: left;
                margin: 14px 0 0 14px;
                padding: 16px;
                transition: all 0.38s ease-out;
                border-radius: 6px;
            }

            .card-panel-icon {
                float: left;
                font-size: 48px;
            }

            .card-panel-description {
                float: right;
                font-weight: bold;
                margin: 26px;
                margin-left: 0px;

                .card-panel-text {
                    line-height: 18px;
                    color: rgba(0, 0, 0, 0.45);
                    font-size: 16px;
                    margin-bottom: 12px;
                }

                .card-panel-num {
                    font-size: 20px;
                }
            }
        }
    }

    .chart-wrapper {
        background: #fff;
        padding: 16px 16px 0;
        margin-bottom: 32px;
    }

    @media (max-width: 1024px) {
        .chart-wrapper {
            padding: 8px;
        }
    }

</style>
