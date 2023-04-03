export const prop = {
    data() {
        return {}
    },
    props: {
        isShow: Boolean,
    },
    created() {
        console.log('混入对象的钩子被调用');
    }

};
