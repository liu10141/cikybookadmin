import request from '@/utils/request'

// 获取空间站列表
export function getProduct(data) {
    return request({
        url: 'getProduct',
        method: 'post',
        data
    })
}
// 添加空间站
export function addProduct(data) {
    return request({
        url: 'addProduct',
        method: 'post',
        data
    })
}
// 删除空间站
export function delProduct(data) {
    return request({
        url: 'delProduct',
        method: 'post',
        data
    })
}
// 修改空间站
export function editProduct(data) {
    return request({
        url: 'editProduct',
        method: 'post',
        data
    })
}
// 设置空间站状态
export function setProductStatus(data) {
    return request({
        url: 'setProductStatus',
        method: 'post',
        data
    })
}