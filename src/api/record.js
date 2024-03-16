import axios from '../utils/request'

// 查询所有订单
export const recordListAPI = ({ pageNum, pageSize }) => axios({
  url: '/record/list',
  method: 'GET',
  params: {
    pageNum,
    pageSize
  }
})

// 模糊查询订单
export const queryRecordAPI = ({ status, pageNum, pageSize }) => axios({
  url: '/record/select',
  method: 'GET',
  params: {
    status,
    pageNum,
    pageSize
  }
})

// 删除订单
export const deleteRecordAPI = ({ recordId }) => axios({
  url: '/record/delete',
  method: 'DELETE',
  params: {
    recordId
  }
})
