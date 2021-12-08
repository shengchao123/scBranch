import request from '../index'

export function findMessageByPage (params) { // 分页查询 用户消息
  return request({
    url: '/message/messageRecord/findMessageByPage',
    method: 'post',
    data: {
      OrderByReq: {
        descending: true,
        propertyName: ''
      },
      ...params
    }
  })
}
export function findMessagesCountByUser (params) { // 分页查询 用户消息
  return request({
    url: '/message/messageRecord/findMessagesCountByUser',
    method: 'post',
    data: {}
  })
}

export function readMessage (params) { // 标为已读 用户消息
  return request({
    url: '/message/messageRecord/readMessage',
    method: 'post',
    data: {
      ...params
    }
  })
}

export function batchReadMessage (params) { // 批量标已读 用户消息
  return request({
    url: '/message/messageRecord/batchReadMessage',
    method: 'post',
    data: {
      ...params
    }
  })
}

export function deleteMessageById (params) { // 删除 用户消息
  return request({
    url: '/message/messageRecord/deleteMessageById',
    method: 'post',
    data: {
      ...params
    }
  })
}
export function batchDeleteMessageByIds (params) { // 批量删除 用户消息
  return request({
    url: '/message/messageRecord/batchDeleteMessageByIds',
    method: 'post',
    data: {
      ...params
    }
  })
}

export function findNotificationPage (params) { // 分页查询 通知信息
  return request({
    url: '/message/notification/findNotificationPage',
    method: 'post',
    data: {
      OrderByReq: {
        descending: true,
        propertyName: ''
      },
      ...params
    }
  })
}

export function findNoticePage (params) { // 公告分页
  return request({
    url: '/message/sysNotice/findNoticePage',
    method: 'post',
    data: {
      OrderByReq: {
        descending: true,
        propertyName: ''
      },
      ...params
    }
  })
}
