<template>
  <div class="group-component" id="group-component"></div>
</template>

<script>
import OrbitControls from "three/examples/js/controls/OrbitControls";
let scene = null;
let camera = null;
let renderer = null;
let controls = null;
let group = null;
export default {
  name: "",
  props: {},
  components: {},
  data() {
    return {
      screenWidth: 0,
      screenHeight: 0
    }
  },
  computed: {},
  watch: {},
  created() {
    scene = null;
    camera = null;
    renderer = null;
    controls = null;
    group = null;
  },
  mounted() {
    this.init()
  },
  destroyed() {
  },
  methods: {
    init() {
      this.screenWidth = window.innerWidth;
      this.screenHeight = window.innerHeight;
      this.initScene();
      // this.initMesh();
      this.initLight();
      this.initAxesHelper();
      this.initCamera();
      this.initRenderer();
      this.initControls();
      this.render();
      // this.imageLoader();
      // this.geonetryCustomUV();
      // this.bufferGeometryCustomUV();
      this.arrayMaterial();
    },
    // 创建场景对象
    initScene() {
      scene = new THREE.Scene();
    },
    // 创建网格模型
    initMesh() {
      // 矩形平面
      let geometry = new THREE.PlaneGeometry(200, 100);
      // let geometry = new THREE.BoxGeometry(100, 100, 100);
      // let geometry = new THREE.SphereGeometry(100, 100, 100);

      var t0 = new THREE.Vector2(0, 1); //图片左下角
      var t1 = new THREE.Vector2(0, 0); //图片右下角
      var t2 = new THREE.Vector2(1, 0); //图片右上角
      var t3 = new THREE.Vector2(1, 1); //图片左上角
      var uv1 = [t0, t1, t3]; //选中图片一个三角区域像素——用于映射到一个三角面
      var uv2 = [t1, t2, t3]; //选中图片一个三角区域像素——用于映射到一个三角面
      // 设置第五、第六个三角形面对应的纹理坐标
      geometry.faceVertexUvs[0][4] = uv1
      geometry.faceVertexUvs[0][5] = uv2
      // 创建一个纹理加载器
      let textureLoader = new THREE.TextureLoader();

      // 执行load方法，加载纹理贴图成功后，返回一个纹理对象Texture
      textureLoader.load('../../../static/img/1.jpg', function (texture) {
        let material = new THREE.MeshLambertMaterial({
          opacity: 0.4,
          transparent: true,
          // 设置颜色纹理贴图：Texture对象作为材质map属性的属性值
          map: texture //设置颜色贴图属性值
        });
        let mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);
      })
    },

    // 纹理对象Texture
    imageLoader() {
      let geometry = new THREE.BoxGeometry(200, 200, 200, 4, 4);

      // 遍历UV坐标
      geometry.faceVertexUvs[0].forEach(elem => {
        elem.forEach(Vector2 => {
          Vector2.set(0.2, 0.4);
        })
      });

      // 创建一个图片加载器
      let ImageLoader = new THREE.ImageLoader();
      ImageLoader.load('../../../static/img/1.jpg', function(img) {
        // img作为参数，创建一个纹理对象Texture
        let texture = new THREE.Texture(img);
        let material = new THREE.MeshLambertMaterial({
          map: texture
        });
        // 下次使用纹理时触发更新
        texture.needsUpdate = true;
        let mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);
      })
    },

    // Geometry自定义UV坐标
    geonetryCustomUV() {
      let geometry = new THREE.Geometry();

      // 顶点位置（纹理映射位置）
      let p1 = new THREE.Vector3(0, 0, 0); // 顶点1坐标
      let p2 = new THREE.Vector3(160, 0, 0); // 顶点2坐标
      let p3 = new THREE.Vector3(160, 80, 0); // 顶点3坐标
      let p4 = new THREE.Vector3(0, 80, 0); // 顶点4坐标
      geometry.vertices.push(p1, p1, p3, p4); // 将顶点坐标添加到geometry对象

      // 绘制三角面
      let normal = new THREE.Vector3(0, 0, 1); // 三角面法向量
      let face0 = new THREE.Face3(0, 1, 2, normal); // 三角面1
      let face1 = new THREE.Face3(0, 2, 3, normal); // 三角面2
      geometry.faces.push( face0,face1 ); // 三角面1、2添加到几何体

      // 纹理坐标
      let t0 = new THREE.Vector2(0, 0);
      let t1 = new THREE.Vector2(1, 0);
      let t2 = new THREE.Vector2(1, 1);
      let t3 = new THREE.Vector2(0, 1);
      // 选中图片一个三角区域像素——映射到三角面1
      let uv1 = [t0, t1, t2];
      // 选中图片一个三角区域像素——映射到三角面2
      let uv2 = [t0, t2, t3];

      geometry.faceVertexUvs[0].push(uv1, uv2);
      // return

      // 创建一个纹理加载器
      let textureLoader = new THREE.TextureLoader();

      // 执行load方法，加载纹理贴图成功后，返回一个纹理对象Texture
      textureLoader.load('../../../static/img/1.jpg', function (texture) {
        let material = new THREE.MeshLambertMaterial({
          // opacity: 0.4,
          // transparent: true,
          // 设置颜色纹理贴图：Texture对象作为材质map属性的属性值
          map: texture //设置颜色贴图属性值
        });
        let mesh = new THREE.Mesh(geometry, material);
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
          // opacity: 0.4,
          // transparent: true,
          // 设置颜色纹理贴图：Texture对象作为材质map属性的属性值
          map: texture //设置颜色贴图属性值
        });
        let mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);
      })
    },

    // 数组材质
    arrayMaterial() {
      let geometry = new THREE.BoxGeometry(100, 100, 100);
      // 材质对象1
      let material1 = new THREE.MeshLambertMaterial({
        color: 0xffff3f
      });

      // 纹理加载器
      let textureLoader = new THREE.TextureLoader();
      let texture = textureLoader.load('../../../static/img/1.jpg');

      // 材质对象2
      let material2 = new THREE.MeshLambertMaterial({
        map: texture
      });
      
      // 设置材质数组
      let materialArr = [material2, material1, material2, material1, material1, material1];

      let mesh = new THREE.Mesh(geometry, materialArr);
      scene.add(mesh);

      console.log(geometry.faces);
      geometry.faces.forEach(elem => {
        console.log(elem.materialIndex);
      });

      // 自定义材质索引
      geometry.faces[4].materialIndex = 1;
      geometry.faces[5].materialIndex = 1;
    },

    // 创建光源
    initLight() {
      // 环境光 环境光颜色与网格模型的颜色进行RGB进行乘法运算
      let ambient = new THREE.AmbientLight(0x888888);
      scene.add(ambient);
      
      // 点光源
      let point = new THREE.PointLight(0xffffff);
      point.position.set(400, 200, 300)
      scene.add(point);

      // 平行光
      // let directionalLight = new THREE.DirectionalLight(0xffffff, 1);
      // directionalLight.position.set(-80, 100, 50);
      // directionalLight.target = mesh1;
      // scene.add(directionalLight);

      // 聚光源
      // let spotLight = new THREE.SpotLight(0xffffff);
      // spotLight.position.set(200, 200, 200); // 位置
      // spotLight.target = mesh1; // 目标对象
      // spotLight.angle = Math.PI/6; // 光源发散角度（范围）
      // scene.add(spotLight);
    },

    // 创建相机
    initCamera() {
      let k = this.screenWidth / this.screenHeight; // 窗口宽高比
      let s = 300; // 三维场景显示范围控制系数，系数越大，显示的范围越大
      camera = new THREE.OrthographicCamera(-s*k, s*k, s, -s, 1, 1000);
      camera.position.set(200, 300, 200); // 设置相机位置
      camera.lookAt(scene.position); // 设置相机方向（指向的场景对象）
    },
    // 初始化渲染器
    initRenderer() {
      renderer = new THREE.WebGLRenderer();
      renderer.setSize(this.screenWidth, this.screenHeight); // 设置渲染区域的宽高
      renderer.setClearColor(0xb9d3ff, 1); // 设置背景颜色
      // 打开渲染器的地图阴影
      renderer.shadowMapEnabled = true;
      let box = document.getElementById('group-component');
      box.appendChild(renderer.domElement); //body元素中插入canvas对象
    },
    // 初始化控制器
    initControls() {
      // 创建控件对象
      controls = new THREE.OrbitControls(camera, renderer.domElement);
    },
    // 渲染函数
    render() {
      renderer.render(scene, camera);
      requestAnimationFrame(this.render)
    },
    // 创建辅助坐标系
    initAxesHelper() {
      // 辅助坐标系  参数250表示坐标系大小，可以根据场景大小去设置
      let axisHelper = new THREE.AxesHelper(250);
      scene.add(axisHelper);
    }
  }
}
</script>

<style lang="scss">
</style>
