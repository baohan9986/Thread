const serial = new p5.WebSerial();
let portButton;
let inData = 0; 
let points = []; 
let targetLength = 1.0; // Fraction of points to show (calculated from inData)
let currentLength = 1.0; // Smooth interpolation toward targetLength
let smoothing = 0.01; // Smoothing factor for interpolation
let currentPath = 1; // Tracks the current path (1-4)
let transitioning = false;
let song1, song2, song3, song4; 
let isPlaying = false; 
let pointsDistance = [];

function preload() {
  song1 = loadSound('Dan Gibson - Cherry Wood Paddle_1_1.mp3'); 
  song2 = loadSound('Dan Gibson - The Fallen Leaves_1_1.mp3'); 
  song3 = loadSound('Harvesting.mp3'); 
  song4 = loadSound('Jack Johnson - Better Together_1_1.mp3'); 
}

function keyPressed() {
  if (key === 'f') { 
    let fs = fullscreen(); 
    fullscreen(!fs); 
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight); 
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(60); 
  allSerialStuff();
  addPathPoints(); 
  currentPath = 1; 
  playMusic(); 
}

function draw() {
  background(250, 250, 245); 
  noFill();
  stroke(220, 0, 0);
  strokeWeight(6);

  currentLength += (targetLength - currentLength) * smoothing;
  
  if (!transitioning && currentLength <= 0.01) {
  transitioning = true; // Prevent re-triggering during transition

  stopMusic();

  if (currentPath === 1) {
    currentPath = 2;
    points = [];
    pointsDistance = [];
    addPathPoints2();
  } else if (currentPath === 2) {
    currentPath = 3;
    points = [];
    pointsDistance = [];
    addPathPoints3();
  } else if (currentPath === 3) {
    currentPath = 4;
    points = [];
    pointsDistance = [];
    addPathPoints4();
    setTimeout(() => {
      if (currentPath === 4) { 
        currentPath = 1;
        points = [];
        pointsDistance = [];
        addPathPoints();
        stopMusic(); 
        playMusic(); 
        transitioning = false; 
      }
    }, 60000); // 30 seconds
  } else if (currentPath === 4) {
    currentPath = 1;
    points = [];
    pointsDistance = [];
    addPathPoints();
  }

  // Reset currentLength to avoid repeated triggers
  currentLength = 0.001; // Slightly above 0 to ensure clean transition
  playMusic(); 
}
  // Allow new transitions when enough points are drawn
  if (currentLength >= 0.01) {
    transitioning = false; 
  }

  let totalDistance=0;
  for (let i=0; i<pointsDistance.length; i++) {
    totalDistance+=pointsDistance[i];
  }
  let distanceToDraw=(currentLength)*totalDistance;
  
  let checkDistance=0;
  let numPointsToShow=-1;
  
  for (let i=pointsDistance.length-1; (i>=0)&(numPointsToShow==-1); i--) {
    checkDistance+=pointsDistance[i];
    if (checkDistance>=distanceToDraw) {
      numPointsToShow=pointsDistance.length-i;
    }
  }
  if (numPointsToShow==-1) {
    numPointsToShow=pointsDistance.length;
  }   
  
  beginShape();
  
  for (let i = points.length - numPointsToShow; i < points.length; i++) {
    if (i >= 0) {
      let pt = points[i];
      vertex(pt.x, pt.y);
    }
  }
  endShape();
  
  drawCircles();
}

function playMusic() {
  if (!isPlaying) {
    if (currentPath === 1) {
      song1.loop();
    } else if (currentPath === 2) {
      song2.loop();
    } else if (currentPath === 3) {
      song3.loop();
    } else if (currentPath === 4) {
      setTimeout(() => {
        if (currentPath === 4) {
          song4.loop();
        }
      }, 3000); 
    }
    isPlaying = true;
  }
}

function stopMusic() {
  if (isPlaying) {
    song1.stop();
    song2.stop();
    song3.stop();
    song4.stop();
    isPlaying = false;
  }
}

