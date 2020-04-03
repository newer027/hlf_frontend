<template>
       
  <div :class="className" :style="{height:height,width:width}" />

</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'
import { mapGetters } from 'vuex'

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    abnormal_percent: Number,
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '260px'
    }
  },
  data() {
    return {
      chart: null,
      labelTop: {
        normal: {
          label: {
            show: true,
            position: 'center',
            formatter: '{b}',
            textStyle: {
              baseline: 'bottom'
            }
          },
          labelLine: {
            show: false
          }
        }
      },
      labelFromatter: {
        normal: {
          label: {
            formatter: function(params) {
              return 100 - params.value + '%'
            },
            textStyle: {
              baseline: 'top'
            }
          }
        }
      },
      labelBottom: {
        normal: {
          color: '#ccc',
          label: {
            show: true,
            position: 'center'
          },
          labelLine: {
            show: false
          }
        },
        emphasis: {
          color: 'rgba(0,0,0,0)'
        }
      },
      radius: [40, 55]
    }
  },
  mounted() {
    this.$nextTick().then(() => {
      this.initChart()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  computed: {
    ...mapGetters([
      'locationNg'
    ])
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      console.log(this.abnormal_percent)
      this.chart.setOption({
        legend: {
          x: 'center',
          y: 'center'
        },
        title: {
          x: 'center'
        },
        toolbox: {
          show: true,
          feature: {
            dataView: { show: true, readOnly: false },
            magicType: {
              show: true,
              type: ['pie', 'funnel'],
              option: {
                funnel: {
                  width: '33%',
                  height: '80%',
                  itemStyle: {
                    normal: {
                      label: {
                        formatter: function(params) {
                          return 'other\n' + params.value + '%\n'
                        },
                        textStyle: {
                          baseline: 'middle'
                        }
                      }
                    }
                  }
                }
              }
            },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        series: [
          {
            type: 'pie',
            center: ['17%', '25%'],
            radius: this.radius,
            x: '0%', // for funnel
            itemStyle: this.labelFromatter,
            data: [
              { name: 'other', value: 100 - this.abnormal_percent, itemStyle: this.labelBottom },
              { name: '定位', value: this.abnormal_percent, itemStyle: this.labelTop }
            ]
          },
          {
            type: 'pie',
            center: ['50%', '25%'],
            radius: this.radius,
            x: '33%', // for funnel
            itemStyle: this.labelFromatter,
            data: [
              { name: 'other', value: 100, itemStyle: this.labelBottom },
              { name: '资质', value: 0, itemStyle: this.labelTop }
            ]
          },
          {
            type: 'pie',
            center: ['83%', '25%'],
            radius: this.radius,
            x: '66%', // for funnel
            itemStyle: this.labelFromatter,
            data: [
              { name: 'other', value: 100, itemStyle: this.labelBottom },
              { name: '合同', value: 0, itemStyle: this.labelTop }
            ]
          },
          {
            type: 'pie',
            center: ['17%', '75%'],
            radius: this.radius,
            x: '0%', // for funnel
            itemStyle: this.labelFromatter,
            data: [
              { name: 'other', value: 100, itemStyle: this.labelBottom },
              { name: '资金流', value: 0, itemStyle: this.labelTop }
            ]
          },
          {
            type: 'pie',
            center: ['50%', '75%'],
            radius: this.radius,
            x: '33%', // for funnel
            itemStyle: this.labelFromatter,
            data: [
              { name: 'other', value: 100, itemStyle: this.labelBottom },
              { name: '运价', value: 0, itemStyle: this.labelTop }
            ]
          },
          {
            type: 'pie',
            center: ['83%', '75%'],
            radius: this.radius,
            x: '66%', // for funnel
            itemStyle: this.labelFromatter,
            data: [
              { name: 'other', value: 100, itemStyle: this.labelBottom },
              { name: '其他', value: 0, itemStyle: this.labelTop }
            ]
          }
        ]
      })
    }
  }
}
</script>


