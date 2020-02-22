<template>
  <div class="render-cycle-component" id="render-cycle-component"></div>
</template>

<script>
import * as THREE from 'three';
let scene = null;
let camera = null;
let renderer = null;
export default {
  name: "",
  props: {},
  components: {},
  data() {
    return {}
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    this.initThree()
  },
  methods: {
    initThree() {
      // 1、创建场景对象
      scene = new THREE.Scene();

      // 2、创建网络模型
      let geometry = new THREE.BoxGeometry(100, 100, 100); // 创建一个立方体的几何对象Geometry
      let material = new THREE.MeshLambertMaterial({ // 创建一种材质Material
        color: 0x00ff00
      });
      let mesh = new THREE.Mesh(geometry, material); // 网格模型对象Mesh
      scene.add(mesh); // 将网格模型添加到场景中

      // 3、创建光源
      // 点光源
      let point = new THREE.AmbientLight(0xffffff);
      scene.add(point);
      // 环境光
      let ambient = new THREE.AmbientLight(0x444444);
      scene.add(ambient);

      // 4、创建相机
      let width = window.innerWidth;
      let height = window.innerHeight;
      let k = width / height; // 窗口宽高比
      let s = 300; // 三维场景显示范围控制系数，系数越大，显示的范围越大
      camera = new THREE.OrthographicCamera(-s*k, s*k, s, -s, 1, 1000);
      camera.position.set(200, 300, 200); // 设置相机位置
      camera.lookAt(scene.position); // 设置相机方向（指向的场景对象）

      // 5、创建渲染器
      renderer = new THREE.WebGLRenderer();
      renderer.setSize(width, height); // 设置渲染区域的宽高
      renderer.setClearColor(0xb9d3ff, 1); // 设置背景颜色
      let box = document.getElementById('render-cycle-component');
      box.appendChild(renderer.domElement); //body元素中插入canvas对象

      // 6、执行渲染操作
      renderer.render(scene, camera);

      //间隔20ms周期性调用函数fun,20ms也就是刷新频率是50FPS(1s/20ms)，每秒渲染50次
      // setInterval(render,20);
      render()

      // 渲染函数
      let TO = new Date();
      function render() {
        let T1 = new Date(); // 本次时间
        let t = T1-T0; // 时间差
        T0 = T1; // 把本次时间赋值给上次时间
        renderer.render(scene, camera);
        mesh.rotateY(0.01*t); // 每次绕y轴旋转0.01弧度
        requestAnimationFrame(render)
      }
    }
  }
}
</script>

<style lang="scss">
</style>
