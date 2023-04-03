<template>
    <span>
      <template v-if="day">
          {{ day+' '+$t('components.CountDown.day')+ hr+":"+min+":"+sec}}
      </template>
      <template v-else>
          {{hr+":"+min+":"+sec}}
      </template>
    </span>
</template>
<script>
    /**
     * 倒计时组件
     * @author 谢荣生
     * @version 1.0
     * @datetime 2021/2/22 14:06
     * @inheritDoc
     * */
    export default {
        name: "CountDown",
        data() {
            return {
                timer: null,
                day: null,
                hr: null,
                min: null,
                sec: null
            }
        },
        props: {
            //结束的时间
            data: {
                type: [Number, String]
            },
        },
        watch: {
            data: {
                handler: function (val) {
                    if (val) {
                        this.countdown();
                    }
                },
                immediate: true
            }
        },
        methods: {
            countdown: function () {
                if (this.data) {
                    const now = Date.parse(new Date());//当前时间毫秒数
                    const msec = Date.parse(this.data) - now;//经过时间毫秒数
                    let day = parseInt(msec / 1000 / 60 / 60 / 24);
                    let hr = parseInt(msec / 1000 / 60 / 60 % 24);
                    let min = parseInt(msec / 1000 / 60 % 60);
                    let sec = parseInt(msec / 1000 % 60);
                    if (sec >= 0) {
                        this.day = day;
                        this.hr = hr > 9 ? hr : '0' + hr;
                        this.min = min > 9 ? min : '0' + min;
                        this.sec = sec > 9 ? sec : '0' + sec;
                        this.timer = setTimeout(() => {
                            this.countdown()
                        }, 1000)
                    } else {
                        this.hr = "00";
                        this.min = "00";
                        this.sec = "00";
                        clearTimeout(this.timer)
                        this.$emit('endTime');
                    }
                }
            }
        },
        beforeDestroy() {
            clearTimeout(this.timer)
        }
    }
</script>

<style scoped lang="less" type="text/less">

</style>