function drawCircles() {
  let xStart = 100; 
  let yStart = height - 300; 
  let spacing = 70; 

  for (let i = 1; i <= 4; i++) {
    if (i === currentPath) {
      noStroke();
      fill(220, 0, 0);
      ellipse(xStart, yStart + (i - 1) * spacing, 30, 30); 
    } else {
      noFill();
      stroke(220, 0, 0);
      strokeWeight(2);
      ellipse(xStart, yStart + (i - 1) * spacing, 25, 25); 
    }
  }
}

function serialEvent() {
  let inString = serial.readLine(); 
  if (inString) {
    inString = inString.trim(); 
    console.log("Received:", inString);
    if (inString === "ACK") {
      console.log("Handshake: ACK received");
    } else {
      inData = constrain(Number(inString), 0, 1023); 
      targetLength = map(inData, 40, 950, 1.0, 0.0);
    }
  }
}

function addPathPoints() {
points.push(createVector(929.24, 1360.85));
pointsDistance.push(0);
storeBezierPointsEven(929.24, 1360.85, 1006.79, 1361.34, 1084.34, 1360.85, 1161.89, 1361.34);
storeBezierPointsEven(1161.89, 1361.34, 1196.08, 1356.82, 1221.32, 1278.88, 1221.63, 1244.4);
storeBezierPointsEven(1221.63, 1244.4, 1219.3, 983.14, 1094.61, 845.59, 874.51, 770.29);
storeBezierPointsEven(874.51, 770.29, 874.46, 770.27, 1064.04, 741.77, 1165.99, 944.01);
storeBezierPointsEven(1165.99, 944.01, 1361.99, 670.68, 704.93, 593.13, 672.4, 745.72);
storeBezierPointsEven(672.4, 745.72, 820.56, 770.25, 886.85, 1395.15, 1185.17, 1009.61);
storeBezierPointsEven(1185.17, 1009.61, 1219.66, 965.03, 1310.79, 762.02, 1142.5, 412.68);
storeBezierPointsEven(1142.5, 412.68, 1142.5, 412.68, 1251.29, 517.66, 1247.6, 621.16);
storeBezierPointsEven(1247.6, 621.16, 1247.6, 621.16, 1378.32, 385.86, 1068.35, 265.56);
storeBezierPointsEven(1068.35, 265.56, 1055.52, 318.75, 1032.51, 673.07, 1206.57, 651.6);
storeBezierPointsEven(1206.57, 651.6, 1427.67, 1152.52, 1508.7, 906.02, 1799.65, 720.88);
storeBezierPointsEven(1799.65, 720.88, 1955.11, 620.95, 1177.36, 365.02, 1350.63, 831.05);
storeBezierPointsEven(1350.63, 831.05, 1350.64, 831.06, 1442.12, 660.34, 1644.8, 672.32);
storeBezierPointsEven(1644.8, 672.32, 1597.54, 589.25, 1263.55, 845.42, 1254.06, 1216.43);
storeBezierPointsEven(1254.06, 1216.43, 1253.21, 1249.68, 1279.83, 1277.13, 1313.09, 1277);
storeBezierPointsEven(1313.09, 1277, 1556.53, 1276.09, 2387.98, 1276.88, 2560, 1276.88);
points.push(createVector(2560, 1276.88));
}

