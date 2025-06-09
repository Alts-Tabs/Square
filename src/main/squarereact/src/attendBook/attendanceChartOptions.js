// 누적 출석률 그래프 (임시 데이터 기반)
export const attendanceChartOptions = {
  chart: {
    type: 'donut',
    width: 270,
  },
  labels: ['출석', '지각', '결석'],
  series: [12, 2, 1], // 임시 데이터
  colors: ['#79D7BE', '#FFB83C', '#D85858'],
  legend: {
    show: false,
  },
  plotOptions: {
    pie: {
      expandOnClick: false,
      donut: {
        labels: {
          show: true,
          total: {
            show: true,
            label: '출석률',
            formatter: function (w) {
                const series = w.globals.seriesTotals;
                const total = series.reduce((a, b) => a + b, 0);
                const attendance = series[0]; // 출석 수
                return `${Math.round((attendance / total) * 100)}%`;
            },
          },
        },
      },
    },
  },
  states: {
    active: {
      filter: { type: 'none' },
    },
    hover: {
      scale: 1.05,
      filter: {
        type: 'lighten',
        value: 0.05,
      },
    },
  },
  tooltip: {
    enabled: true,
  },
};
