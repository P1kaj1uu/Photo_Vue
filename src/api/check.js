import axios from '../utils/request'

// 查询所有审核
export const checkListAPI = ({ pageNum, pageSize }) => axios({
  url: '/check/list',
  method: 'GET',
  params: {
    pageNum,
    pageSize
  }
})

// 模糊查询审核
export const queryCheckAPI = ({ username, isPass, type, pageNum, pageSize }) => axios({
  url: '/check/select',
  method: 'GET',
  params: {
    username,
    isPass,
    type,
    pageNum,
    pageSize
  }
})

// 删除审核
export const deleteCheckAPI = ({ checkId }) => axios({
  url: '/check/delete',
  method: 'DELETE',
  params: {
    checkId
  }
})

// 编辑审核状态
export const editCheckAPI = (data) => axios({
  url: '/check/edit',
  method: 'POST',
  data: data
})
