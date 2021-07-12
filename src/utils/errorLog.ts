import Vue, { nextTick } from 'vue';
import { isString, isArray } from 'lodash-es';
import settings from '@/settings';

// you can set in settings.js
// errorLog:'production' | ['production', 'development']
const { errorLog: needErrorLog } = settings;

function checkNeed() {
  const env = import.meta.env.NODE_ENV;
  if (isString(needErrorLog)) {
    return env === needErrorLog;
  }
  if (isArray(needErrorLog)) {
    return needErrorLog.includes(env as string);
  }
  return false;
}

const errorHandler = (err: any, vm: any, info: any) => {
  const checkError = checkNeed();
  if (!checkError) return;
  nextTick(() => {
    // TODO: 项目统一容错处理
    console.error(err, info);
  });
};

export default errorHandler;
