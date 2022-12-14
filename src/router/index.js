import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

/* Layout */
import Layout from "@/layout";

/* Router Modules */
// import componentsRouter from './modules/components'
// import chartsRouter from './modules/charts'
// import userRouter from './modules/user'
// import nestedRouter from './modules/nested'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */
/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: "/redirect",
    component: Layout,
    hidden: true,
    children: [
      {
        path: "/redirect/:path(.*)",
        component: () => import("@/views/redirect/index")
      }
    ]
  },

  {
    path: "/login",
    component: () => import("@/views/login/index"),
    hidden: true
  },
  {
    path: "/auth-redirect",
    component: () => import("@/views/login/auth-redirect"),
    hidden: true
  },
  {
    path: "/",
    component: Layout,
    redirect: "/dashboard",
    children: [
      {
        path: "dashboard",
        component: () => import("@/views/dashboard/index"),
        name: "Dashboard",
        meta: {
          title: "??????",
          icon: "dashboard",
          affix: true, // ???????????????true?????????????????????tags-view???(?????? false)
          noCache: true // ???????????????true??????????????? <keep-alive> ??????(?????? false)
        }
      }
    ]
  },
  {
    path: "/user",
    component: Layout,
    redirect: "/user",
    name: "user",
    meta: {
      title: "????????????",
      icon: "user"
    },
    children: [
      {
        path: "/userList",
        component: () => import("@/views/user/list"),
        name: "userList",
        meta: {
          title: "????????????",
          icon: "user"
        }
      }
    ]
  },
  {
    path: "/seat",
    component: Layout,
    redirect: "/seat",
    name: "seat",
    meta: {
      title: "????????????",
      icon: "book"
    },
    children: [
      {
        path: "seatList",
        component: () => import("@/views/seat/list"),
        name: "seatList",
        meta: {
          title: "????????????",
          icon: "list"
        }
      }
    ]
  },
  {
    path: "/comment",
    component: Layout,
    redirect: "/comment",
    name: "comment",
    meta: {
      title: "????????????",
      icon: "book"
    },
    children: [
      {
        path: "commentList",
        component: () => import("@/views/comment/list"),
        name: "bookList",
        meta: {
          title: "????????????",
          icon: "list"
        }
      }
    ]
  },
  {
    path: "/book",
    component: Layout,
    redirect: "/book",
    name: "book",
    meta: {
      title: "????????????",
      icon: "book"
    },
    children: [
      {
        path: "/bookList",
        component: () => import("@/views/book/list"),
        name: "bookList",
        meta: {
          title: "????????????",
          icon: "list"
        }
      },
      {
        path: "/bookClass",
        component: () => import("@/views/book/class"),
        name: "bookClass",
        meta: {
          title: "????????????",
          icon: "book"
        }
      },
      {
        path: "/shelfList",
        component: () => import("@/views/book/shelf"),
        name: "shelfList",
        meta: {
          title: "????????????",
          icon: "shujia"
        }
      }
    ]
  },
  {
    path: "/imagelist",
    component: Layout,
    redirect: "/imagelist",
    name: "book",
    meta: {
      title: "????????????",
      icon: "book"
    },
    children: [
      {
        path: "imagelist",
        component: () => import("@/views/imageList/list"),
        name: "bookList",
        meta: {
          title: "????????????",
          icon: "list"
        }
      }
    ]
  },
  {
    path: "/order",
    component: Layout,
    redirect: "orderList",
    name: "order",
    meta: {
      title: "????????????",
      icon: "order"
    },
    children: [
      {
        path: "orderList",
        component: () => import("@/views/order/order"),
        name: "viporderList",
        meta: {
          title: "????????????",
          icon: "order"
        }
      },
      {
        path: "Recharge",
        component: () => import("@/views/order/order"),
        name: "Recharge",
        meta: {
          title: "????????????",
          icon: "chongzhi"
        }
      },
      {
        path: "queueorder",
        component: () => import("@/views/order/queueorder"),
        name: "queueorder",
        meta: {
          title: "????????????",
          icon: "order"
        }
      }
    ]
  },
  // {
  //     path: "/product",
  //     component: Layout,
  //     redirect: "/productList",
  //     name: "product",
  //     meta: {
  //         title: "????????????",
  //         icon: "list"
  //     },
  //     children: [{
  //             path: "/productList",
  //             component: () =>
  //                 import ("@/views/product/list"),
  //             name: "productList",
  //             meta: {
  //                 title: "????????????",
  //                 icon: "list"
  //             }
  //         },
  //         {
  //             path: "/productList",
  //             component: () =>
  //                 import ("@/views/product/list"),
  //             name: "productList",
  //             meta: {
  //                 title: "????????????",
  //                 icon: "list"
  //             }
  //         },
  //     ]
  // },

  {
    path: "/seting",
    component: Layout,
    redirect: "/seting",
    name: "set",
    meta: {
      title: "????????????",
      icon: "set"
    },
    children: [
      {
        path: "create",
        component: () => import("@/views/sysseting/add"),
        name: "createUser",
        meta: {
          title: "????????????",
          icon: "add"
        }
      },
      {
        path: "edit",
        component: () => import("@/views/sysseting/edit"),
        name: "Edit",
        meta: {
          title: "????????????",
          icon: "edit"
        }
      }
    ]
  },
  {
    path: "*",
    redirect: "/",
    hidden: true
  }
];
/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  // 404 page must be placed at the end !!!
  // {
  //     path: "*",
  //     redirect: "/404",
  //     hidden: true
  // }
];

const createRouter = () =>
  new Router({
    // require service support
    mode: "history",
    scrollBehavior: () => ({
      y: 0
    }),
    // base: "/bookadmin", // ??????????????? ?????????????????????
    routes: constantRoutes
  });

const router = createRouter();

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher; // reset router
}

export default router;
