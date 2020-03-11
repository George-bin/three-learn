<template>
  <div class="rotate-component">
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

      //类型数组构造函数Float32Array创建顶点数组
      let data=new Float32Array([
        0.5, 0.5, 0.5, // 顶点1坐标
        -0.5, 0.5, 0.5, // 顶点2坐标
        -0.5, -0.5, 0.5, // 顶点3坐标
        0.5, -0.5, 0.5, // 顶点4坐标
        //z为-0.5时，xOy平面上的四个点坐标
        0.5, 0.5, -0.5, // 顶点5坐标
        -0.5, 0.5, -0.5, // 顶点6坐标
        -0.5, -0.5, -0.5, // 顶点7坐标
        0.5, -0.5, -0.5, // 顶点8坐标
        //上面两组坐标分别对应起来组成一一对
        0.5,  0.5,  0.5,
        0.5,  0.5,  -0.5,

        -0.5,  0.5,  0.5,
        -0.5,  0.5,  -0.5,

        -0.5, -0.5,  0.5,
        -0.5, -0.5,  -0.5,

        0.5, -0.5,  0.5,
        0.5, -0.5,  -0.5,
      ]);

      // 顶点着色器源码
      let vertexShaderSource = `
        attribute vec4 apos;
        void main() {
          float radian = radians(60.0);
          float cos = cos(radian);
          float sin = sin(radian);
          mat4 mx = mat4(
            1,0,0,0,
            0,cos,-sin,0,
            0,sin,cos,0,
            0,0,0,1
          );
          mat4 my = mat4(
            cos,0,-sin,0,
            0,1,0,0,
            sin,0,cos,0,
            0,0,0,1
          );
          gl_Position = my*apos;
        }
      `
      // 片元着色器源码
      let fragShaderSource = `
        void main() {
          gl_FragColor = vec4(0, 1.0, 0, 1.0);
        }
      `;
      // 初始化着色器
      let program = this.initShader(vertexShaderSource,fragShaderSource);
      
      // 把内存中的顶点数据存入显存，提高图形的处理效率
      //获取顶点着色器的位置变量apos，即aposLocation指向apos变量。
      var aposLocation = gl.getAttribLocation(program, 'apos');
      //创建缓冲区对象
      var buffer=gl.createBuffer();
      //绑定缓冲区对象,激活buffer
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      //顶点数组data数据传入缓冲区（传入缓冲区的对象可以通过drawArrays方法多次调用）
      gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
      //缓冲区中的数据按照一定的规律传递给位置变量apos
      gl.vertexAttribPointer(aposLocation, 3, gl.FLOAT, false, 0, 0);
      //允许数据传递
      gl.enableVertexAttribArray(aposLocation);

      // 开始绘制，显示器显示结果（通知GPU执行着色器代码）
      // gl.drawArrays(gl.LINE_LOOP, 0, 3);
      //LINE_LOOP模式绘制前四个点
      gl.drawArrays(gl.LINE_LOOP,0,4);
      //LINE_LOOP模式从第五个点开始绘制四个点
      gl.drawArrays(gl.LINE_LOOP,4,4);
      //LINES模式绘制后8个点
      gl.drawArrays(gl.LINES,8,8);
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
.rotate-component {
  padding-top: 20px;
  canvas {
    margin: 0 auto;
  }
}
</style>
