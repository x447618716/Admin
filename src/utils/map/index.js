import {isMobile} from "@/utils/validator";
import {jsonp} from "@/utils";
import {nanoid} from 'nanoid'

/**
 * 必应地图
 * @author 谢荣生
 * @version 1.0
 * @datetime  2021-07-09 14:43:35
 * @inheritDoc http://www.bingmap.cn/demos/cdb28b90-dafe-11e8-b09c-d46d6d978bfa?module=demo
 * */
export const BingMap = {
    map: null,
    mapObject: null,
    searchManager: null,
    bingMapsKey: "AqfTtYW69_xinf22Ih5LqjFFy-VRTu7aLWWCLOoZYgPYMeObVsmqG1uZH89-1gg9",
    init: function () {
        const Map_URL = `https://www.bing.com/api/maps/mapcontrol?callback=GetMap&key=${this.bingMapsKey}&setMkt=en-US&setLang=en`;
        return new Promise((resolve, reject) => {
            if (typeof Microsoft !== "undefined") {
                // eslint-disable-next-line no-undef
                this.map = Microsoft;
                // eslint-disable-next-line no-undef
                resolve(Microsoft);
                return false;
            }
            window.GetMap = () => {
                // eslint-disable-next-line no-undef
                this.map = Microsoft;
                // eslint-disable-next-line no-undef
                resolve(Microsoft);
            }

            let scriptNode = document.createElement("script");
            scriptNode.setAttribute("type", "text/javascript");
            scriptNode.setAttribute("src", Map_URL);
            scriptNode.onerror = reject
            document.body.appendChild(scriptNode);
        });
    },
    /**
     * 地图搜索
     * @param{String} query 地址信息
     * @author 谢荣生
     * @version 1.0.0
     * @datetime  2021-10-08 13:27:23
     * @inheritDoc
     * @return
     * */
    mapSearch: function (query) {
        return new Promise((resolve, reject) => {
            let search = () => {
                let searchRequest = {
                    where: query,
                    callback: res => {
                        if (res && res.results && res.results.length > 0) {
                            this.getUserLocation(res.results[0].location).then(res => {
                                resolve(res)
                            });
                        }
                    },
                    errorCallback: function (e) {
                        reject(e)
                    },
                };
                //发出地理编码请求
                this.searchManager.geocode(searchRequest);
            }
            if (!this.map || !this.searchManager) {
                this.init().then(Microsoft => {
                    this.mapObject = new Microsoft.Maps.Map("#Map", {
                        mapTypeId: Microsoft.Maps.MapTypeId.road,
                        navigationBarMode: Microsoft.Maps.NavigationBarMode.minified
                    });
                    new this.map.Maps.loadModule("Microsoft.Maps.Search", () => {
                        this.searchManager = new this.map.Maps.Search.SearchManager(this.mapObject);
                        search()
                    });
                })
            } else {
                search()
            }
        })
    },
    /**
     * 根据经纬度-获取周边信息
     * @param{Number} latitude 经度
     * @param{Number} longitude 纬度
     * @author 谢荣生
     * @version 1.0.0
     * @datetime  2021-10-08 13:28:06
     * @inheritDoc http://www.bingmap.cn/guide/fe8e2978-dafe-11e8-bd96-d46d6d978bfa?module=doc
     * @return
     * */
    getUserLocation({latitude, longitude}) {
        return new Promise((resolve, reject) => {
            let request = `https://dev.virtualearth.net/REST/v1/LocationRecog/${latitude},${longitude}?o=json&key=${this.bingMapsKey}&includeEntityTypes=businessAndPOI,address&r=2`;
            jsonp({
                url: request,
            }).then(res => {
                let resultList = [];
                //地址编码
                let addressList = res.resourceSets[0].resources[0].addressOfLocation;
                //商业实体
                let businessList = res.resourceSets[0].resources[0].businessesAtLocation;
                //自然景区
                // let naturalList = res.resourceSets[0].resources[0].naturalPOIAtLocation;
                addressList.forEach(item => {
                    resultList.push({
                        id: nanoid(),
                        name: item.addressLine,
                        address: item.formattedAddress,
                        latitude: item.latitude,
                        longitude: item.longitude,
                        country: item.countryIso2,
                        addressLine: item.addressLine,
                        adminDistrict: item.adminDivision,
                        locality: item.locality,
                        postalCode: item.postalCode
                    })
                })
                businessList.forEach(item => {
                    resultList.push({
                        id: nanoid(),
                        name: item.businessInfo.entityName,
                        address: item.businessAddress.formattedAddress,
                        latitude: item.businessAddress.latitude,
                        longitude: item.businessAddress.longitude,
                        country: item.businessAddress.countryIso2,
                        addressLine: item.businessAddress.addressLine,
                        adminDistrict: item.businessAddress.adminDivision,
                        locality: item.businessAddress.locality,
                        postalCode: item.businessAddress.postalCode
                    })
                })
                resolve(resultList)
            }).catch(res => {
                reject(res)
            })
        })
    },
    /**
     * 通过地址找位置
     * @param{String} adminDivision 所在州/行政区划
     * @param{Number} postalCode 邮政编码
     * @param{String} locality 城市或街道
     * @param{String} addressLine 指定某个地址街道的字符串
     * @author 谢荣生
     * @version 1.0.0
     * @datetime  2021-10-08 13:29:08
     * @inheritDoc http://www.bingmap.cn/guide/fe3ec0a9-dafe-11e8-8492-d46d6d978bfa?module=doc
     * @return
     * */
    getAddressInfo({adminDivision, postalCode, locality, addressLine}) {
        return new Promise((resolve, reject) => {
            let request = `https://dev.virtualearth.net/REST/v1/Locations/US/${adminDivision}/${postalCode}/${locality}/${addressLine}?key=${this.bingMapsKey} `
            jsonp({
                url: request,
            }).then(res => {
                let address = res.resourceSets[0].resources[0].address;
                let point = res.resourceSets[0].resources[0].point.coordinates;
                resolve({address, point})
            }).catch(res => {
                reject(res)
            })
        })
    }
}

