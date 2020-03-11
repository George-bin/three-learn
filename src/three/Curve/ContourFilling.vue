<template>
  <div class="contour-filling-component">
    <canvas id="canvasContext"></canvas>
  </div>
</template>

<script>
import OrbitControls from "three/examples/js/controls/OrbitControls";
import { mapState } from 'vuex';
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
    window.renderer = null;
    window.scene = null;
    window.camera = null;
    window.controls = null;
  },
  mounted() {
    this.initThree()
  },
  destroyed() {
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
      let s = 300; // 三维场景显示范围控制系数，系数越大，显示的范围越大
      window.camera = new THREE.OrthographicCamera(-s*k, s*k, s, -s, 1, 1000);
      camera.position.set(200, 300, 200); // 设置相机位置
      camera.lookAt(scene.position); // 设置相机方向（指向的场景对象）
    },
    // 4、创建渲染器
    initRenderer () {
      window.renderer = new THREE.WebGLRenderer({
        canvas: document.getElementById('canvasContext')
      });
      renderer.setSize(this.screenWidth, this.screenHeight); // 设置渲染区域的宽高
      renderer.setClearColor(0xb9d3ff, 0.5); // 设置背景颜色
      renderer.shadowMap.enabled = true; // 渲染器开启阴影渲染
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
      let axisHelper = new THREE.AxesHelper(250);
      scene.add(axisHelper);
    },
    // 执行渲染
    render () {
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
      let points = [
        new THREE.Vector2(-50, -50),
        new THREE.Vector2(-60, 0),
        new THREE.Vector2(0, 50),
        new THREE.Vector2(60, 0),
        new THREE.Vector2(50, -50),
        new THREE.Vector2(-50, -50),
      ]
      // 通过顶点定义轮廓
      let shape = new THREE.Shape(points);
      // shape可以理解为一个需要填充轮廓
      // 所谓填充：ShapeGeometry算法利用顶点计算出三角面face3数据填充轮廓
      let geometry = new THREE.ShapeGeometry(shape, 25);

      let material = new THREE.MeshBasicMaterial({
        color: 0xff0000
      });
      let mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);

      // 圆弧轮廓
      let shape2 = new THREE.Shape();
      shape2.absarc(0, 0, 100, 0, 2*Math.PI);
      let geometry2 = new THREE.ShapeGeometry(shape2, 25);
      let material2 = new THREE.MeshBasicMaterial({
        color: 0xff0000
      });
      let mesh2 = new THREE.Mesh(geometry2, material2);
      mesh2.translateX(200);
      scene.add(mesh2);

      // 矩形轮廓
      // 通过shpae基类path的方法绘制轮廓（本质也是生成顶点）
      let shape3 = new THREE.Shape();
      // 四条直线绘制一个矩形轮廓
      shape3.moveTo(0,0);//起点
      shape3.lineTo(0,100);//第2点
      shape3.lineTo(100,100);//第3点
      shape3.lineTo(100,0);//第4点
      shape3.lineTo(0,0);//第5点
      let geometry3 = new THREE.ShapeGeometry(shape3, 25);
      let material3 = new THREE.MeshBasicMaterial({
        color: 0x000000
      });
      let mesh3 = new THREE.Mesh(geometry3, material3);
      mesh3.translateZ(100);
      scene.add(mesh3);

      // shape绘制轮廓1
      let shape4 = new THREE.Shape();
      let R = 50;
      // 绘制一个半径为R、圆心坐标(0, 0)的半圆弧
      shape4.absarc(0, 0, R, 0, Math.PI);
      //从圆弧的一个端点(-R, 0)到(-R, -200)绘制一条直线
      shape4.lineTo(-R, -200);
      // 绘制一个半径为R、圆心坐标(0, -200)的半圆弧
      shape4.absarc(0, -200, R, Math.PI, 2 * Math.PI);
      //从圆弧的一个端点(R, -200)到(-R, -200)绘制一条直线
      shape4.lineTo(R, 0);
      let geometry4 = new THREE.ShapeGeometry(shape4, 30);

      let material4 = new THREE.MeshBasicMaterial({
        color: 0x00ff00
      });
      let mesh4 = new THREE.Mesh(geometry4, material4);
      mesh4.translateZ(50);
      scene.add(mesh4);

      // shape绘制轮廓2
      let shape5 = new THREE.Shape();
      //外轮廓
      shape5.arc(0, 0, 100, 0, 2 * Math.PI);
      // 内轮廓1
      let path1 = new THREE.Path();
      path1.arc(0, 0, 40, 0, 2 * Math.PI);
      // 内轮廓2
      let path2 = new THREE.Path();
      path2.arc(80, 0, 10, 0, 2 * Math.PI);
      // 内轮廓3
      let path3 = new THREE.Path();
      path3.arc(-80, 0, 10, 0, 2 * Math.PI);
      //三个内轮廓分别插入到holes属性中
      shape5.holes.push(path1, path2, path3);
      let geometry5 = new THREE.ShapeGeometry(shape5, 25);
      let material5 = new THREE.MeshBasicMaterial({
        color: 0x00ff00
      });
      let mesh5 = new THREE.Mesh(geometry5, material5);
      mesh5.translateX(200);
      mesh5.translateZ(50);
      scene.add(mesh5);

      // shape绘制轮廓3
      let shape6 = new THREE.Shape();
      //外轮廓
      shape6.moveTo(0,0);//起点
      shape6.lineTo(0,100);//第2点
      shape6.lineTo(100,100);//第3点
      shape6.lineTo(100,0);//第4点
      shape6.lineTo(0,0);//第5点
      //内轮廓
      let path6 = new THREE.Path();//path对象
      path6.arc(50,50,40,0,2*Math.PI);//圆弧
      // path6.moveTo(20,20);//起点
      // path6.lineTo(20,80);//第2点
      // path6.lineTo(80,80);//第3点
      // path6.lineTo(80,20);//第4点
      // path6.lineTo(20,20);//第5点
      shape6.holes.push(path6);//设置内轮廓
      let geometry6 = new THREE.ShapeGeometry(shape6, 25);
      let material6 = new THREE.MeshBasicMaterial({
        color: 0x0000ff
      });
      let mesh6 = new THREE.Mesh(geometry6, material6);
      mesh6.translateX(200);
      mesh6.translateZ(100);
      scene.add(mesh6);

      // shape绘制轮廓4(多个轮廓同时填充)
      let shape7 = new THREE.Shape();
      shape7.arc(-50,0,30,0,2*Math.PI);
      // 轮廓对象2
      let shape8=new THREE.Shape();
      shape8.arc(50,0,30,0,2*Math.PI);
      // 轮廓对象3
      let shape9=new THREE.Shape();
      shape9.arc(0,50,30,0,2*Math.PI);
      // 多个shape作为元素组成数组,每一个shpae可以理解为一个要填充的轮廓
      let geometry7 = new THREE.ShapeGeometry([shape7,shape8,shape9], 30);
      let material7 = new THREE.MeshBasicMaterial({
        color: 0x000000
      });
      let mesh7 = new THREE.Mesh(geometry7, material7);
      mesh7.translateX(200);
      mesh7.translateZ(150);
      scene.add(mesh7);



      
    }
  }
}
</script>

<style lang="scss">
.contour-filling-component {
}
</style>
