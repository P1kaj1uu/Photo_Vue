import axios from '../utils/request'

// 查询所有约拍商品
export const goodsListAPI = ({ pageNum, pageSize }) => axios({
  url: '/goods/list',
  method: 'GET',
  params: {
    pageNum,
    pageSize
  }
})

// 模糊查询约拍商品
export const queryGoodsAPI = ({ content, position, type, pageNum, pageSize }) => axios({
  url: '/goods/select',
  method: 'GET',
  params: {
    content,
    position,
    type,
    pageNum,
    pageSize
  }
})

// 删除约拍商品
export const deleteGoodsAPI = ({ goodsId }) => axios({
  url: '/goods/delete',
  method: 'DELETE',
  params: {
    goodsId
  }
})