/**
 * 百度地图
 * @author 谢荣生
 * @version 1.0
 * @datetime  2021-07-09 14:43:35
 * @inheritDoc https://lbsyun.baidu.com/index.php?title=jspopular3.0/guide/usage
 * */
export const BaiDuMap = {
    init: function () {
        const AK = "VHswfHPFUDxtV94IIMWDnUHSWZacYaqF";
        const Map_URL = `http://api.map.baidu.com/api?v=${isMobile ? '3.0' : '1.0'}&ak=${AK}&callback=GetMap`;
        return new Promise((resolve, reject) => {
            if (typeof BMap !== "undefined") {
                // eslint-disable-next-line no-undef
                resolve(BMap);
                return false;
            }
            window.GetMap = function () {
                // eslint-disable-next-line no-undef
                resolve(BMap);
            }

            let scriptNode = document.createElement("script");
            scriptNode.setAttribute("type", "text/javascript");
            scriptNode.setAttribute("src", Map_URL);
            scriptNode.onerror = reject
            document.body.appendChild(scriptNode);
        });
    },
    /**
     * GPS坐标系(WGS84)转百度坐标系(BD09)
     */
    WGS84ToBD09: function (gpsPoint) {
        return new Promise((resolve, reject) => {
            // eslint-disable-next-line no-undef
            let convertor = new BMap.Convertor();
            let pointArr = [...gpsPoint];
            convertor.translate(pointArr, 1, 5, function (data) {
                if (data.status === 0) {
                    resolve(data.points)
                } else {
                    reject(data.message)
                }
            })
        })
    }
}


/**
 * 谷歌地图
 * @author 谢荣生
 * @version 1.0
 * @datetime  2021-07-09 14:43:35
 * @inheritDoc https://developers.google.com/maps/documentation/maps-static/overview?hl=zh_CN
 * */
export const GoogleMap = {
    map: null,
    googleMapsKey: "AIzaSyDLMDsjl9zafTS9zxkeeIJrGKk8YFtUWfg",
    init: function () {
        const Map_URL = `https://maps.googleapis.com/maps/api/js?key=${this.googleMapsKey}&libraries=places&callback=GetMap&region=US&solution_channel=GMP_QB_addressselection_v1_cAC`;
        return new Promise((resolve, reject) => {
            if (typeof google !== "undefined") {
                // eslint-disable-next-line no-undef
                this.map = google;
                // eslint-disable-next-line no-undef
                resolve(google);
                return false;
            }
            window.GetMap = () => {
                // eslint-disable-next-line no-undef
                this.map = google;
                // eslint-disable-next-line no-undef
                resolve(google);
            }

            let scriptNode = document.createElement("script");
            scriptNode.setAttribute("type", "text/javascript");
            scriptNode.setAttribute("src", Map_URL);
            scriptNode.onerror = reject
            document.body.appendChild(scriptNode);
        });
    },
    /**
     * 谷歌地图搜索
     * @param{HTMLElement} autocompleteInput 文本输入框节点
     * @author 谢荣生
     * @version 1.0.0
     * @datetime  2021-10-08 13:27:23
     * @inheritDoc
     * @return
     * */
    mapSearch: function (autocompleteInput) {
        return new Promise((resolve, reject) => {
            let search = () => {
                // eslint-disable-next-line no-undef
                const autocomplete = new google.maps.places.Autocomplete(autocompleteInput, {
                    fields: ["geometry.location", "formatted_address"],
                    types: ["address"],
                });
                autocomplete.addListener('place_changed', function () {
                    const place = autocomplete.getPlace();
                    if (!place.geometry) {
                        reject();
                        return;
                    }

                    fillInAddress(place);
                });
                function fillInAddress(place) {
                    resolve(place);
                }
            }
            if (!this.map) {
                this.init().then(() => {
                    search()
                })
            } else {
                search()
            }
        })
    },
}


/**
 * 高德地图
 * @author 谢荣生
 * @version 1.0.0
 * @datetime 2022-10-12 17:24:38
 * @inheritDoc https://lbs.amap.com/api/javascript-api/guide/abc/prepare
 * @return
 * */

export const AMaps = {
    map: null,
    aMapsKey: "ff87f69a293f7b587deff4a322316b7f",
    apiKey:'0d27ff3ae00aee58d51cf53b2852aecc',
    init: function () {
        window._AMapSecurityConfig = {
            securityJsCode:'43f5494120462d5f7cc5df7278ce3502',
        }
        const Map_URL = `https://webapi.amap.com/maps?v=1.4.15&key=${this.aMapsKey}&callback=GetMap`;
        return new Promise((resolve, reject) => {
            if (typeof AMap !== "undefined") {
                // eslint-disable-next-line no-undef
                this.map = AMap;
                // eslint-disable-next-line no-undef
                resolve(AMap);
                return false;
            }
            window.GetMap = () => {
                // eslint-disable-next-line no-undef
                this.map = AMap;
                // eslint-disable-next-line no-undef
                resolve(AMap);
            }

            let scriptNode = document.createElement("script");
            scriptNode.setAttribute("type", "text/javascript");
            scriptNode.setAttribute("src", Map_URL);
            scriptNode.onerror = reject
            document.body.appendChild(scriptNode);
        });
    },
}


export default {
    BingMap,
    BaiDuMap,
    GoogleMap,
    AMaps
}
