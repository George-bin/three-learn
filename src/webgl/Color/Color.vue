<template>
  <div class="color-component">
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

      /**
      创建顶点位置数据数组data，存储两个顶点(-0.5,0.5、(0.5,0.5)
      创建顶点颜色数组colorData，存储两个顶点对应RGB颜色值(0,0,1)、(1,0,0)
      **/
      let data = new Float32Array([-0.5,0.5,0.5,0.5]);
      let colorData = new Float32Array([0,0,1,1,0,0]);

      // 顶点着色器源码
      let vertexShaderSource = `
        //attribute声明vec4类型变量apos
        attribute vec4 apos;
        // attribute声明顶点颜色变量
        attribute vec4 a_color;
        //varying声明顶点颜色插值后变量
        varying vec4 v_color;
        void main() {
          // 顶点坐标apos赋值给内置变量gl_Position
          gl_Position = apos;
          //顶点颜色插值计算
          v_color = a_color;
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
      //获取顶点着色器的位置变量apos
      let aposLocation = gl.getAttribLocation(program,'apos');
      let a_color = gl.getAttribLocation(program,'a_color');

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
      gl.vertexAttribPointer(aposLocation,2,gl.FLOAT,false,0,0);
      gl.enableVertexAttribArray(aposLocation);

      /**执行绘制命令**/
      gl.drawArrays(gl.LINES,0,2);
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
.color-component {
  padding-top: 20px;
  canvas {
    margin: 0 auto;
  }
}
</style>
