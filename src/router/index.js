import Vue from 'vue'
import Router from 'vue-router'
const _import = require('./_import_' + process.env.NODE_ENV)
// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/** note: submenu only apppear when children.length>=1
*   detail see  https://panjiachen.github.io/vue-element-admin-site/#/router-and-nav?id=sidebar
**/

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    roles: ['admin','editor']     will control the page roles (you can set multiple roles)
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
    noCache: true                if true ,the page will no be cached(default is false)
  }
**/
export const constantRouterMap = [
  { path: '/login', component: _import('login/index'), hidden: true },
  { path: '/authredirect', component: _import('login/authredirect'), hidden: true },
  { path: '/404', component: _import('errorPage/404'), hidden: true },
  { path: '/401', component: _import('errorPage/401'), hidden: true },
  {
    path: '',
    component: Layout,
    redirect: 'dashboard',
    children: [{
      path: 'dashboard', component: _import('dashboard/index'), name: 'dashboard',
      meta: { title: 'dashboard', icon: 'dashboard', noCache: true }
    }]
  }
]

export default new Router({
  // mode: 'history', // require service support
  // base: '/mall/',
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export const asyncRouterMap = [
  {
    menuId: 1,
    path: '/admin',
    component: Layout,
    name: 'menu_manage',
    hidden: false,
    redirect: 'noredirect', // == /admin/user
    meta: {
      title: 'menu_manage',
      icon: 'table'
    },
    children: [
      {
        menuId: 2,
        path: 'user',
        component: _import('admin/user/index'),
        name: 'menu_user',
        meta: {
          title: 'menu_user',
          icon: 'example'
        }
      },
      {
        menuId: 3,
        path: 'taskdetail/:itemid',
        component: _import('admin/taskDetail/index'),
        hidden: true,
        name: 'task_detail',
        meta: {
          title: 'task_detail',
          icon: 'example'
        }
      },
      {
        menuId: 4,
        path: 'taskorder',
        component: _import('admin/taskOrder/index'),
        name: 'task_order',
        meta: {
          title: 'task_order',
          icon: 'example'
        }
      },
      {
        menuId: 5,
        path: 'orther/:ledgerid',
        component: _import('example/orther/index'),
        name: 'menu_map',
        hidden: true,
        meta: {
          title: 'menu_map',
          icon: 'example'
        }
      },
      {
        menuId: 6,
        path: 'taskitem',
        component: _import('admin/taskItemList/index'),
        name: 'taskitem',
        meta: {
          title: 'taskitem',
          icon: 'example'
        }
      },
      {
        menuId: 7,
        path: 'taskitem/:taskitemid',
        component: _import('admin/taskItemDetail/index'),
        name: 'taskitem_detail',
        hidden: true,
        meta: {
          title: 'taskitem_detail',
          icon: 'example'
        }
      },
      {
        menuId: 8,
        path: 'upperpayment',
        component: _import('admin/upperPayment/index'),
        name: 'upperpayment',
        meta: {
          title: 'upperpayment',
          icon: 'example'
        }
      },
      {
        menuId: 9,
        path: 'upperpayment/:upperid',
        component: _import('admin/upperPaymentDetail/index'),
        name: 'upperpaymentdetail',
        hidden: true,
        meta: {
          title: 'upperpaymentdetail',
          icon: 'example'
        }
      },
      {
        menuId: 10,
        path: 'lowerpayment',
        component: _import('admin/lowerPayment/index'),
        name: 'lowerpayment',
        meta: {
          title: 'lowerpayment',
          icon: 'example'
        }
      },
      {
        menuId: 11,
        path: 'lowerpayment/:lowerid',
        component: _import('admin/lowerPaymentDetail/index'),
        name: 'lowerpaymentdetail',
        hidden: true,
        meta: {
          title: 'lowerpaymentdetail',
          icon: 'example'
        }
      },
      {
        menuId: 12,
        path: 'invoice',
        component: _import('admin/invoice/index'),
        name: 'invoice',
        meta: {
          title: 'invoice',
          icon: 'example'
        }
      },
      {
        menuId: 13,
        path: 'invoice/:invoiceid',
        component: _import('admin/invoiceDetail/index'),
        name: 'invoice_detail',
        hidden: true,
        meta: {
          title: 'invoice_detail',
          icon: 'example'
        }
      },
      {
        menuId: 14,
        hidden: true,
        path: 'role',
        component: _import('admin/role/index'),
        name: 'menu_role',
        meta: {
          title: 'menu_role',
          icon: 'role'
        }
      }
    ]
  },
  {
    menuId: 15,
    path: '/admin',
    component: Layout,
    name: 'monitor_system',
    hidden: false,
    redirect: 'noredirect', // == /admin/user
    meta: {
      title: 'monitor_system',
      icon: 'table'
    },
    children: [
      {
        menuId: 16,
        path: 'location',
        component: _import('admin/truckLocation/index'),
        name: 'truck_location',
        meta: {
          title: 'truck_location',
          icon: 'example'
        }
      },
      {
        menuId: 17,
        path: 'orther/:ledgerid',
        component: _import('example/orther/index'),
        name: 'menu_map',
        hidden: true,
        meta: {
          title: 'menu_map',
          icon: 'example'
        }
      },
      {
        menuId: 18,
        path: 'upperabnormal',
        component: _import('admin/upperAbnormal/index'),
        name: 'upperabnormal',
        meta: {
          title: 'upperabnormal',
          icon: 'example'
        }
      },
      {
        menuId: 19,
        path: 'lowerabnormal',
        component: _import('admin/lowerAbnormal/index'),
        name: 'lowerabnormal',
        meta: {
          title: 'lowerabnormal',
          icon: 'example'
        }
      }
    ]
  },
  {
    menuId: 20,
    path: '/system',
    component: Layout,
    name: 'system_mgmt',
    hidden: false,
    redirect: 'noredirect', // == /admin/user
    meta: {
      title: 'system_mgmt',
      icon: 'table'
    },
    children: [
      {
        menuId: 21,
        path: 'account_mgmt',
        component: _import('admin/accountMgmt/index'),
        name: 'account_mgmt',
        meta: {
          title: 'account_mgmt',
          icon: 'example'
        }
      },
      {
        menuId: 22,
        path: 'location_rule',
        component: _import('admin/locationRule/index'),
        name: 'location_rule',
        meta: {
          title: 'location_rule',
          icon: 'example'
        }
      },
      {
        menuId: 23,
        path: 'user',
        component: _import('admin/user/index'),
        name: 'new_account',
        hidden: true,
        meta: {
          title: 'new_account',
          icon: 'example'
        }
      },
      {
        menuId: 24,
        path: 'user',
        component: _import('admin/user/index'),
        name: 'edit_account',
        hidden: true,
        meta: {
          title: 'edit_account',
          icon: 'example'
        }
      },
      {
        menuId: 25,
        path: 'user',
        component: _import('admin/user/index'),
        name: 'permission_mgmt',
        hidden: true,
        meta: {
          title: 'permission_mgmt',
          icon: 'example'
        }
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]
