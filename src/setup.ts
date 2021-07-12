import ElementPlus from 'element-plus';
import router from '@/router';
import store from '@/store';
import { App } from 'vue';
import VChart from 'vue-echarts';
import SvgIcon from '@/components/SvgIcon/index.vue';

import errorLog from '@/utils/errorLog';
import '@/echarts';
import '@/permission';
// SVG 雪碧图 TODO: SVGO 压缩
import 'virtual:svg-icons-register';

import { dragDialog, permission, draggable } from '@/directive';

import 'element-plus/packages/theme-chalk/src/index.scss';
import '@/styles/index.scss';

export default (app: App) => {
  app.use(router).use(store).use(ElementPlus);
  app.component('SvgIcon', SvgIcon).component('VChart', VChart);
  app.directive('dragDialog', dragDialog).directive('draggable', draggable).directive('permission', permission);
  app.config.errorHandler = errorLog;
  return app;
};
