<template>
  <div class="home-component">
    <div class="home-box">
      <nav-list :navList="navList"></nav-list>
    </div>
  </div>
</template>

<script>
export default {
  name: '',
  props: {},
  components: {
    NavList: () => import('@/components/NavList')
  },
  data() {
    return {
      navList: [
        {
          label: '入门',
          list: [
            {
              label: '入门',
              path: '/three/introduction/introduction'
            },
            {
              label: '周期性渲染',
              path: '/three/introduction/renderCycle'
            },
            {
              label: '鼠标控制三维场景',
              path: '/three/introduction/orbitControls'
            },
            {
              label: '世界坐标',
              path: '/three/introduction/coordinate'
            },
          ]
        },
        {
          label: '光源',
          list: [
            {
              label: '光源',
              path: '/three/light/light'
            },
          ]
        },
        {
          label: 'Geometry',
          list: [
            {
              label: '几何网格模型',
              path: '/three/geometry/mesh'
            },
            {
              label: '旋转的多面体',
              path: '/three/geometry/rotationPolyhedron'
            },
            {
              label: '旋转的木箱',
              path: '/three/geometry/rotationWoodenCase'
            },
            {
              label: '行星运动',
              path: '/three/geometry/planetaryMotion'
            }
          ]
        },
        {
          label: 'BufferGeometry',
          list: [
            {
              label: '顶点',
              path: '/three/bufferGeometry/peak'
            }
          ]
        },
        {
          label: '点线面模型',
          list: [
            {
              label: '点线面模型',
              path: '/three/pointLineMesh/pointLineMesh'
            },
          ]
        },
        {
          label: '层级模型',
          list: [
            {
              label: '层级模型',
              path: '/three/group/group'
            },
          ]
        },
        {
          label: '材质',
          list: [
            {
              label: '材质',
              path: '/three/material/material'
            }
          ]
        },
        {
          label: '纹理贴图',
          list: [
            {
              label: '纹理贴图',
              path: '/three/map/map'
            },
            {
              label: '纹理对象Texture',
              path: '/three/map/texture'
            },
            {
              label: '凹凸贴图、法线贴图',
              path: '/three/map/normalMap'
            },
            {
              label: '高光贴图',
              path: '/three/map/specularMap'
            },
            {
              label: '环境贴图',
              path: '/three/map/ambientMap'
            },
          ]
        },
        {
          label: '曲线',
          list: [
            {
              label: '圆弧、直线',
              path: '/three/curve/curve'
            },
            {
              label: '样条曲线、贝塞尔曲线',
              path: '/three/curve/bezierCurve'
            },
            {
              label: '组合曲线',
              path: '/three/curve/groupCurve'
            },
            {
              label: '曲线路径管道',
              path: '/three/curve/curvePipeline'
            },
            {
              label: '旋转成型',
              path: '/three/curve/rotationalMolding'
            },
            {
              label: '轮廓填充',
              path: '/three/curve/contourFilling'
            },
            {
              label: '拉伸成型',
              path: '/three/curve/stretchForming'
            },
          ]
        },
        {
          label: '粒子系统',
          list: [
            {
              label: '森林（粒子系统）',
              path: '/three/sprite/forestSprite'
            },
            {
              label: '水滴（粒子系统）',
              path: '/three/sprite/waterDropSprite'
            },
          ]
        },
        {
          label: '动画',
          list: [
            {
              label: '关键帧动画',
              path: '/three/animation/animation'
            }
          ]
        }
      ]
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
  }
}
</script>

<style lang="scss">
.home-component {
  .home-box {
    max-width: 1160px;
    padding: 20px;
    margin: 20px auto;
    background: white;
    border-radius: 8px;
    overflow: hidden;
  }
}
@media screen and (max-width: 1380px){
  .home-component {
    .home-box {
      margin: 20px 80px;
    }
  }
}
</style>
