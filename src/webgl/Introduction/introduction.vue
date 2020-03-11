<template>
  <div class="introduction-component">
    <!-- 创建canvas画布 -->
	  <canvas id="webgl" width="500" height="500"></canvas>
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


      /*清空画板上的颜色，并初始化颜色*/
      gl.clearColor(0.0, 0.0, 0.0, 1.0);
      //设定canvas初始化时候的深度
      gl.clearDepth(1.0);
      //清空canvas
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      // 顶点着色器源码
      let vertexShaderSource = `
        void main() {
          mat4 m4 = mat4(
            1,0,0,0,
            0,1,0,0,
            0,0,1,0,
            -0.5, -0.5,0,1
          );
          // gl_PointSize: 点像素大小
          gl_PointSize = 40.0;
          // gl_Position: 顶点位置
          gl_Position = m4*vec4(0, 0, 0, 1);
        }
      `;
      // 片元着色器源码
      let fragShaderSource = `
        void main() {
          // gl_FragColor: 定义片元颜色
          gl_FragColor = vec4(0, 1.0, 0, 1.0);
        }
      `;
      // 初始化着色器
      let program = this.initShader(vertexShaderSource, fragShaderSource);

      // 开始绘制，显示器显示结果（通知GPU执行着色器代码）
      gl.drawArrays(gl.POINTS, 0, 1);
    },
    // 声明初始化着色器函数
    initShader(vertexShaderSource, fragmentShaderSource) {
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
.introduction-component {
  padding-top: 20px;
  canvas {
    display: block;
    margin: 0 auto;
  }
}
</style>
