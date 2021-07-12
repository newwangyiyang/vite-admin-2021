declare module '*.vue' {
  import { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

interface Window {
  nextLoading: boolean;
}

declare module 'path-browserify';

declare module 'sortablejs';
