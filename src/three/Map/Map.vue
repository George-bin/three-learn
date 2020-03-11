<template>
  <div class="map-component">
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
    // 创建网格模型
    createMesh() {
      // 矩形平面
      let geometry = new THREE.PlaneGeometry(50, 50);
      // let geometry = new THREE.BoxGeometry(100, 100, 100);
      // let geometry = new THREE.SphereGeometry(25, 10, 10);

      // 创建一个纹理加载器
      let textureLoader = new THREE.TextureLoader();

      // 执行load方法，加载纹理贴图成功后，返回一个纹理对象Texture
      textureLoader.load('../../../static/img/1.jpg', function (texture) {
        let material = new THREE.MeshLambertMaterial({
          side: THREE.DoubleSide,
          // opacity: 0.4,
          // transparent: true,
          // 设置颜色纹理贴图：Texture对象作为材质map属性的属性值
          map: texture //设置颜色贴图属性值
        });
        let mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);
      });
      // 纹理对象Texture
      // this.imageLoader();
      // 修改纹理坐标
      this.changeMeshUV();
      // 自定义Geometry UV坐标
      this.geometryCustomUV();
      // 自定义BufferGeometry UV坐标
      this.bufferGeometryCustomUV();
      // 数组材质
      this.arrayMaterial();
    },

    // 纹理对象Texture
    imageLoader() {
      let geometry = new THREE.BoxGeometry(50, 50, 50, 4, 4);
      
      // 重新设置UV坐标
      geometry.faceVertexUvs[0].forEach(elem => {
        elem.forEach(Vector2 => {
          // 所有的UV坐标全部设置为一个值
          Vector2.set(0.4,0.4);
        });
      });

      // 创建一个图片加载器
      let ImageLoader = new THREE.ImageLoader();
      ImageLoader.load('../../../static/img/1.jpg', function(img) {
        // img作为参数，创建一个纹理对象Texture
        let texture = new THREE.Texture(img);
        let material = new THREE.MeshLambertMaterial({
          side: THREE.DoubleSide,
          map: texture
        });
        // 下次使用纹理时触发更新
        texture.needsUpdate = true;
        let mesh = new THREE.Mesh(geometry, material);
        mesh.translateX(50);
        scene.add(mesh);
      });
    },

    changeMeshUV() {
      let geometry = new THREE.PlaneGeometry(50, 50, 4, 4);
      // 局部三角面显示完整纹理贴图
      let t0 = new THREE.Vector2(0, 1); //图片右下角
      let t1 = new THREE.Vector2(0, 0); //图片左下角
      let t2 = new THREE.Vector2(1, 0); //图片左上角
      let t3 = new THREE.Vector2(1, 1); //图片右上角
      let uv1 = [t0, t1, t3]; //选中图片一个三角区域像素——用于映射到一个三角面
      let uv2 = [t1, t2, t3]; //选中图片一个三角区域像素——用于映射到一个三角面
      // 设置第五、第六个三角形面对应的纹理坐标
      geometry.faceVertexUvs[0][4] = uv1
      geometry.faceVertexUvs[0][5] = uv2
      // 创建一个纹理加载器
      let textureLoader = new THREE.TextureLoader();

      // 执行load方法，加载纹理贴图成功后，返回一个纹理对象Texture
      textureLoader.load('../../../static/img/1.jpg', function (texture) {
        let material = new THREE.MeshLambertMaterial({
          side: THREE.DoubleSide,
          // opacity: 0.4,
          // transparent: true,
          // 设置颜色纹理贴图：Texture对象作为材质map属性的属性值
          map: texture //设置颜色贴图属性值
        });
        let mesh = new THREE.Mesh(geometry, material);
        mesh.translateX(70);
        scene.add(mesh);
      });
    },

    // Geometry自定义UV坐标
    geometryCustomUV() {
      let geometry = new THREE.Geometry();

      // 顶点位置（纹理映射位置）
      let p1 = new THREE.Vector3(0, 0, 0); // 顶点1坐标
      let p2 = new THREE.Vector3(160, 0, 0); // 顶点2坐标
      let p3 = new THREE.Vector3(160, 80, 0); // 顶点3坐标
      let p4 = new THREE.Vector3(0, 80, 0); // 顶点4坐标
      geometry.vertices.push(p1, p2, p3, p4); // 将顶点坐标添加到geometry对象

      // 绘制三角面
      let normal = new THREE.Vector3(0, 0, 1); // 三角面法向量
      let face0 = new THREE.Face3(0, 1, 2, normal); // 三角面1
      let face1 = new THREE.Face3(0, 2, 3, normal); // 三角面2
      geometry.faces.push( face0,face1 ); // 三角面1、2添加到几何体

      // 纹理坐标
      let t0 = new THREE.Vector2(0, 0);//图片左下角
      let t1 = new THREE.Vector2(1, 0);//图片右下角
      let t2 = new THREE.Vector2(1, 1);//图片右上角
      let t3 = new THREE.Vector2(0, 1);//图片左上角
      // 选中图片一个三角区域像素——映射到三角面1
      let uv1 = [t0, t1, t2];
      // 选中图片一个三角区域像素——映射到三角面2
      let uv2 = [t0, t2, t3];

      geometry.faceVertexUvs[0].push(uv1, uv2);

      // 创建一个纹理加载器
      let textureLoader = new THREE.TextureLoader();

      // 执行load方法，加载纹理贴图成功后，返回一个纹理对象Texture
      textureLoader.load('../../../static/img/1.jpg', function (texture) {
        let material = new THREE.MeshLambertMaterial({
          side: THREE.DoubleSide,
          // opacity: 0.4,
          // transparent: true,
          // 设置颜色纹理贴图：Texture对象作为材质map属性的属性值
          map: texture //设置颜色贴图属性值
        });
        console.log('自定义geometry UV坐标:', geometry)
        let mesh = new THREE.Mesh(geometry, material);
        mesh.translateZ(50);
        scene.add(mesh);
      })
    },

    // BufferGeometry自定义UV
    bufferGeometryCustomUV() {
      let geometry = new THREE.BufferGeometry();

      // 类型数组创建顶点位置position数据
      let vertices = new Float32Array([
        0, 0, 0, //顶点1坐标
        80, 0, 0, //顶点2坐标
        80, 80, 0, //顶点3坐标
        0, 80, 0, //顶点4坐标
      ]);

      // 创建属性缓冲区对象
      let attribute = new THREE.BufferAttribute(vertices, 3); // 3个为一组
      // 设置几何体attributes属性的位置position属性
      geometry.attributes.position = attribute;

      let normals = new Float32Array([
        0, 0, 1, //顶点1法向量
        0, 0, 1, //顶点2法向量
        0, 0, 1, //顶点3法向量
        0, 0, 1, //顶点4法向量
      ]);
      // 设置几何体attributes属性的位置normal属性
      geometry.attributes.normal = new THREE.BufferAttribute(normals, 3); // 3个为一组,表示一个顶点的xyz坐标

      // Uint16Array类型数组创建顶点索引数据
      let indexes = new Uint16Array([
        0, 1, 2, 0, 2, 3,
      ]);
      // 索引数据赋值给几何体的index属性
      geometry.index = new THREE.BufferAttribute(indexes, 1); // 1个为一组

      /**纹理坐标*/
      let uvs = new Float32Array([
        0,0, //图片左下角
        1,0, //图片右下角
        1,1, //图片右上角
        0,1, //图片左上角
      ]);
      // 设置几何体attributes属性的位置normal属性
      geometry.attributes.uv = new THREE.BufferAttribute(uvs, 2); // 2个为一组,表示一个顶点的纹理坐标

      // 创建一个纹理加载器
      let textureLoader = new THREE.TextureLoader();

      // 执行load方法，加载纹理贴图成功后，返回一个纹理对象Texture
      textureLoader.load('../../../static/img/1.jpg', function (texture) {
        let material = new THREE.MeshLambertMaterial({
          side: THREE.DoubleSide,
          // opacity: 0.4,
          // transparent: true,
          // 设置颜色纹理贴图：Texture对象作为材质map属性的属性值
          map: texture //设置颜色贴图属性值
        });
        let mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(200, 0, 50);
        scene.add(mesh);
      })
    },

    // 数组材质
    arrayMaterial() {
      let geometry = new THREE.BoxGeometry(100, 100, 100);
      // 材质对象1
      let material1 = new THREE.MeshLambertMaterial({
        side: THREE.DoubleSide,
        color: 0xff0000
      });

      // 纹理加载器
      let textureLoader = new THREE.TextureLoader();
      let texture = textureLoader.load('../../../static/img/1.jpg');

      // 材质对象2
      let material2 = new THREE.MeshLambertMaterial({
        side: THREE.DoubleSide,
        map: texture
      });
      // 设置材质数组
      let materialArr = [material2, material1, material2, material1, material1, material1];

      let mesh = new THREE.Mesh(geometry, materialArr);
      mesh.translateY(150);
      scene.add(mesh);
      // console.log('材质数组三角面', geometry.faces);

      let geometry2 = new THREE.PlaneGeometry(100, 100, 4, 4); //矩形平面
      geometry2.faces[4].materialIndex = 1;
      geometry2.faces[5].materialIndex = 1;
      let mesh2 = new THREE.Mesh(geometry2, materialArr);
      mesh2.position.set(150, 150, 0);
      scene.add(mesh2);
    }
  }
}
</script>

<style lang="scss">
</style>
