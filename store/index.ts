import { defineStore } from 'pinia'
// import type {
//   User,
// } from '@/interface/user.interface'
// export const Tdata = interface{

// }
export const indexStore = defineStore('index', {
  state() {
    return {
      data: {},
      index: false,
      status: 'more',
    }
  },
  actions: {
    // data(state, data) {
    //   state.data = data
    // },
    // isIndex(state) {
    //   state.index = true
    // },
    // setStatus(state, data) {
    //   state.status = data
    // },
  },
  getters: {

  },

})
