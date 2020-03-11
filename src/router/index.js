import Vue from 'vue'
import Router from 'vue-router'

// 解决 {_name:""NavigationDuplicated"... start
const originalPush = Router.prototype.push
Router.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}
// 解决 {_name:""NavigationDuplicated"... end

Vue.use(Router)

import Three from '@/three/Three'
import WebGL from '@/webgl/WebGL'

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      redirect: '/three'
      // component: () => import('@/three/Home/Home')
    },
    {
      path: '/three',
      name: 'Three',
      redirect: '/three/index',
      component: Three,
      children: [
        {
          path: 'index',
          name: 'ThreeIndex',
          component: () => import('@/three/Router/Router')
        },
        // 入门
        {
          path: 'introduction',
          component: Three,
          redirect: '/three/introduction/introduction',
          children: [
            {
              path: 'introduction',
              name: 'ThreeIntroductionIntroduction',
              component: () => import('@/three/Introduction/Introduction'),
            },
            {
              path: 'renderCycle',
              name: 'ThreeIntroductionRenderCycle',
              component: () => import('@/three/Introduction/RenderCycle')
            },
            {
              path: 'orbitControls',
              name: 'ThreeIntroductionOrbitControls',
              component: () => import('@/three/Introduction/OrbitControls')
            },
            {
              path: 'coordinate',
              name: 'ThreeIntroductionCoordinate',
              component: () => import('@/three/Introduction/Coordinate')
            },
          ]
        },
        // 光源
        {
          path: 'light',
          component: Three,
          redirect: '/three/light/light',
          children: [
            {
              path: 'light',
              name: 'ThreeLightLight',
              component: () => import('@/three/Light/Light')
            },
          ]
        },
        // geometry
        {
          path: 'geometry',
          component: Three,
          redirect: '/three/geometry/mesh',
          children: [
            {
              path: 'mesh',
              name: 'ThreeGeometry',
              component: () => import('@/three/Geometry/Mesh')
            },
            {
              path: 'rotationPolyhedron',
              name: 'ThreeGeometryRotationPolyhedron',
              component: () => import('@/three/Geometry/RotationPolyhedron')
            },
            {
              path: 'rotationWoodenCase',
              name: 'ThreeGeometryRotationWoodenCase',
              component: () => import('@/three/Geometry/RotationWoodenCase')
            },
            {
              path: 'planetaryMotion',
              name: 'ThreeGeometryPlanetaryMotion',
              component: () => import('@/three/Geometry/PlanetaryMotion')
            },
          ]
        },
        // bufferGeometry
        {
          path: 'bufferGeometry',
          component: Three,
          redirect: '/three/bufferGeometry/peak',
          children: [
            {
              path: 'peak',
              name: 'ThreeBufferGeometryPeak',
              component: () => import('@/three/BufferGeometry/Peak')
            },
          ]
        },
        // 点线面模型
        {
          path: 'pointLineMesh',
          component: Three,
          redirect: '/three/pointLineMesh/pointLineMesh',
          children: [
            {
              path: 'pointLineMesh',
              name: 'ThreePointLineMesh',
              component: () => import('@/three/PointLineMesh/PointLineMesh')
            }
          ]
        },
        // 层级模型
        {
          path: 'group',
          component: Three,
          redirect: '/three/group/group',
          children: [
            {
              path: 'group',
              name: 'ThreeGroupGroup',
              component: () => import('@/three/Group/Group')
            }
          ]
        },
        // 材质
        {
          path: 'material',
          component: Three,
          redirect: '/three/material/material',
          children: [
            {
              path: 'material',
              name: 'ThreeMaterialMaterial',
              component: () => import('@/three/Material/Material')
            }
          ]
        },
        // 纹理贴图
        {
          path: 'map',
          component: Three,
          redirect: '/three/map/map',
          children: [
            {
              path: 'map',
              name: 'ThreeMapMap',
              component: () => import('@/three/Map/Map')
            },
            {
              path: 'texture',
              name: 'ThreeMapTexture',
              component: () => import('@/three/Map/Texture')
            },
            {
              path: 'normalMap',
              name: 'ThreeMapNormalMap',
              component: () => import('@/three/Map/NormalMap')
            },
            {
              path: 'specularMap',
              name: 'ThreeMapSpecularMap',
              component: () => import('@/three/Map/SpecularMap')
            },
            {
              path: 'ambientMap',
              name: 'ThreeMapAmbientMap',
              component: () => import('@/three/Map/AmbientMap')
            },
          ]
        },
        // 曲线
        {
          path: 'curve',
          component: Three,
          redirect: '/three/curve/curve',
          children: [
            {
              path: 'curve',
              name: 'ThreeCurveCurve',
              component: () => import('@/three/Curve/Curve')
            },
            {
              path: 'bezierCurve',
              name: 'ThreeCurveBezierCurve',
              component: () => import('@/three/Curve/BezierCurve')
            },
            {
              path: 'groupCurve',
              name: 'ThreeCurveGroupCurve',
              component: () => import('@/three/Curve/GroupCurve')
            },
            {
              path: 'curvePipeline',
              name: 'ThreeCurvePipeline',
              component: () => import('@/three/Curve/CurvePipeline')
            },
            {
              path: 'rotationalMolding',
              name: 'ThreeCurveRotationalMolding',
              component: () => import('@/three/Curve/RotationalMolding')
            },
            {
              path: 'contourFilling',
              name: 'ThreeCurveContourFilling',
              component: () => import('@/three/Curve/ContourFilling')
            },
            {
              path: 'stretchForming',
              name: 'ThreeCurveStretchForming',
              component: () => import('@/three/Curve/StretchForming')
            },
          ]
        },
        // 粒子系统
        {
          path: 'sprite',
          component: Three,
          redirect: '/three/sprite/forestSprite',
          children: [
            {
              path: 'forestSprite',
              name: 'ThreeSpriteForestSprite',
              component: () => import('@/three/Sprite/ForestSprite')
            },
            {
              path: 'waterDropSprite',
              name: 'ThreeSpriteWaterDropSprite',
              component: () => import('@/three/Sprite/WaterDropSprite')
            },
          ]
        },
        {
          path: 'animation',
          component: Three,
          redirect: '/three/animation/animation',
          children: [
            {
              path: 'animation',
              name: 'ThreeAnimationAnimation',
              component: () => import('@/three/Animation/Animation')
            }
          ]
        }
      ]
    },
    {
      path: '/webgl',
      name: 'WebGL',
      redirect: '/webgl/index',
      component: WebGL,
      children: [
        {
          path: 'index',
          name: 'WebGLIndex',
          component: () => import('@/webgl/Home/Home')
        },
        {
          path: 'introduction',
          name: 'WebGLIntroduction',
          component: () => import('@/webgl/Introduction/Introduction')
        },
        {
          path: 'rectangle',
          name: 'WebGLRectangle',
          component: () => import('@/webgl/Rectangle/Rectangle')
        },
        {
          path: 'axes',
          name: 'WebGLAxes',
          component: () => import('@/webgl/Axes/Axes')
        },
        {
          path: 'translate',
          name: 'WebGLTranslate',
          component: () => import('@/webgl/Translate/Translate')
        },
        {
          path: 'rotate',
          name: 'WebGLRotate',
          component: () => import('@/webgl/Rotate/Rotate')
        },
        {
          path: 'vertices',
          name: 'WebGLVertices',
          component: () => import('@/webgl/VerticesDraw/VerticesDraw')
        },
        {
          path: 'color',
          name: 'WebGLColor',
          component: () => import('@/webgl/Color/Color')
        },
        {
          path: 'triangle',
          name: 'WebGLTriangle',
          component: () => import('@/webgl/Triangle/Triangle')
        },
        {
          path: 'colorRectangle',
          name: 'WebGLColorRectangle',
          component: () => import('@/webgl/ColorRectangle/ColorRectangle')
        },
        {
          path: 'parallelLight',
          name: 'WebGLParallelLight',
          component: () => import('@/webgl/ParallelLight/ParallelLight')
        }
      ]
    }
  ]
})
