<template>
  <div class="rotation-polyhedron-component">
    <canvas id="canvasContext"></canvas>
  </div>
</template>

<script>
import OrbitControls from "three/examples/js/controls/OrbitControls";
import { ConvexBufferGeometry } from "three/examples/jsm/geometries/ConvexGeometry.js";
import { mapState } from 'vuex';
let group = null;
export default {
  name: "",
  props: {},
  components: {},
  data() {
    return {
      s: 300
    }
  },
  computed: {
    ...mapState({
      screenWidth: state => state.home.screenWidth,
      screenHeight: state => state.home.screenHeight
    })
  },
  watch: {
    screenHeight: function(val, oldval) {
      this.canvasResize()
    },
    screenWidth: function(val, oldval) {
      this.canvasResize()
    }
  },
  created() {
    group = null;
  },
  mounted() {
    this.initThree()
  },
  methods: {
    initThree() {
      this.initScene();
      this.initLight();
      this.initCamera();
      this.initRenderer();
      this.initControls();
      this.initAxesHelper();
      this.createMesh();
      this.render();
    },
    // 1、初始化场景
    initScene () {
      window.scene = new THREE.Scene();
    },
    // 2、初始化灯光
    initLight () {
      // 点光源
      let point = new THREE.PointLight(0xffffff);
      point.position.set(400, 200, 300); //点光源位置
      scene.add(point); //点光源添加到场景中
      // 环境光
      let ambient = new THREE.AmbientLight(0x444444);
      scene.add(ambient);
    },
    // 3、初始化相机
    initCamera () {
      let k = this.screenWidth / this.screenHeight; // 窗口宽高比
      window.camera = new THREE.PerspectiveCamera( 40, k, 1, 1000 );
      camera.position.set( 15, 20, 30 );
      camera.lookAt(scene.position); // 设置相机方向（指向的场景对象）
      scene.add( camera );
    },
    // 4、创建渲染器
    initRenderer () {
      window.renderer = new THREE.WebGLRenderer({
        canvas: document.getElementById('canvasContext')
      });
      renderer.setSize(this.screenWidth, this.screenHeight); // 设置渲染区域的宽高
      renderer.setClearColor(0x000000, 0.5); // 设置背景颜色
    },
    // 初始化控制器
    initControls() {
      // 创建控件对象
      window.controls = new THREE.OrbitControls(camera, renderer.domElement);
      // controls.addEventListener('change', this.render)
    },
    // 初始化辅助坐标系
    initAxesHelper () {
      // 辅助坐标系  参数250表示坐标系大小，可以根据场景大小去设置
      let axisHelper = new THREE.AxesHelper(30);
      scene.add(axisHelper);
    },
    // 执行渲染
    render () {
      group.rotation.y += 0.005;
      renderer.render(scene, camera);
      requestAnimationFrame(this.render)
    },
    // 窗口大小变换重新进行绘制
    canvasResize() {
      let s = this.s;
      let width = document.documentElement.clientWidth;
      let height = document.documentElement.clientHeight;
      // 重新渲染canvas尺寸
      renderer.setSize(width, height);
      // 重置相机投影的相关参数
      let k = width/height; // 窗口宽高比
      camera.left = -s*k;
      camera.right = s*k;
      camera.top = s;
      camera.bottom = -s;
      // 渲染器执行render方法的时候会读取相机对象的投影矩阵属性projectionMatrix
      // 但是不会每渲染一帧，就通过相机的属性计算投影矩阵(节约计算资源)
      // 如果相机的一些属性发生了变化，需要执行updateProjectionMatrix ()方法更新相机的投影矩阵
      camera.updateProjectionMatrix ();
    },
    createMesh() {
      // texture
      let loader = new THREE.TextureLoader();
      let texture = loader.load('../../../static/img/textures/sprites/disc.png');
      group = new THREE.Group();
      scene.add(group);

      // points
      let vertices = new THREE.DodecahedronGeometry(10).vertices; // 十二面体
      // for ( var i = 0; i < vertices.length; i ++ ) {
      //   console.log(vertices[ i ])
      //   // vertices[ i ].add( randomPoint().multiplyScalar( 2 ) ); // wiggle the points
      // }
      let pointsMaterial = new THREE.PointsMaterial( {
        color: 0x0080ff,
        map: texture,
        size: 1,
        alphaTest: 0.5
      });
      let pointsGeometry = new THREE.BufferGeometry().setFromPoints(vertices);
      // console.log(pointsGeometry.attributes.position)
      let points = new THREE.Points(pointsGeometry, pointsMaterial);
      group.add(points);

      // convex hull
      let meshMaterial = new THREE.MeshLambertMaterial( {
        color: 0xffffff,
        opacity: 0.5,
        transparent: true
      });

      let meshGeometry = new ConvexBufferGeometry( vertices );

      let mesh = new THREE.Mesh( meshGeometry, meshMaterial );
      mesh.material.side = THREE.BackSide; // back faces
      mesh.renderOrder = 0; // 指定渲染顺序
      group.add( mesh );

      mesh = new THREE.Mesh( meshGeometry, meshMaterial.clone() );
      mesh.material.side = THREE.FrontSide; // front faces
      mesh.renderOrder = 0; // 指定渲染顺序
      group.add( mesh );
    }
  }
}
</script>

<style lang="scss">
</style>
