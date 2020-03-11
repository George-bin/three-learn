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
      // 8个顶点坐标数组
      let data=new Float32Array([
        0.5,  0.5,  0.5,//顶点0
        -0.5,  0.5,  0.5,//顶点1
        -0.5, -0.5,  0.5,//顶点2
        0.5, -0.5,  0.5,//顶点3
        0.5,  0.5, -0.5,//顶点4
        -0.5,  0.5, -0.5,//顶点5
        -0.5, -0.5, -0.5,//顶点6
        0.5, -0.5, -0.5,//顶点7
      ]);

      // 顶点索引数组
      let indexes = new Uint8Array([
        //前四个点对应索引值
        0, 1, 2, 3,//gl.LINE_LOOP模式四个点绘制一个矩形框
        //后四个顶点对应索引值
        4, 5, 6, 7,//gl.LINE_LOOP模式四个点绘制一个矩形框
        //前后对应点对应索引值  
        0, 4,//两个点绘制一条直线
        1, 5,//两个点绘制一条直线
        2, 6,//两个点绘制一条直线
        3, 7//两个点绘制一条直线
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
          gl_Position = mx*my*apos;
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
      //获取顶点着色器的位置变量apos
      let aposLocation = gl.getAttribLocation(program,'apos');
      
      //创建缓冲区对象
      let indexesBuffer=gl.createBuffer();
      //绑定缓冲区对象
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,indexesBuffer);
      //索引数组indexes数据传入缓冲区
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,indexes,gl.STATIC_DRAW);

      //创建缓冲区对象
      let buffer=gl.createBuffer();
      //绑定缓冲区对象
      gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
      //顶点数组data数据传入缓冲区
      gl.bufferData(gl.ARRAY_BUFFER,data,gl.STATIC_DRAW);
      //缓冲区中的数据按照一定的规律传递给位置变量apos
      gl.vertexAttribPointer(aposLocation,3,gl.FLOAT,false,0,0);
      //允许数据传递
      gl.enableVertexAttribArray(aposLocation);

      //LINE_LOOP模式绘制前四个点
      gl.drawElements(gl.LINE_LOOP,4,gl.UNSIGNED_BYTE,0);
      //LINE_LOOP模式从第五个点开始绘制四个点
      gl.drawElements(gl.LINE_LOOP,4,gl.UNSIGNED_BYTE,4);
      //LINES模式绘制后8个点
      gl.drawElements(gl.LINES, 8, gl.UNSIGNED_BYTE, 8);
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
