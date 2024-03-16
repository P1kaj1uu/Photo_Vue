import axios from '../utils/request'

// 查询评论评价列表
export const commentListAPI = ({ pageNum, pageSize }) => axios({
  url: '/comment/list',
  method: 'GET',
  params: {
    pageNum,
    pageSize
  }
})

// 模糊查询评论评价
export const queryCommentAPI = ({ name, content, pageNum, pageSize }) => axios({
  url: '/comment/select',
  method: 'GET',
  params: {
    name,
    content,
    pageNum,
    pageSize
  }
})

// 删除评论评价
export const deleteCommentAPI = ({ commentId }) => axios({
  url: '/comment/delete',
  method: 'DELETE',
  params: {
    commentId
  }
})