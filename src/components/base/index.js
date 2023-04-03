import CountDown from './CountDown/CountDown'
import Language from './Language/Language'
import SearchArea from './SearchArea/SearchArea'
import SearchAreaTree from './SearchAreaTree/SearchAreaTree'
import ThemeChoice from './ThemeChoice/ThemeChoice'
import ElPaginationCustom from './ElPaginationCustom/ElPaginationCustom'
import ElUploadCustom from './ElUploadCustom/ElUploadCustom'
import ElCheckboxCustomAll from './ElCheckboxCustomAll/ElCheckboxCustomAll'
import IconPicker from './IconPicker/IconPicker'
import ElLinkCustom from './ElLinkCustom/ElLinkCustom'
import ElVideo from './ElVideo/ElVideo'
import VueCropperCustom from './VueCropperCustom/VueCropperCustom'
import TinyMceEditor from '../common/TinyMceEditor'
import ElButtonCustom  from './ElButtonCustom/ElButtonCustom'
import VueCountTo from "vue-count-to/src/vue-countTo";

import LineChart  from './LineChart/LineChart'
import RaddarChart  from './RaddarChart/RaddarChart'
import PieChart  from './PieChart/PieChart'
import BarChar  from './BarChar/BarChar'

import ElTreeTransfer from 'el-tree-transfer'


const install = function (Vue) {
    Vue.component(CountDown.name, CountDown);
    Vue.component(Language.name, Language);
    Vue.component(SearchAreaTree.name, SearchAreaTree);
    Vue.component(SearchArea.name, SearchArea);
    Vue.component(ThemeChoice.name, ThemeChoice);
    Vue.component(ElPaginationCustom.name, ElPaginationCustom);
    Vue.component(ElUploadCustom.name, ElUploadCustom);
    Vue.component(ElCheckboxCustomAll.name, ElCheckboxCustomAll);
    Vue.component(IconPicker.name, IconPicker);
    Vue.component(ElLinkCustom.name, ElLinkCustom);
    Vue.component(ElVideo.name, ElVideo);
    Vue.component(VueCropperCustom.name, VueCropperCustom);
    Vue.component(TinyMceEditor.name, TinyMceEditor);
    Vue.component(ElButtonCustom.name, ElButtonCustom);
    Vue.component(LineChart.name, LineChart);
    Vue.component(RaddarChart.name, RaddarChart);
    Vue.component(PieChart.name, PieChart);
    Vue.component(BarChar.name, BarChar);
    Vue.component("CountTo", VueCountTo);
    Vue.component('ElTreeTransfer', ElTreeTransfer);
};

export default {
    install
}
