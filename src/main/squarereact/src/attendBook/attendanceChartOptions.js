// 누적 출석률 그래프 (임시 데이터 기반)
export function attendanceChartOptions(stats) {
  return {
    chart: {
      type: 'donut',
      width: 270,
    },
    labels: ['출석', '지각', '결석'],
    series: [stats.present, stats.late, stats.absent], // 외부에서 받은 값 적용
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
                const total = w.globals.seriesTotals.reduce((a, b) => a + b, 0);
                const attendance = w.globals.seriesTotals[0];
                return `${Math.round((attendance / total) * 100)}%`;
              },
            },
          },
        },
      },
    },
    states: {
      active: { filter: { type: 'none' } },
      hover: {
        scale: 1.05,
        filter: { type: 'lighten', value: 0.05 },
      },
    },
    tooltip: {
      enabled: true,
    },
  };
}
