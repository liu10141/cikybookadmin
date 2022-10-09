import request from '@/utils/request'

// 获取订单列表
export function getVipOrderList(data) {
    return request({
        url: 'getVipOrderList',
        method: 'post',
        data
    })
}
// 备注会员订单
export function setVipOrderRemark(data) {
    return request({
        url: 'setVipOrderRemark',
        method: 'post',
        data
    })
}
// 订单详情
export function returnSaleOrder(data) {
    return request({
        url: 'returnSaleOrder',
        method: 'post',
        data
    })
}
// 获取预约订单列表
export function getQueueOrderList(data) {
    return request({
        url: 'getQueueOrderList',
        method: 'post',
        data
    })
}
// 开门记录
export function getOpenDoorList(data) {
    return request({
        url: 'getOpenDoorList',
        method: 'post',
        data
    })
}
// 备注单次门票订单
export function setOrderRemark(data) {
    return request({
        url: 'setOrderRemark',
        method: 'post',
        data
    })
}
// 备注单次门票订单
export function getCardList(data) {
    return request({
        url: 'getCardList',
        method: 'post',
        data
    })
}
// 添加卡包
export function addCard(data) {
    return request({
        url: 'addCard',
        method: 'post',
        data
    })
}
// 修改卡包信息
export function editCard(data) {
    return request({
        url: 'editCard',
        method: 'post',
        data
    })
}
// 退款
export function returnUnitOrder(data) {
    return request({
        url: 'returnUnitOrder',
        method: 'post',
        data
    })
}
// 会员退款
export function returnVipOrder(data) {
    return request({
        url: 'returnVipOrder',
        method: 'post',
        data
    })
}
// 获取筛选卡片列表
export function getSelectCard() {
    return request({
        url: 'getSelectCard',
        method: 'get',

    })
}
//####################################################门禁卡相关接口##########################################################################
export function getUserCard(data) {
    return request({
        url: 'getUserCard',
        method: 'post',
        data
    })
}
// 添加门禁卡
export function addUserCard(data) {
    return request({
        url: 'addUserCard',
        method: 'post',
        data

    })
}
// 修改门禁卡
export function editUserCard(data) {
    return request({
        url: 'editUserCard',
        method: 'post',
        data

    })
}
// 修改门禁卡状态
export function setUserCardStatus(data) {
    return request({
        url: 'setUserCardStatus',
        method: 'post',
        data

    })
}