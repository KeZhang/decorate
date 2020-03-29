// const _ = require('loadash')
const getCategory = (list, filed) => {
  const ret = {};
  list.forEach((d) => {
    const item = ret[d[filed]]
    if (item) {
      item.value += parseInt(d['价格']);
    } else {
      ret[d[filed]] = {
        name: d[filed],
        value: parseInt(d['价格']),
        priority: d['优先级']
      }
    }
  })
  return Object.keys(ret).map((k) => {
    const item = ret[k];
    return {
      name: item.name,
      value: item.value,
      priority: item.priority
    }
  })
}

const getData = (list) => {
  console.log(list)
  const namelist = _.groupBy(list, "名称")
  const namelistKV = getCategory(list, "名称")
  const roomlistKV = getCategory(list, "房间")
  const priorlistKV = getCategory(list, "优先级")
  const total = namelistKV.reduce((p, c) => p + c.value, 0)
  return {
    tooltip: {
      trigger: 'item',
      // formatter: '{a}-{a0}',
      formatter: function (d, t) {
        // console.log('d', JSON.stringify(d))
        // console.log('t', JSON.stringify(t))

        if (d.seriesName !== '优先级') {
          return `${d.name}-${d.data.priority}
          <br/>${d.seriesName}: ${d.value} (${d.percent}%)`;
        } else {

          return `${d.name} (共计 ${total} )
          <br/>${d.seriesName}: ${d.value} (${d.percent}%)`;
        }


      }
    },
    legend: {
      orient: 'vertical',
      left: 10,
      data: namelist
    },
    series: [
      {
        name: '优先级',
        type: 'pie',
        selectedMode: 'single',
        radius: [0, '20%'],

        label: {
          position: 'inner'
        },
        labelLine: {
          show: false
        },
        data: priorlistKV
      },
      {
        name: '房间',
        type: 'pie',
        selectedMode: 'single',
        radius: ['25%', '40%'],

        label: {
          position: 'inner'
        },
        labelLine: {
          show: false
        },
        data: roomlistKV
      },
      {
        name: '明细',
        type: 'pie',
        radius: ['50%', '65%'],
        data: namelistKV
      }
    ]
  };
};

fetch('./data.json?v=' + Date.now())
  .then(res => res.json())
  .then((list) => {
    echarts.init(document.getElementById('main')).setOption(getData(list));
  })

