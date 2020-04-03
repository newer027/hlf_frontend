import request from '@/utils/request'

export function fetchUserList(_params) {
  return request({
    url: 'account/',
    method: 'get',
    params: _params
  })
}

export function createUser(_params) {
  return request({
    url: 'account/',
    method: 'post',
    data: _params
  })
}

export function deleteUser(user_pk) {
  return request({
    url: 'account/' + user_pk + '/',
    method: 'delete'
  })
}

export function fetchVendorList() {
  return request({
    url: 'vendor_list/',
    method: 'get'
  })
}

export function fetchUserVendor(user_pk) {
  return request({
    url: 'account/' + user_pk + '/',
    method: 'get'
  })
}

export function updateUserVendor(user_pk, _params) {
  return request({
    url: 'account/' + user_pk + '/vendor_list/',
    method: 'put',
    data: _params
  })
}

export function updateUser(user_pk, _params) {
  return request({
    url: 'account/' + user_pk + '/',
    method: 'put',
    data: _params
  })
}

export function fetchLedgerList(_params) {
  return request({
    url: 'ledger/',
    method: 'get',
    params: _params
  })
}

export function fetchOrderList(_params) {
  return request({
    url: 'order/',
    method: 'get',
    params: _params
  })
}

export function fetchLedgerDetail(ledger_id) {
  return request({
    url: 'ledger/' + ledger_id + '/',
    method: 'get'
  })
}

export function fetchOrderStartList(_params) {
  return request({
    url: 'orderstart/',
    method: 'get',
    params: _params
  })
}

export function fetchOrderStartDetail(item_id) {
  return request({
    url: 'order_detail/' + item_id + '/',
    method: 'get'
  })
}

export function orderStart(item_id) {
  return request({
    url: 'order_start/' + item_id + '/',
    method: 'get'
  })
}

export function orderEnd(item_id) {
  return request({
    url: 'order_end/' + item_id + '/',
    method: 'get'
  })
}

export function dashboard(s_y, s_m, s_d, e_y, e_m, e_d) {
  return request({
    url: 'dashboard/' + s_y + '/' + s_m + '/' + s_d + '/' + e_y + '/' + e_m + '/' + e_d + '/',
    method: 'get'
  })
}

export function lastestAbnormal() {
  return request({
    url: 'lastest_abnormal/',
    method: 'get'
  })
}

export function orderstartNg() {
  return request({
    url: 'orderstart/?min_status=2',
    method: 'get'
  })
}

export function lastestDistance() {
  return request({
    url: 'lastest_distance/',
    method: 'get'
  })
}

export function createDistance(_from) {
  return request({
    url: 'createDistance/',
    method: 'post',
    data: _from
  })
}

export function fetchTaskItemList(_params) {
  return request({
    url: 'taskitem/',
    method: 'get',
    params: _params
  })
}

export function fetchUpperPaymentList() {
  return request({
    url: 'upperpayment/',
    method: 'get'
  })
}

export function fetchLowerPaymentList() {
  return request({
    url: 'lowerpayment/',
    method: 'get'
  })
}

export function fetchInvoiceList() {
  return request({
    url: 'invoice/',
    method: 'get'
  })
}

export function fetchInvoiceBatchList(task_pk) {
  return request({
    url: 'invoicebatch/' + task_pk + '/',
    method: 'get'
  })
}

export function fetchTaskitem(task_pk) {
  return request({
    url: 'taskitem/' + task_pk + '/',
    method: 'get'
  })
}

export function fetchUpperPayment(upper_pk) {
  return request({
    url: 'upperpayment/' + upper_pk + '/',
    method: 'get'
  })
}

export function fetchLowerPayment(lower_pk) {
  return request({
    url: 'lowerpayment/' + lower_pk + '/',
    method: 'get'
  })
}

export function fetchInvoice(invoice_pk) {
  return request({
    url: 'invoice/' + invoice_pk + '/',
    method: 'get'
  })
}
