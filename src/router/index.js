import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

/* Layout 页面容器*/
// import Layout from "@/component/layout/index.vue";


export const constantRoutes = [
  {
    path: "/login",
    component: resolve => require(["@/views/login/index", resolve]),
    meta: { noAuth: true },
    hidden: true
  },

  {
    path: "/404",
    component: resolve => require(["@/views/404", resolve]),
    meta: { noAuth: true },
    hidden: true
  },
  {
    path: "/home",
    // component: Layout,
    redirect: "/home/demo",
    name: "Home",
    meta: { title: "home", icon: "home", noAuth: true },
    children: [
      {
        path: "demo",
        name: "Demo",
        component: resolve => require(["@/views/demo/index", resolve]),
        meta: { title: "demo", icon: "demo" }
      },
      {
        path: "demo2",
        name: "demo2",
        component: resolve => require(["@/views/demo2/index", resolve]),
        meta: { title: "demo2", icon: "demo2" }
      }
    ]
  },
  // 404 page must be placed at the end !!!
  { path: "*", redirect: "/404", hidden: true }
];

const createRouter = () => new Router({
  // mode: "history", // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
});

const router = createRouter();

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher; // reset router
}


router.beforeEach((to, form, next) => {
  // 判断该路由是否需要先登录
  if (!to.meta.noAuth) {
    if (window.sessionStorage.getItem("token")) { // 获取当前的token是否存在
      next();
    }
    else {
      next({
        path: "/login",
        query: { redirect: to.fullPath } // 将跳转的路由path作为参数，登录成功后跳转到该路由
      });
    }
  }
  else {
    next();
  }
 
  if (!to.matched.length) {
    next({
      path: "/error/404",
      replace: true
    });
  } else {
    next();
  }
});

export default router;