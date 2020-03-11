<template>
  <div class="planetary-motion-component">
    <canvas id="canvasContext"></canvas>
    <img
      :style="{
        left: this.imgInfo.left,
        top: this.imgInfo.top
      }"
      class="planet-info"
      :src="imgInfo.src"
      alt="行星介绍" />
  </div>
</template>

<script>
import OrbitControls from "three/examples/js/controls/OrbitControls";
import { mapState } from 'vuex';
let sun = null;
let planetGroup = null;
let texLoader = null;
let cloud = null;
let chooseMesh = null;
let intersectsArr = [];
export default {
  name: "",
  props: {},
  components: {},
  data() {
    return {
      s: 300,
      imgInfo: {
        src: '',
        left: 0,
        top: 0
      }
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
    window.scene = null;
    window.renderer = null;
    window.camera = null;
    window.controls = null;
    planetGroup = null;
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
      // this.initAxesHelper();
      // 行星
      this.initPlanetary();
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
      let s = 310; //三维场景缩放系数
      let k = this.screenWidth/this.screenHeight;
      //创建相机对象
      window.camera = new THREE.OrthographicCamera(-s * k, s * k, s, -s, 1, 1500);
      camera.position.set(651, 613, 525); //设置相机位置
      camera.lookAt(scene.position); // 设置相机方向（指向的场景对象）
      scene.add( camera );
    },
    // 4、创建渲染器
    initRenderer () {
      window.renderer = new THREE.WebGLRenderer({
        canvas: document.getElementById('canvasContext')
      });
      renderer.setSize(this.screenWidth, this.screenHeight); // 设置渲染区域的宽高
      renderer.setClearColor(0x101010, 1); //设置背景颜色
      // renderer.setClearColor(0x000000, 0.5); // 设置背景颜色
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
      let axisHelper = new THREE.AxesHelper(500);
      scene.add(axisHelper);
    },
    // 执行渲染
    render () {
      sun.rotation.y += 0.01;
      planetGroup.children.forEach(function(obj) {
        obj.rotation.y += 0.01;
        obj.angle += 0.005 / obj.revolutionR * 400;
        obj.position.set(obj.revolutionR * Math.sin(obj.angle), 0, obj.revolutionR * Math.cos(obj.angle));
      });
      cloud.rotation.x += 0.0002;
      cloud.rotation.y += 0.0002;
      cloud.rotation.z += 0.0002;
      renderer.render(scene, camera);
      requestAnimationFrame(this.render);
      if (chooseMesh) {
        let worldVector = new THREE.Vector3(
          chooseMesh.position.x,
          chooseMesh.position.y,
          chooseMesh.position.z
        );
        let standardVector = worldVector.project(camera); //世界坐标转标准设备坐标
        let a = window.innerWidth / 2;
        let b = window.innerHeight / 2;
        let x = Math.round(standardVector.x * a + a); //标准设备坐标转屏幕坐标
        let y = Math.round(-standardVector.y * b + b); //标准设备坐标转屏幕坐标

        this.imgInfo.left = x + 'px';
        this.imgInfo.top = y -280+ 'px';
      }
    },
    // 窗口大小变换重新进行绘制
    canvasResize() {
      // 重置渲染器输出画布canvas尺寸
      renderer.setSize(window.innerWidth,window.innerHeight);
      // 重置相机投影的相关参数
      let s = 310;
      let k = window.innerWidth/window.innerHeight;//窗口宽高比
      camera.left = -s*k;
      camera.right = s*k;
      camera.top = s;
      camera.bottom = -s;
      // 渲染器执行render方法的时候会读取相机对象的投影矩阵属性projectionMatrix
      // 但是不会每渲染一帧，就通过相机的属性计算投影矩阵(节约计算资源)
      // 如果相机的一些属性发生了变化，需要执行updateProjectionMatrix ()方法更新相机的投影矩阵
      camera.updateProjectionMatrix ();

    },
    initPlanetary() {
      // 粒子背景
      this.cloudFun();

      // texture
      texLoader = new THREE.TextureLoader();

      // 创建太阳系行星和轨迹
      let Data = this.planetData();
      sun = this.createSphereMesh(Data.sun.R, Data.sun.URL);
      sun.name = Data.sun.name;
      intersectsArr.push(sun);
      scene.add(sun);

      planetGroup = new THREE.Group();
      scene.add(planetGroup);
      Data.planet.forEach((obj) => {
        let planet = null;
        if (obj.ring) {
          planet = this.createringPlanetMesh(obj.sphere.R, obj.sphere.URL, obj.ring.r, obj.ring.R, obj.ring.URL)
        } else {
          planet = this.createSphereMesh(obj.R, obj.URL);
        }
        planet.revolutionR = obj.revolutionR;
        planet.angle = 2 * Math.PI * Math.random();
        planet.name = obj.name;
        planetGroup.add(planet);
        intersectsArr.push(planet)
        var line = this.circle(obj.revolutionR);
        scene.add(line);
      });
      window.addEventListener('click', this.choose)
    },
    // 粒子背景
    cloudFun() {
      let geom = new THREE.Geometry();
      let material = new THREE.PointsMaterial({
        size: 0.01,
        vertexColors: true
      });
      let n = 1200;
      for (let i = 0; i < 3000; i++) {
        let particle = new THREE.Vector3(
          (Math.random() - 0.5) * n,
          (Math.random() - 0.5) * n,
          (Math.random() - 0.5) * n
        );
        geom.vertices.push(particle);
        let color_k = Math.random();
        geom.colors.push(new THREE.Color(color_k, color_k, color_k * 0.6));
      }

      cloud = new THREE.Points(geom, material);
      scene.add(cloud);
    },
    // 行星数据
    planetData() {
      let K = 5;
      return {
        // 太阳
        sun: {
          name: '太阳',
          R: 10 * K, //天体半径
          URL: '../../../static/img/map/planet/太阳.jpg', //天体纹理路径
        },
        // 普通行星
        planet: [
          {
            name: '水星',
            R: 2.5 * K,
            URL: '../../../static/img/map/planet/水星.jpg',
            revolutionR: 20 * K, //公转半径
          }, 
          {
            name: '金星',
            R: 3 * K,
            URL: '../../../static/img/map/planet/金星.jpg',
            revolutionR: 30 * K, //公转半径
          }, 
          {
            name: '地球',
            R: 3.2 * K,
            URL: '../../../static/img/map/planet/地球.jpg',
            revolutionR: 40 * K, //公转半径
          }, 
          {
            name: '火星',
            R: 2.5 * K,
            URL: '../../../static/img/map/planet/火星.jpg',
            revolutionR: 50 * K, //公转半径
          }, 
          {
            name: '木星',
            R: 5 * K,
            URL: '../../../static/img/map/planet/木星.jpg',
            revolutionR: 60 * K, //公转半径
          }, 
          {
            name: '土星',
            sphere: {
              R: 3.5 * K, //半径
              URL: '../../../static/img/map/planet/土星.jpg',
            },
            ring: {
              r: 4 * K, //内径
              R: 6 * K, //外径
              URL: '../../../static/img/map/planet/土星环.jpg',
            },
            revolutionR: 70 * K,
          }, 
          {
            name: '天王星',
            sphere: {
              R: 3.5 * K, //半径
              URL: '../../../static/img/map/planet/天王星.jpg',
            },
            ring: {
              r: 4 * K, //内径
              R: 6 * K, //外径
              URL: '../../../static/img/map/planet/天王星环.jpg',
            },
            revolutionR: 80 * K,
          },
          {
            name: '海王星',
            R: 4 * K,
            URL: '../../../static/img/map/planet/海王星.jpg',
            revolutionR: 100 * K, //公转半径
          },
        ],
        // 环行星
        ringPlanet: [],
        // 月球
        moon: {
          R: K,
          URL: 'tu.png',
          revolutionR: 10 * K,
        },
      };
    },
    // 创建网格模型
    createMesh(geometry, URL) { // R半径,图片URL路径
      // Lambert
      var material = new THREE.MeshBasicMaterial({ //MeshLambertMaterial
        map: texLoader.load(URL),
        side:THREE.DoubleSide,
      }); //材质对象
      var mesh = new THREE.Mesh(geometry, material); //网格模型对象
      return mesh;
    },
    // 球体Mesh  参数：半径R  图片文理
    createSphereMesh(R, URL) { // R半径,图片URL路径
      var geometry = new THREE.SphereGeometry(R, 100, 100); //创建一个立方体几何对象
      return this.createMesh(geometry, URL);
    },
    // 圆环Mesh  参数：半径R  图片文理
    createRingMesh(r, R, URL) { // R半径,图片URL路径
      var geometry = new THREE.CylinderGeometry(r, R, 0, 100, 100, true);
      // var tu_huan_geometry2 = new THREE.RingGeometry(r, R, 32);
      return this.createMesh(geometry, URL);
    },
    // 环星球Mesh
    createringPlanetMesh(sphere_R, sphere_URL, ring_r, ring_R, ring_URL) {
      let group = new THREE.Group();
      let spere = this.createSphereMesh(sphere_R, sphere_URL);
      let ring = this.createRingMesh(ring_r, ring_R, ring_URL);
      group.add(spere, ring);
      return group;
    },
    // 公转轨迹圆弧线
    circle(r) {
      let arc = new THREE.ArcCurve(0, 0, r, 0, 2 * Math.PI, true); // 圆心  半径  起始角度
      let points = arc.getPoints(50); //返回一个vector2对象作为元素组成的数组
      let geometry = new THREE.Geometry();
      geometry.setFromPoints(points);
      let material = new THREE.LineBasicMaterial({
        color: 0x222222
      });
      let line = new THREE.LineLoop(geometry, material);
      line.rotateX(Math.PI / 2);
      return line;
    },
    // 下面是单击行星交互的代码
    // 代码中关于射线拾取和模型标签知识可以参考下面两篇文章
    // 射线拾取：https://blog.csdn.net/u014291990/article/details/103213627
    // 模型标签：http://www.yanhuangxueyuan.com/Three.js_course/advanced/modelTag.html
    choose(event) {
      chooseMesh = null;
      let Sx = event.clientX;
      let Sy = event.clientY;
      //屏幕坐标转标准设备坐标
      let x = (Sx / window.innerWidth) * 2 - 1;
      let y = -(Sy / window.innerHeight) * 2 + 1;

      let raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(new THREE.Vector2(x, y), camera);
      let intersects = raycaster.intersectObjects(intersectsArr, false);
      if (intersects.length > 0) {
        console.log(intersects[0].object.name);
        // this.imgInfo.src = '../../../static/img/map/planet/label/土星.png'
        this.imgInfo.src = `../../../static/img/map/planet/label/${intersects[0].object.name}.png`
        // img.src = './UI/标签/' + intersects[0].object.name + '.png';
        chooseMesh = intersects[0].object
      }
    }
  }
}
</script>

<style lang="scss">
.planetary-motion-component {
  .planet-info {
    position: absolute;
    display: block;
  }
}
</style>
