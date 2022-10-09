import request from '@/utils/request'
// 获取视频列表
export function getVideo(data) {
    return request({
        url: 'getVideo',
        method: 'post',
        data
    })
}
// 批量上传视频
export function addVideo(data) {
    return request({
        url: 'addVideo',
        method: 'post',
        data
    })
}
// 删除视频视频
export function delVideo(data) {
    return request({
        url: 'delVideo',
        method: 'post',
        data
    })
}
// 批量删除视频视频
export function delAllVideos(data) {
    return request({
        url: 'delAllVideos',
        method: 'post',
        data
    })
}
// 修改分类
export function editVideo(data) {
    return request({
        url: 'editVideo',
        method: 'post',
        data
    })
}
// 修改视频状态
export function editVideoStatus(data) {
    return request({
        url: 'editVideoStatus',
        method: 'post',
        data
    })
}
// 获取视频筛选列表
export function getSelectVideoClass() {
    return request({
        url: 'getSelectVideoClass',
        method: 'get',
    })
}
// 获取视频分类列表
export function getVideoClass(data) {
    return request({
        url: 'getVideoClass',
        method: 'post',
        data
    })
}
// 添加视频分类
export function addVideoClass(data) {
    return request({
        url: 'addVideoClass',
        method: 'post',
        data
    })
}
// 修改视频分类
export function editVideoClass(data) {
    return request({
        url: 'editVideoClass',
        method: 'post',
        data
    })
}
// 修改视频分类
export function delVideoClass(data) {
    return request({
        url: 'delVideoClass',
        method: 'post',
        data
    })
}
// 修改视频分类状态
export function editVideoClassStatus(data) {
    return request({
        url: 'editVideoClassStatus',
        method: 'post',
        data
    })
}