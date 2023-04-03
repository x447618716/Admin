import { shallowMount } from '@vue/test-utils'
import HelloWorld from '@/components/base/CountDown/CountDown.vue'

describe('countDown.vue', () => {
  it('计时器测试', () => {
    const msg = '2020-03-16 12:03:00'
    const wrapper = shallowMount(HelloWorld, {
      propsData: { msg }
    })
    console.log(wrapper);
    //expect(wrapper.text()).toMatch(msg)
  })
})
