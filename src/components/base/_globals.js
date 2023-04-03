//为方便起见，全局注册所有基本组件，因为它们
//将经常使用。使用注册组件
//pascalc文件名的版本。

// import Vue from 'vue'
import upperFirst from 'lodash/upperFirst'
import camelCase from 'lodash/camelCase'


const install = function (Vue) {
    // https://webpack.js.org/guides/dependency-management/#require-context
    const requireComponent = require.context(
        // 其组件目录的相对路径
        '.',
        // 是否查询其子目录
        true,
        // 匹配基础组件文件名的正则表达式
        /[\w-]+\.vue$/
    );

    requireComponent.keys().forEach(fileName => {
        // 获取组件配置
        const componentConfig = requireComponent(fileName)
        // console.log(fileName)


        // 获取组件的 PascalCase 命名
        const componentName = upperFirst(
            camelCase(
                // 剥去文件名开头的 `./` 和结尾的扩展名
                //fileName.replace(/^\.\/(.*)\.\w+$/, '$1')
                // 只获取文件名
                fileName.replace(/(.*\/)*([^.]+).*/ig, '$2')
            )
        );
        import(`${fileName}`).then(msgs => {
            // console.log(componentConfig)
            // console.log(componentName)
            // console.log(msgs)
            // 全局注册组件
            Vue.component(
                componentName,
                // 如果这个组件选项是通过 `export default` 导出的，
                // 那么就会优先使用 `.default`，
                // 否则回退到使用模块的根。
                msgs.default || componentConfig
            )
        })

        // 全局注册组件
        // Vue.component(
        //     componentName,
        //     // 如果这个组件选项是通过 `export default` 导出的，
        //     // 那么就会优先使用 `.default`，
        //     // 否则回退到使用模块的根。
        //     componentConfig.default || componentConfig
        // )
    });
};

export default {
    install
}



