<template>
  <div class="parallel-light-component">
    <!-- 创建canvas画布 -->
	  <canvas id="webgl" width="500" height="500" style="background: #8c8c8c"></canvas>
  </div>
</template>

<script>
export default {
  name: "",
  props: {},
  components: {},
  data() {
    return {}
  },
  computed: {},
  watch: {},
  created() {
    window.gl = null;
  },
  mounted() {
    this.initWebgl()
  },
  methods: {
    initWebgl() {
      let canvas = document.getElementById('webgl');
      // 获取WebGL上下文对象
      window.gl = canvas.getContext('webgl');

      // 顶点着色器源码
      let vertexShaderSource = `
        //attribute声明vec4类型变量apos
        attribute vec4 apos;
        // attribute声明顶点颜色变量
        attribute vec4 a_color;
        //顶点法向量变量
        attribute vec4 a_normal;
        // uniform声明平行光颜色变量
        uniform vec3 u_lightColor;
        //平行光方向
        uniform vec3 u_lightDirection;
        //varying声明顶点颜色插值后变量
        varying vec4 v_color;
        void main() {
          //设置几何体轴旋转角度为30度，并把角度值转化为弧度值
          float radian = radians(30.0);
          //求解旋转角度余弦值
          float cos = cos(radian);
          //求解旋转角度正弦值
          float sin = sin(radian);
          //引用上面的计算数据，创建绕x轴旋转矩阵
          // 1      0       0    0
          // 0   cosα   sinα   0
          // 0  -sinα   cosα   0
          // 0      0        0   1
          mat4 mx = mat4(1,0,0,0,  0,cos,-sin,0,  0,sin,cos,0,  0,0,0,1);
          //引用上面的计算数据，创建绕y轴旋转矩阵
          // cosβ   0   sinβ    0
          //     0   1   0        0
          //-sinβ   0   cosβ    0
          //     0   0   0        1
          mat4 my = mat4(cos,0,-sin,0,  0,1,0,0,  sin,0,cos,0,  0,0,0,1);
          //两个旋转矩阵、顶点齐次坐标连乘
          gl_Position = mx*my*apos;
          // 顶点法向量进行矩阵变换，然后归一化
          vec3 normal = normalize((mx*my*a_normal).xyz);
          // 计算平行光方向向量和顶点法向量的点积
          float dot = max(dot(u_lightDirection, normal), 0.0);
          // 计算反射后的颜色
          vec3 reflectedLight = u_lightColor * a_color.rgb * dot;
          //颜色插值计算
          v_color = vec4(reflectedLight, a_color.a);
        }
      `
      // 片元着色器源码
      let fragShaderSource = `
        // 所有float类型数据的精度是lowp
        precision lowp float;
        // 接收顶点着色器中v_color数据
        varying vec4 v_color;
        void main() {
          // 插值后颜色数据赋值给对应的片元
          gl_FragColor = v_color;
        }
      `;
      // 初始化着色器
      let program = this.initShader(vertexShaderSource,fragShaderSource);
      /**
       * 从program对象获取相关的变量
       * attribute变量声明的方法使用getAttribLocation()方法
       * uniform变量声明的方法使用getAttribLocation()方法
       **/
      let aposLocation = gl.getAttribLocation(program,'apos');
      let a_color = gl.getAttribLocation(program,'a_color');
      let a_normal = gl.getAttribLocation(program,'a_normal');
      let u_lightColor = gl.getUniformLocation(program,'u_lightColor');
      let u_lightDirection = gl.getUniformLocation(program,'u_lightDirection');

      /**
       * 给平行光传入颜色和方向数据，RGB(1,1,1),单位向量(x,y,z)
       **/
      gl.uniform3f(u_lightColor, 1.0, 1.0, 1.0);
      //保证向量(x,y,z)的长度为1，即单位向量
      let x = 1/Math.sqrt(15), y = 2/Math.sqrt(15), z = 3/Math.sqrt(15);
      gl.uniform3f(u_lightDirection,x,y,-z);

      /**
       创建顶点位置数据数组data,Javascript中小数点前面的0可以省略
      **/
      let data = new Float32Array([
        .5,.5,.5,-.5,.5,.5,-.5,-.5,.5,.5,.5,.5,-.5,-.5,.5,.5,-.5,.5,      //面1
        .5,.5,.5,.5,-.5,.5,.5,-.5,-.5,.5,.5,.5,.5,-.5,-.5,.5,.5,-.5,      //面2
        .5,.5,.5,.5,.5,-.5,-.5,.5,-.5,.5,.5,.5,-.5,.5,-.5,-.5,.5,.5,      //面3
        -.5,.5,.5,-.5,.5,-.5,-.5,-.5,-.5,-.5,.5,.5,-.5,-.5,-.5,-.5,-.5,.5,//面4
        -.5,-.5,-.5,.5,-.5,-.5,.5,-.5,.5,-.5,-.5,-.5,.5,-.5,.5,-.5,-.5,.5,//面5
        .5,-.5,-.5,-.5,-.5,-.5,-.5,.5,-.5,.5,-.5,-.5,-.5,.5,-.5,.5,.5,-.5 //面6
      ]);
      /**
       创建顶点颜色数组colorData
      **/
      let colorData = new Float32Array([
        1,0,0, 1,0,0, 1,0,0, 1,0,0, 1,0,0, 1,0,0,//红色——面1
        1,0,0, 1,0,0, 1,0,0, 1,0,0, 1,0,0, 1,0,0,//红色——面2
        1,0,0, 1,0,0, 1,0,0, 1,0,0, 1,0,0, 1,0,0,//红色——面3
        1,0,0, 1,0,0, 1,0,0, 1,0,0, 1,0,0, 1,0,0,//红色——面4
        1,0,0, 1,0,0, 1,0,0, 1,0,0, 1,0,0, 1,0,0,//红色——面5
        1,0,0, 1,0,0, 1,0,0, 1,0,0, 1,0,0, 1,0,0 //红色——面6
      ]);
      /**
       *顶点法向量数组normalData
      **/
      let normalData = new Float32Array([
        0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,//z轴正方向——面1
        1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,//x轴正方向——面2
        0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,//y轴正方向——面3
        -1,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,//x轴负方向——面4
        0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,//y轴负方向——面5
        0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,-1//z轴负方向——面6
      ]);
      
      /**
       创建缓冲区normalBuffer，传入顶点法向量数据normalData
      **/
      let normalBuffer=gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER,normalBuffer);
      gl.bufferData(gl.ARRAY_BUFFER,normalData,gl.STATIC_DRAW);
      gl.vertexAttribPointer(a_normal,3,gl.FLOAT,false,0,0);
      gl.enableVertexAttribArray(a_normal);
      /**
       创建缓冲区colorBuffer，传入顶点颜色数据colorData
      **/
      let colorBuffer=gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER,colorBuffer);
      gl.bufferData(gl.ARRAY_BUFFER,colorData,gl.STATIC_DRAW);
      gl.vertexAttribPointer(a_color,3,gl.FLOAT,false,0,0);
      gl.enableVertexAttribArray(a_color);
      /**
       创建缓冲区buffer，传入顶点位置数据data
      **/
      let buffer=gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
      gl.bufferData(gl.ARRAY_BUFFER,data,gl.STATIC_DRAW);
      gl.vertexAttribPointer(aposLocation,3,gl.FLOAT,false,0,0);
      gl.enableVertexAttribArray(aposLocation);

      /**执行绘制之前，一定要开启深度测试，以免颜色混乱**/
      gl.enable(gl.DEPTH_TEST);
      /**执行绘制命令**/
      gl.drawArrays(gl.TRIANGLES,0,36);
    },
    // 声明初始化着色器函数
    initShader(vertexShaderSource,fragmentShaderSource) {
      // 创建顶点着色器对象
      let vertexShader = gl.createShader(gl.VERTEX_SHADER);

      // 创建片元着色器对象
      let fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

      //引入顶点、片元着色器源代码
      gl.shaderSource(vertexShader,vertexShaderSource);
      gl.shaderSource(fragmentShader,fragmentShaderSource);

      //编译顶点、片元着色器
      gl.compileShader(vertexShader);
      gl.compileShader(fragmentShader);

      // 创建程序对象program
      let program = gl.createProgram();
      // 附着顶点着色器和片元着色器到program
      gl.attachShader(program,vertexShader);
      gl.attachShader(program,fragmentShader);
      // 链接program
      gl.linkProgram(program);
      // 使用program
      gl.useProgram(program);
      // 返回程序program对象
      return program;
    }
  }
}
</script>

<style lang="scss">
.parallel-light-component {
  padding-top: 20px;
  canvas {
    display: block;
    margin: 0 auto;
  }
}
</style>
