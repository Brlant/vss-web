import Vue from 'vue';
import VueRouter from 'vue-router';
import routes from './route';

Vue.use(VueRouter);
//  不需要鉴权的路径
// const permissive = ['/login', '/404', '/500'];

const router = new VueRouter({
  //  mode: 'history',
  routes: routes,
  base: '/'
});

export default router;
