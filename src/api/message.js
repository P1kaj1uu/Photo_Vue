import axios from '../utils/request'

// 查询系统消息列表
export const messageListAPI = ({ pageNum, pageSize }) => axios({
  url: '/message/list',
  method: 'GET',
  params: {
    pageNum,
    pageSize
  }
})

// 模糊查询系统消息
export const queryMessageAPI = ({ content, pageNum, pageSize }) => axios({
  url: '/message/select',
  method: 'GET',
  params: {
    content,
    pageNum,
    pageSize
  }
})

// 新增系统消息
export const addMessageAPI = (data) => axios({
  url: '/message/add',
  method: 'POST',
  data: data
})

// 删除系统消息
export const deleteMessageAPI = ({ messageId }) => axios({
  url: '/message/delete',
  method: 'DELETE',
  params: {
    messageId
  }
})