const exampleData = {
  grid: {
    top: 15,
    right: 15,
    bottom: 20,
    left: 30,
  },
  tooltip: {},
  series: [
    {
      type: 'wordCloud',
      sizeRange: [12, 40],
      rotationRange: [0, 0],
      rotationStep: 45,
      gridSize: Math.random() * 20 + 5,
      shape: 'circle',
      width: '100%',
      height: '100%',
      textStyle: {
        fontFamily: 'sans-serif',
        fontWeight: 'bold',
        color: function () {
          return `rgb(${[
            Math.round(Math.random() * 160),
            Math.round(Math.random() * 160),
            Math.round(Math.random() * 160),
          ].join(',')})`;
        },
      },
      data: [
        { name: 'vue-next-admin', value: 520 },
        { name: 'lyt', value: 520 },
        { name: 'next-admin', value: 500 },
        { name: '更名', value: 420 },
        { name: '智慧农业', value: 520 },
        { name: '男神', value: 2.64 },
        { name: '好身材', value: 4.03 },
        { name: '校草', value: 24.95 },
        { name: '酷', value: 4.04 },
        { name: '时尚', value: 5.27 },
        { name: '阳光活力', value: 5.8 },
        { name: '初恋', value: 3.09 },
        { name: '英俊潇洒', value: 24.71 },
        { name: '霸气', value: 6.33 },
        { name: '腼腆', value: 2.55 },
        { name: '蠢萌', value: 3.88 },
        { name: '青春', value: 8.04 },
        { name: '网红', value: 5.87 },
        { name: '萌', value: 6.97 },
        { name: '认真', value: 2.53 },
        { name: '古典', value: 2.49 },
        { name: '温柔', value: 3.91 },
        { name: '有个性', value: 3.25 },
        { name: '可爱', value: 9.93 },
        { name: '幽默诙谐', value: 3.65 },
      ],
    },
  ],
};
const baseOption = {
  title: {
    text: 'Word-Cloud-Demo',
  },
  tooltip: {
    trigger: 'axis',
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true,
  },
};

export default (isExample = false, data = {}) => {
  return Object.assign({}, baseOption, isExample ? exampleData : data);
};