function addPathPoints2() {
     points.push(createVector(936.23, 1355.34));
    pointsDistance.push(0)
  storeBezierPointsEven(936.23, 1355.34, 1083.49, 1367.36, 1282.86, 964.35, 1147.49, 853.3);
  storeBezierPointsEven(1147.49, 853.3, 1082.65, 785.88, 1076.17, 667.93, 1066.68, 587.88);
  storeBezierPointsEven(1066.68, 587.88, 1063.92, 564.59, 1055.13, 542.36, 1040.91, 523.71);
  storeBezierPointsEven(1040.91, 523.71, 960.64, 418.48, 781.37, 412.84, 712.56, 557.67);
  storeBezierPointsEven(712.56, 557.67, 633.27, 906.97, 807.5, 776.65, 998.27, 826.57);
  storeBezierPointsEven(998.27, 826.57, 1070.9, 935.76, 1217.4, 894.43, 1155.87, 754.85);
  storeBezierPointsEven(1155.87, 754.85, 1168.59, 781.28, 1185.66, 827.8, 1199.08, 858.96);
  storeBezierPointsEven(1199.08, 858.96, 1207.16, 873.25, 1210.15, 898.09, 1221.05, 903.9);
  storeBezierPointsEven(1221.05, 903.9, 1233.58, 795.81, 1288.9, 642.11, 1275.64, 530.85);
  storeBezierPointsEven(1275.64, 530.85, 1267.84, 564.4, 1257.67, 656.79, 1238.08, 717.05);
  storeBezierPointsEven(1238.08, 717.05, 1163.89, 867.31, 1238.56, 507, 1001.18, 603.71);
  storeBezierPointsEven(1001.18, 603.71, 895.79, 548.5, 950.07, 334.34, 1053.76, 271.36);
  storeBezierPointsEven(1053.76, 271.36, 1145.99, 213.39, 1225.7, 375.2, 1335.62, 284.64);
  storeBezierPointsEven(1335.62, 284.64, 1583.35, 51.53, 1545.73, 494.82, 1783.08, 448.58);
  storeBezierPointsEven(1783.08, 448.58, 1947.25, 458.95, 2005.21, 791.11, 1803.69, 748.27);
  storeBezierPointsEven(1803.69, 748.27, 1761.2, 745.51, 1726.9, 702.42, 1685.92, 730.08);
  storeBezierPointsEven(1685.92, 730.08, 1607.75, 800.41, 1658, 948.26, 1467.75, 777.03);
  storeBezierPointsEven(1467.75, 777.03, 1423.61, 743.46, 1384.78, 811.07, 1348.35, 828);
  storeBezierPointsEven(1348.35, 828, 1291.07, 846.26, 1308.47, 771.17, 1326.28, 743.43);
  storeBezierPointsEven(1326.28, 743.43, 1344.07, 713.45, 1327.3, 716.92, 1308.87, 738.61);
  storeBezierPointsEven(1308.87, 738.61, 1263, 793.59, 1260.53, 874.41, 1269.26, 942.28);
  storeBezierPointsEven(1269.26, 942.28, 1345.59, 1535.46, 2180.09, 1294.07, 2559.38, 1288.07);
}

