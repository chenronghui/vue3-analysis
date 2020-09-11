# canvas 实现文字流光效果

<Streamer/>

``` html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>

<body>
  <canvas id="canvas"></canvas>
  <script>
    const canvas = document.getElementById('canvas')
    var ctx = canvas.getContext('2d');
    ctx.font = "32px serif";
    var text = ctx.measureText("Hello world");
    var step = 3
    var textX = 10
    var textY = 50
    var start = -text.width - step + textX;
    var end = text.width - step + textX

    function draw() {
      start += step;
      end += step;
      if (start > 0) {
        start = -text.width - step + textX
        end = text.width - step + textX
      }

      var lineargradient = ctx.createLinearGradient(start, 0, end, 0);
      lineargradient.addColorStop(0, 'red');
      lineargradient.addColorStop(0.25, 'green');
      lineargradient.addColorStop(0.5, 'red');
      lineargradient.addColorStop(0.75, 'green');
      lineargradient.addColorStop(1, 'red');

      ctx.fillStyle = lineargradient
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.fillText("Hello world", textX, textY);
      requestAnimationFrame(draw)

    }

    draw()
  </script>
</body>

</html>
```


