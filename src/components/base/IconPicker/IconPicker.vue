<template>
    <div class="iconpicker" v-clickoutside="handleClose">
        <div class="iconpicker-item">
            <div class="iconpicker-icon"><i :class="value"></i></div>
            <div style="flex: 1" @click="collapse = !collapse">
                <i :class="collapse?'edge':''" class="el-icon-caret-bottom"></i>
            </div>
        </div>
        <div class="anim" v-show="collapse">
            <div class="iconpicker-body">
                <div class="iconpicker-search">
                    <el-input :placeholder="$t('components.IconPicker.searchTips')" v-model="searchIcon" class="form-input__medium"
                              :disabled="disabled">
                        <i slot="prefix" class="el-input__icon el-icon-search"></i>
                    </el-input>
                </div>
                <div class="iconpicker-list-box">
                    <div class="iconpicker-list">
                        <div class="iconpicker-icon-limit">
                            <div class="iconpicker-icon-item" v-for="(icon,index) in data" :key="index"
                                 @click="handleSelect(icon)"><i :class="icon"></i></div>
                        </div>
                    </div>
                    <div class="iconpicker-page">
                        <div class="iconpicker-page-count"><span>{{pageNo}}</span>/<span>{{totalPage}}</span> (<span>{{total}}</span>)
                        </div>
                        <div class="iconpicker-page-operate"><i class="el-icon-arrow-left" @click="handleLeft"></i> <i
                                class="el-icon-arrow-right" @click="handleRight"></i></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    /**
     * 图标选择器组件
     * @author 谢荣生
     * @version 1.0
     * @datetime 2021/2/22 14:37
     * @inheritDoc
     * */

    import Clickoutside from 'element-ui/src/utils/clickoutside';

    export default {
        name: "IconPicker",
        data() {
            return {
                allData: [],
                searchData: [],
                data: [],
                collapse: false,
                pageNo: 1,
                pageSize: 12,
                searchIcon: ''
            }
        },
        props: {
            value: String,
            disabled: Boolean,
        },
        directives: {Clickoutside},
        computed: {
            totalPage() {
                return this.searchIcon ? parseInt(this.searchData.length / this.pageSize) : parseInt(this.allData.length / this.pageSize);
            },
            total() {
                return this.searchIcon ? this.searchData.length : this.allData.length;
            },
            allList() {
                return this.searchIcon ? this.searchData : this.allData;
            }
        },
        watch: {
            searchIcon(val) {
                let reg = new RegExp(val);
                let data = [];
                this.allData.forEach(item => {
                    if (reg.test(item)) {
                        data.push(item);
                    }
                });
                this.searchData = data;
                let start = (this.pageNo - 1) * this.pageSize;
                this.data = this.searchData.slice(start, start + this.pageSize);
            }
        },
        methods: {
            //减减
            handleLeft() {
                if (this.pageNo > 1) {
                    this.pageNo--;
                    let start = (this.pageNo - 1) * this.pageSize;
                    this.data = this.allList.slice(start, start + this.pageSize);
                }
            },
            //加加
            handleRight() {
                if (this.pageNo < this.totalPage) {
                    this.pageNo++;
                    let start = (this.pageNo - 1) * this.pageSize;
                    this.data = this.allList.slice(start, start + this.pageSize);
                }
            },
            //确认选择
            handleSelect(icon) {
                this.collapse = false;
                if (!this.disabled) {
                    this.$emit('input', icon);
                }
            },
            handleClose() {
                this.collapse = false;
            }
        },
        created() {
            document.styleSheets.forEach(obj => {
                obj.cssRules.forEach(item => {
                    if (item.selectorText) {
                        //Element-ui内置图标 ||  //自定义图标元素
                        if (item.selectorText.search(/^.el-icon-/) != -1 || item.selectorText.search(/^.sx-icon-/) != -1) {
                            let icon = item.selectorText.split(':')[0].split('.')[1];
                            if (!this.allData.includes(icon)) {
                                this.allData.push(icon)
                            }
                        }
                    }
                })
            });
            let start = this.pageNo * this.pageSize;
            this.data = this.allData.slice(start, start + this.pageSize);
        }
    }
</script>

<style scoped lang="less" type="text/less">
    .iconpicker {
        position: relative;
        max-width: 280px;
    }

    .iconpicker-item {
        border: 1px solid #e6e6e6;
        width: 90px;
        height: 38px;
        border-radius: 4px;
        cursor: pointer;
        position: relative;
        display: flex;
        text-align: center;
        align-items: center;
    }

    .iconpicker-icon {
        border-right: 1px solid #e6e6e6;
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
        width: 60px;
        height: 100%;
        background: #fff;
        transition: all .3s;
    }

    .iconpicker-item i {
        line-height: 38px;
        font-size: 18px;
    }

    .iconpicker-item:hover {
        border-color: #D2D2D2 !important;
    }

    .iconpicker-item:hover .iconpicker-icon {
        border-color: #D2D2D2 !important;
    }

    .iconpicker-item .el-icon-caret-bottom {
        transition: all .3s
    }

    .iconpicker-item .edge {
        transform: rotate(180deg);
    }

    .iconpicker .anim {
        position: absolute;
        left: 0;
        top: 42px;
        padding: 5px 0;
        z-index: 2000;
        min-width: 100%;
        border: 1px solid #d2d2d2;
        max-height: 300px;
        overflow-y: auto;
        background-color: #fff;
        border-radius: 2px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, .12);
        box-sizing: border-box;
    }

    .iconpicker-body {
        padding: 6px;
    }

    .iconpicker-search {
        position: relative;
        margin: 0 0 6px 0;
    }

    .iconpicker-search:hover {
        border-color: #D2D2D2 !important;
    }

    .iconpicker .iconpicker-list {
        background-color: #fff;
        border: 1px solid #ccc;
        border-radius: 4px;
        padding-left: 15px;
    }

    .iconpicker .iconpicker-icon-item {
        display: inline-block;
        width: 21.1%;
        line-height: 36px;
        text-align: center;
        cursor: pointer;
        vertical-align: top;
        height: 36px;
        margin: 4px;
        border: 1px solid #ddd;
        border-radius: 2px;
        transition: 300ms;
    }

    .iconpicker .iconpicker-icon-item i {
        font-size: 17px;
    }

    .iconpicker .iconpicker-icon-item:hover {
        background-color: #eee;
        border-color: #ccc;
        -webkit-box-shadow: 0 0 2px #aaa, 0 0 2px #fff inset;
        -moz-box-shadow: 0 0 2px #aaa, 0 0 2px #fff inset;
        box-shadow: 0 0 2px #aaa, 0 0 2px #fff inset;
        text-shadow: 0 0 1px #fff;
    }

    .iconpicker-page {
        margin-top: 6px;
        margin-bottom: -6px;
        display: flex;
        font-size: 12px;
        padding: 0 2px;
        justify-content: space-between;
    }

    .iconpicker-page-operate {
        cursor: pointer;
    }
</style>