function addPathPoints3() {
 points.push(createVector(1781.47, 1065.71));
pointsDistance.push(0);
storeBezierPointsEven(1781.47, 1065.71, 1619.18, 1044.31, 1459.11, 964.18, 1319.21, 879.42);
storeBezierPointsEven(1319.21, 879.42, 1304.33, 868.55, 1269.3, 845.65, 1278.79, 822.84);
storeBezierPointsEven(1278.79, 822.84, 1296.04, 804.31, 1291.89, 763.15, 1259.55, 771.84);
storeBezierPointsEven(1259.55, 771.84, 1239.73, 777.11, 1260.95, 804.35, 1272.19, 800.04);
storeBezierPointsEven(1272.19, 800.04, 1216, 766.75, 1218.32, 857.53, 1172.08, 755.77);
storeBezierPointsEven(1172.08, 755.77, 1138.58, 616.94, 1185.82, 536.59, 1082.18, 409.3);
storeBezierPointsEven(1082.18, 409.3, 1067.03, 397.27, 1074.24, 441.51, 1084.59, 447.62);
storeBezierPointsEven(1084.59, 447.62, 1110.28, 484.02, 1120.36, 529.71, 1130.69, 572.43);
storeBezierPointsEven(1130.69, 572.43, 1174.75, 822.34, 1001.72, 559.27, 920.08, 522.64);
storeBezierPointsEven(920.08, 522.64, 842.21, 493.54, 828.64, 417.17, 818.02, 343.58);
storeBezierPointsEven(818.02, 343.58, 813.24, 319.42, 804.55, 476.86, 861.97, 435.61);
storeBezierPointsEven(861.97, 435.61, 912.05, 399.95, 819.93, 241.43, 807.65, 220.81);
storeBezierPointsEven(807.65, 220.81, 721.44, 267.86, 744.21, 452, 811.25, 459.93);
storeBezierPointsEven(811.25, 459.93, 846.07, 465.62, 490.33, 227.85, 480.29, 175.9);
storeBezierPointsEven(480.29, 175.9, 573, 425.82, 1035.93, 560.32, 1105.58, 831.41);
storeBezierPointsEven(1105.58, 831.41, 1208.99, 962.85, 1375.09, 1012.18, 1507.47, 1106.42);
storeBezierPointsEven(1507.47, 1106.42, 1586.1, 1172.14, 1679.42, 1264.76, 1791.41, 1303.07);
storeBezierPointsEven(1791.41, 1303.07, 1825.23, 1289.74, 1858.51, 1237.33, 1838.08, 1204.11);
storeBezierPointsEven(1838.08, 1204.11, 1792.49, 1189.52, 1735.03, 1267.75, 1778.65, 1292.02);
storeBezierPointsEven(1778.65, 1292.02, 1794.88, 1281.91, 1849.13, 1237.55, 1815.5, 1226.54);
storeBezierPointsEven(1815.5, 1226.54, 1820.14, 1314.46, 2415.38, 1286.13, 2559.63, 1277.33);
points.push(createVector(2559.63, 1277.33));
}

function addPathPoints4() {
points.push(createVector(718.92, 453.97));
    pointsDistance.push(0)
storeBezierPointsEven(718.92, 453.97, 1022.04, 620.48, 1325.15, 786.99, 1628.24, 953.53);
storeBezierPointsEven(1628.24, 953.53, 1648.05, 916.18, 1710.52, 771.81, 1760.12, 796.1);
storeBezierPointsEven(1760.12, 796.1, 1780.62, 833.55, 1653.86, 1018.99, 1634.81, 1074.85);
storeBezierPointsEven(1634.81, 1074.85, 1630.21, 1087.17, 1618.02, 1094.25, 1607.2, 1085.35);
storeBezierPointsEven(1607.2, 1085.35, 1498.72, 1022.99, 1555.78, 867.72, 1679.36, 936.78);
storeBezierPointsEven(1679.36, 936.78, 1817.4, 977.56, 1969, 1131.75, 1823.01, 1256.49);
storeBezierPointsEven(1823.01, 1256.49, 1768.49, 1306.97, 1689.58, 1336.2, 1616.8, 1317.91);
storeBezierPointsEven(1616.8, 1317.91, 1455.44, 1250.19, 1346.3, 1084.83, 1175.8, 1024.07);
storeBezierPointsEven(1175.8, 1024.07, 1131.75, 1003.48, 1083.78, 983.67, 1056.71, 943.28);
storeBezierPointsEven(1056.71, 943.28, 990.17, 857.48, 1092.73, 729.64, 1034.47, 702.56);
storeBezierPointsEven(1034.47, 702.56, 841.7, 574.24, 643.33, 454.34, 440.11, 343.32);
storeBezierPointsEven(440.11, 343.32, 411.87, 327.9, 381.67, 310.69, 368.46, 281.36);
storeBezierPointsEven(368.46, 281.36, 348.35, 232.39, 396.66, 179.64, 433.42, 230.61);
storeBezierPointsEven(433.42, 230.61, 443.16, 238.7, 455.99, 245.32, 468.13, 241.71);
storeBezierPointsEven(468.13, 241.71, 480.26, 238.1, 486.75, 219.57, 476.31, 212.41);
storeBezierPointsEven(476.31, 212.41, 442.98, 258.83, 507.62, 316.92, 550.15, 278.91);
storeBezierPointsEven(550.15, 278.91, 558.82, 271.39, 561.57, 253.19, 550.18, 251.77);
storeBezierPointsEven(550.18, 251.77, 524.03, 253.03, 515.6, 288.85, 527.55, 310.33);
storeBezierPointsEven(527.55, 310.33, 538.47, 330.59, 559.97, 342.45, 580.32, 353.2);
storeBezierPointsEven(580.32, 353.2, 807.73, 473.34, 1035.14, 593.49, 1262.55, 713.64);
storeBezierPointsEven(1262.55, 713.64, 1297.36, 732.03, 1274.49, 751.28, 1272.07, 781.27);
storeBezierPointsEven(1272.07, 781.27, 1267.51, 826.63, 1297.72, 874.47, 1343.65, 883.31);
storeBezierPointsEven(1343.65, 883.31, 1467.04, 903.43, 1497.19, 705.21, 1374.55, 684.09);
storeBezierPointsEven(1374.55, 684.09, 1360.31, 680.8, 1344.1, 679.74, 1329.81, 683.49);
storeBezierPointsEven(1329.81, 683.49, 1317.98, 686.59, 1305.47, 699.84, 1292.81, 696.72);
storeBezierPointsEven(1292.81, 696.72, 1270.03, 691.11, 1114.73, 592.59, 1109.47, 603.86);
storeBezierPointsEven(1109.47, 603.86, 1233.49, 357.12, 1384.51, 488.97, 1553.54, 588.43);
storeBezierPointsEven(1553.54, 588.43, 1669.91, 627.68, 1795.66, 645.63, 1902.53, 708.76);
storeBezierPointsEven(1902.53, 708.76, 2025.49, 776.4, 2030.58, 948.11, 1965.55, 1058.38);
storeBezierPointsEven(1965.55, 1058.38, 2063.63, 1248.7, 2363.93, 1250.81, 2556, 1275.81);
points.push(createVector(2556, 1275.81));
}

