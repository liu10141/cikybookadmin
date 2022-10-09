import request from "@/utils/request";

// 获取书籍列表
export function getBook(data) {
  return request({
    url: "getBook",
    method: "post",
    data
  });
}
// 批量上传照片
export function addBook(data) {
  return request({
    url: "addBook",
    method: "post",
    data
  });
}
export function checkBookIsExist(data) {
  return request({
    url: "checkBookIsExist",
    method: "post",
    data
  });
}
export function getSelectBookClass(data) {
  return request({
    url: "getSelectBookClass",
    method: "get",
    data
  });
}
// 删除书籍
export function delBook(data) {
  return request({
    url: "delBook",
    method: "post",
    data
  });
}
// 批量设置书籍状态
export function setAllbookStatus(data) {
  return request({
    url: "setAllbookStatus",
    method: "post",
    data
  });
}
// 修改分类
export function editBook(data) {
  return request({
    url: "editBook",
    method: "post",
    data
  });
}
export function delComment(data) {
  return request({
    url: "delComment",
    method: "post",
    data
  });
}
// 修改状态
export function editbookstatus(data) {
  return request({
    url: "editbookstatus",
    method: "post",
    data
  });
}
export function getBookCommentList(data) {
  return request({
    url: "getBookCommentList",
    method: "post",
    data
  });
}

// 获取书籍分类列表
export function getBookClass(data) {
  return request({
    url: "getBookClass",
    method: "post",
    data
  });
}
// 添加书籍分类
export function addBookClass(data) {
  return request({
    url: "addBookClass",
    method: "post",
    data
  });
}
// 修改书籍分类
export function editBookClass(data) {
  return request({
    url: "editBookClass",
    method: "post",
    data
  });
}
// 修改书籍分类
export function delBookClass(data) {
  return request({
    url: "delBookClass",
    method: "post",
    data
  });
}
// 修改书籍分类状态
export function editBookClassStatus(data) {
  return request({
    url: "editBookClassStatus",
    method: "post",
    data
  });
}
// ####################################################书架相关#########################################################################################
// 获取书架列表
export function getShelfClass(data) {
  return request({
    url: "getShelfClass",
    method: "post",
    data
  });
}
// 添加书架
export function addShelfClass(data) {
  return request({
    url: "addShelfClass",
    method: "post",
    data
  });
}
// 修改书架名称
export function editShelfClass(data) {
  return request({
    url: "editShelfClass",
    method: "post",
    data
  });
}
//删除书架
export function delShelfClass(data) {
  return request({
    url: "delShelfClass",
    method: "post",
    data
  });
}
// 修改书架状态
export function editShelfClassStatus(data) {
  return request({
    url: "editShelfClassStatus",
    method: "post",
    data
  });
}
// 修改书架状态
export function addTable(data) {
  return request({
    url: "addTable",
    method: "post",
    data
  });
}
// 修改书架状态
export function getTableList(data) {
  return request({
    url: "getTableList",
    method: "post",
    data
  });
}
// 修改书架状态
export function setTableStatus(data) {
  return request({
    url: "setTableStatus",
    method: "post",
    data
  });
}

// 筛选书架
export function getBookSelectShelf() {
  return request({
    url: "getBookSelectShelf",
    method: "get"
  });
}
export function getImgList(data) {
  return request({
    url: "getImgList",
    method: "post",
    data
  });
}
