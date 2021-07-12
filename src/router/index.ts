import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import constantRoutes from './contantRoute';
import asyncRoutes from './asyncRoute';

/**
 * 创建一个可以被 Vue 应用程序使用的路由实例
 * @method createRouter(options: RouterOptions): Router
 * @link 参考：https://next.router.vuejs.org/zh/api/#createrouter
 */
const router = createRouter({
  history: createWebHistory(),
  routes: constantRoutes,
  scrollBehavior: () => ({ top: 0 }),
});

// 导出路由
export { constantRoutes, asyncRoutes };
export default router;