function storeBezierPointsEven(x1, y1, cx1, cy1, cx2, cy2, x2, y2) {
  let detail = 200; // Higher value gives smoother curves
  for (let t = 0; t <= 1; t += 1 / detail) {
    let x = bezierPoint(x1, cx1, cx2, x2, t);
    let y = bezierPoint(y1, cy1, cy2, y2, t);
    points.push(createVector(x, y));
    let lastVecter=points[points.length-2];
    pointsDistance.push(dist(lastVecter.x,lastVecter.y,x,y));
  }
}

function allSerialStuff() {
  if (!navigator.serial) {
    alert("WebSerial is not supported in this browser. Try Chrome or MS Edge.");
  }
  serial.getPorts();
  serial.on("noport", makePortButton);
  serial.on("portavailable", openPort);
  serial.on("requesterror", portError);
  serial.on("data", serialEvent);
  serial.on("close", makePortButton);
  navigator.serial.addEventListener("connect", portConnect);
  navigator.serial.addEventListener("disconnect", portDisconnect);
}

function makePortButton() {
  portButton = createButton("Choose Port");
  portButton.position(10, 10);
  portButton.mousePressed(choosePort);
}

function choosePort() {
  if (portButton) portButton.show();
  serial.requestPort();
}

function openPort() {
  serial.open().then(() => {
    console.log("Port Opened");
    sendReadySignal(); 
  });
  if (portButton) portButton.hide();
}

function sendReadySignal() {
  if (serial) {
    serial.write("READY\n");
    console.log("Handshake: READY sent");
  }
}

function portError(err) {
  alert("Serial port error: " + err);
}

function portConnect() {
  console.log("Port Connected");
  serial.getPorts();
}

function portDisconnect() {
  serial.close();
  console.log("Port Disconnected");
}