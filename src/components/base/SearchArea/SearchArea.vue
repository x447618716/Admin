<template>
    <div>
        <el-select v-model="searchObj.provinceObj.value" :size="size" :disabled="disabled" class="search-select"
                   @change="getCity">
            <el-option :label="$t('components.SearchArea.allProvince')" value=""></el-option>
            <el-option v-for="obj in searchObj.provinceObj.list" :key="obj.areaId" :label="obj.areaName"
                       :value="obj.areaId"></el-option>
        </el-select>
        <el-select v-model="searchObj.cityObj.value" :size="size" :disabled="disabled" class="search-select"
                   @change="getArea">
            <el-option :label="$t('components.SearchArea.allCity')" value=""></el-option>
            <el-option v-for="obj in searchObj.cityObj.list" :key="obj.areaId" :label="obj.areaName"
                       :value="obj.areaId"></el-option>
        </el-select>
        <el-select v-model="searchObj.areaObj.value" class="search-select" :size="size" :disabled="disabled"
                   @change="$emit('setSearchObjData',searchObj)">
            <el-option :label="$t('components.SearchArea.allArea')" value=""></el-option>
            <el-option v-for="obj in searchObj.areaObj.list" :key="obj.areaId" :label="obj.areaName"
                       :value="obj.areaId"></el-option>
        </el-select>
    </div>
</template>

<script>
    /**
     * 地区三联组件
     * @author 谢荣生
     * @version 1.0
     * @datetime 2021/2/22 14:38
     * @inheritDoc
     * */

    export default {
        name: "SearchArea",
        data() {
            return {
                searchObj: {
                    provinceObj: {
                        value: '',
                        list: []
                    },
                    cityObj: {
                        value: '',
                        list: []
                    },
                    areaObj: {
                        value: '',
                        list: []
                    }
                }
            }
        },
        props: {
            areaId: [String, Number],
            disabled: Boolean,  // 是否禁用
            size: {
                type: String,
                default: "small"
            }
        },
        watch: {
            /**
             * 地区id
             * */
            areaId: {
                handler(val) {
                    if (val) {
                        let provinceId = val.toString().slice(0, 2) + '0000';
                        let cityId = val.toString().slice(0, 4) + '00';
                        //获取省级列表
                        this.$api.getAreaListByAreaId(0).then(res => {
                            if (!res.code) {
                                this.searchObj.provinceObj.list = res.data;
                                this.searchObj.provinceObj.value = parseInt(provinceId);
                                //获取市级列表
                                this.$api.getAreaListByAreaId(provinceId).then(res => {
                                    if (!res.code) {
                                        if (val > this.searchObj.provinceObj.value) {
                                            this.searchObj.cityObj.list = res.data;
                                            this.searchObj.cityObj.value = parseInt(cityId);
                                            //获取区级列表
                                            this.$api.getAreaListByAreaId(cityId).then(res => {
                                                if (!res.code) {
                                                    if (val > this.searchObj.cityObj.value) {
                                                        this.searchObj.areaObj.list = res.data;
                                                        this.searchObj.areaObj.value = parseInt(val);
                                                        this.$emit('setSearchObjData', this.searchObj);
                                                    } else {
                                                        this.searchObj.areaObj.list = res.data;
                                                        this.searchObj.areaObj.value = '';
                                                        this.$emit('setSearchObjData', this.searchObj);
                                                    }
                                                } else {
                                                    this.$message.error(res.message);
                                                }
                                            })
                                        } else {
                                            this.searchObj.cityObj.list = res.data;
                                            this.searchObj.cityObj.value = '';
                                            this.searchObj.areaObj.list = [];
                                            this.searchObj.areaObj.value = '';
                                            this.$emit('setSearchObjData', this.searchObj);
                                        }
                                    } else {
                                        this.$message.error(res.message);
                                    }
                                })
                            } else {
                                this.$message.error(res.message);
                            }
                        })
                    } else {
                        //传空表示 重置数据
                        this.resetSearchData();
                    }
                },
                immediate: true
            }
        },
        methods: {
            getCity() {
                this.searchObj.areaObj.value = '';
                this.searchObj.areaObj.list = [];
                this.getAreaListByAreaId(this.searchObj.provinceObj.value, 'cityObj');
            },
            getArea() {
                this.getAreaListByAreaId(this.searchObj.cityObj.value, 'areaObj');
            },
            getAreaListByAreaId(areaId, areaType) {
                this.$api.getAreaListByAreaId(areaId).then(res => {
                    if (!res.code) {
                        this.searchObj[areaType].value = '';
                        this.searchObj[areaType].list = res.data;
                        this.$emit('setSearchObjData', this.searchObj);
                    } else {
                        this.$message.error(res.message);
                    }
                })
            },
            resetSearchData() {
                this.searchObj.provinceObj.value = '';
                this.searchObj.cityObj.value = '';
                this.searchObj.cityObj.list = [];
                this.searchObj.areaObj.value = '';
                this.searchObj.areaObj.list = [];
                this.$emit('setSearchObjData', this.searchObj);
            }
        },
        created() {
            if (!this.areaId) {
                this.getAreaListByAreaId(0, 'provinceObj');
            }
        }
    }
</script>

<style scoped lang="less" type="text/less">

</style>
