"use strict";

// 즉시 실행 함수
// 전역 변수 사용을 피하기 위해서
(() => {
  let yOffset = 0; // window.pageYOffset: 현재 스크롤 위치
  let prevScrollHeight = 0; // 현재 스크롤 위치(yOffset)보다 이전에 위치한 스크롤 섹션들의 scrollHeight 합.
  let currentScene = 0; // 현재 보여지는 씬  = scroll_section
  let changeScene = false; // 씬이 바뀌는 순간 true

  const sceneInfo = [
    // 4개의 section 정보
    {
      // section 1
      type: "sticky",
      heightNum: 5, // 브라우저의 높이의 5배로 scrollHeight 세팅
      scrollHeight: 0,
      // DOM 요소
      obj: {
        container: document.querySelector("#scroll_section_01"),
        message1: document.querySelector("#scroll_section_01 .main_message_1"),
        message2: document.querySelector("#scroll_section_01 .main_message_2"),
        message3: document.querySelector("#scroll_section_01 .main_message_3"),
        message4: document.querySelector("#scroll_section_01 .main_message_4"),
        // canvas
        canvas: document.querySelector("#video_canvas_1"), // canvas 객체
        context: document.querySelector("#video_canvas_1").getContext("2d"), // canvas.context 객체
        videoImages: [], // img 객체를 담아둘 배열
      },
      // 각 message에 적용시킬 css 값
      values: {
        // video
        videoImageCount: 300, // 사용할 이미지 파일 수
        imageSequence: [0, 299], // 이미지 시작, 끝 인덱스 번호
        canvas_opacity_out: [1, 0, { start: 0.9, end: 1 }], // canvas의 opacity
        // start, end는 애니메이션이 재생되는 구간의 비율
        message1_opacity_in: [0, 1, { start: 0.1, end: 0.2 }], // 나타날 때 투명도
        message1_opacity_out: [1, 0, { start: 0.23, end: 0.3 }], // 사라질 때 투명도
        // y축을 기준으로 이동하므로 처음 나타날때는 20% 위치에서 0으로 이동하고
        // 사라질 때는 0에서 위로 이동(-20%)
        message1_translateY_in: [20, 0, { start: 0.1, end: 0.2 }], // 나타날 때 움직임
        message1_translateY_out: [0, -20, { start: 0.23, end: 0.3 }], // 사라질 때 움직임
        // message2
        message2_opacity_in: [0, 1, { start: 0.3, end: 0.4 }],
        message2_opacity_out: [1, 0, { start: 0.43, end: 0.5 }],
        message2_translateY_in: [20, 0, { start: 0.3, end: 0.4 }],
        message2_translateY_out: [0, -20, { start: 0.43, end: 0.5 }],
        // message3
        message3_opacity_in: [0, 1, { start: 0.5, end: 0.6 }],
        message3_opacity_out: [1, 0, { start: 0.63, end: 0.7 }],
        message3_translateY_in: [20, 0, { start: 0.5, end: 0.6 }],
        message3_translateY_out: [0, -20, { start: 0.63, end: 0.7 }],
        // message4
        message4_opacity_in: [0, 1, { start: 0.7, end: 0.8 }],
        message4_opacity_out: [1, 0, { start: 0.83, end: 0.9 }],
        message4_translateY_in: [20, 0, { start: 0.7, end: 0.8 }],
        message4_translateY_out: [0, -20, { start: 0.83, end: 0.9 }],
      },
    },
    {
      // section 2
      type: "normal",
      // heightNum: 5, // default 높이로 설정하기 때문에 필요 없음
      scrollHeight: 0,
      obj: {
        container: document.querySelector("#scroll_section_02"),
      },
    },
    {
      // section 3
      type: "sticky",
      heightNum: 5,
      scrollHeight: 0,
      obj: {
        container: document.querySelector("#scroll_section_03"),
        message1: document.querySelector("#scroll_section_03 .main_message_1"),
        message2: document.querySelector("#scroll_section_03 .main_message_2"),
        message3: document.querySelector("#scroll_section_03 .main_message_3"),
        pin2: document.querySelector("#scroll_section_03 .main_message_2 .pin"),
        pin3: document.querySelector("#scroll_section_03 .main_message_3 .pin"),
      },
      values: {
        message1_opacity_in: [0, 1, { start: 0.15, end: 0.2 }], // 나타날 때 투명도
        message1_opacity_out: [1, 0, { start: 0.3, end: 0.35 }], // 사라질 때 투명도
        message1_translateY_in: [20, 0, { start: 0.15, end: 0.2 }], // 나타날 때 움직임
        message1_translateY_out: [0, -20, { start: 0.3, end: 0.35 }], // 사라질 때 움직임
        // message2
        message2_opacity_in: [0, 1, { start: 0.5, end: 0.55 }],
        message2_opacity_out: [1, 0, { start: 0.58, end: 0.63 }],
        message2_translateY_in: [30, 0, { start: 0.5, end: 0.55 }],
        message2_translateY_out: [0, -30, { start: 0.58, end: 0.63 }],
        pin2_scaleY: [0.5, 1, { start: 0.5, end: 0.55 }],
        // message3
        message3_opacity_in: [0, 1, { start: 0.72, end: 0.77 }],
        message3_opacity_out: [1, 0, { start: 0.85, end: 0.9 }],
        message3_translateY_in: [20, 0, { start: 0.72, end: 0.77 }],
        message3_translateY_out: [0, -20, { start: 0.85, end: 0.9 }],
        pin3_scaleY: [0.5, 1, { start: 0.72, end: 0.77 }],
      },
    },
    {
      // section 4
      type: "sticky",
      heightNum: 5,
      scrollHeight: 0,
      obj: {
        container: document.querySelector("#scroll_section_04"),
      },
    },
  ];

  // videoImages 배열 설정 함수
  const setCanvasImage = () => {
    let imgElem;
    // 이미지 수만큼 이미지 객체를 생성하고 src 속성 값 설정 후
    // videoImages 배열에 push
    for (let i = 0; i < sceneInfo[0].values.videoImageCount; i++) {
      imgElem = new Image();
      // imgElem = document.createElement('img');
      imgElem.src = `/video/001/IMG_${6726 + i}.JPG`;
      sceneInfo[0].obj.videoImages.push(imgElem);
    }
  };

  setCanvasImage();

  // section의 높이 설정 함수
  const setLayout = () => {
    for (let i = 0; i < sceneInfo.length; i++) {
      // 애니메이션이 필요한 섹션에만 높이를 추가 설정
      if (sceneInfo[i].type === "sticky") {
        // 각 섹션의 높이 = 5 * 브라우저의 높이
        sceneInfo[i].scrollHeight = sceneInfo[i].heightNum * window.innerHeight;
      } else if (sceneInfo[i].type === "normal") {
        sceneInfo[i].scrollHeight = sceneInfo[i].obj.container.offsetHeight;
      }
      sceneInfo[i].obj.container.style.height = `${sceneInfo[i].scrollHeight}px`;
    }

    yOffset = window.pageYOffset;
    // 첫 로드 되었을 때 스크롤이 위치한 현재 씬을 계산
    let totalScrollHeight = 0;
    for (let i = 0; i < sceneInfo.length; i++) {
      totalScrollHeight += sceneInfo[i].scrollHeight;
      // 현재 씬 이전 까지의 스크롤 높이 합 >= 현재 스크롤 위치
      if (totalScrollHeight >= yOffset) {
        currentScene = i;
        break;
      }
    }
    document.body.setAttribute("id", `show_scene_0${currentScene + 1}`);

    // heightRatio: canvas를 브라우저 크기에 맞추기 위해서 canvas의 height와 브라우저의 높이 비율
    const heightRatio = window.innerHeight / 1080; // 브라우저의 높이 / canvas 높이

    // 1. css에서 canvas의 top, left를 50% 주고 translate3d를 이용하여 중앙 정렬.
    // 2. heightRatio 비율 값만큼 canvas의 scale에 적용해준다.
    sceneInfo[0].obj.canvas.style.transform = `translate3d(-50%, -50%, 0 ) scale(${heightRatio})`;
  };

  const calcValues = (value, currentYoffset) => {
    let res;
    // 현재 섹션 스크롤 높이
    const scrollHeight = sceneInfo[currentScene].scrollHeight;
    // 현재 섹션에서 스크롤의 위치 비율
    const scrollRatio = currentYoffset / scrollHeight;

    if (value[2]) {
      // start, end 사이에 애니메이션 실행
      const startPoint = value[2].start * scrollHeight; // 섹션에서의 시작점 비율
      const endPoint = value[2].end * scrollHeight; // 섹션에서의 끝점 비율
      // 애니메이션이 실행 되는 구간의 높이
      const scrollPointHeight = endPoint - startPoint;
      // 애니메이션이 실행되는 구간안에서만
      if (currentYoffset >= startPoint && currentYoffset <= endPoint) {
        // !!! res는 = 애니메이션이 실행되는 구간의 비율 * value의 범위, value[0]를 더해주는 것은 시작점을 초기값으로 하기 위해서
        res = ((currentYoffset - startPoint) / scrollPointHeight) * (value[1] - value[0]) + value[0];
      } else if (currentYoffset < startPoint) {
        // 애니메이션 시작점 이전일 때 초기 값
        res = value[0];
      } else if (currentYoffset > endPoint) {
        // 애니메이션 끝점 이후일 때 초기 값
        res = value[1];
      }
    } else {
      // value의 비율에 맞게 변환
      res = scrollRatio * (value[1] - value[0]) + value[0];
    }
    // console.log(res);
    return res;
  };

  const playAnimation = () => {
    const obj = sceneInfo[currentScene].obj;
    const values = sceneInfo[currentScene].values;
    // currentYoffst: 섹션에서의 현재 스크롤 위치
    const currentYoffset = yOffset - prevScrollHeight;
    // 현재 씬의 스크롤 높이
    const scrollHeight = sceneInfo[currentScene].scrollHeight;
    // 현재 씬에서의 스크롤 위치 비율
    const scrollRatio = currentYoffset / scrollHeight;
    // console.log(scrollRatio)

    // 현재 씬에서만 애니메이션이 적용되도록 분기 처리
    switch (currentScene) {
      case 0:
        // 동영상(이미지)은 섹션의 시작부터 끝까지 실행되어야 하기 때문에 분기 처리를 하지 않습니다.
        let sequence = Math.round(calcValues(values.imageSequence, currentYoffset)); // 정수로 변경
        obj.context.drawImage(obj.videoImages[sequence], 0, 0); // (file, x축, y축)
        obj.canvas.style.opacity = calcValues(values.canvas_opacity_out, currentYoffset); // canvas opacity 0으로...
        // 필요한 상황에만 연산하도록 코드 수정
        if (scrollRatio <= 0.22) {
          // in
          obj.message1.style.opacity = calcValues(values.message1_opacity_in, currentYoffset);
          obj.message1.style.transform = `translate3d(0, ${calcValues(values.message1_translateY_in, currentYoffset)}%, 0)`;
        } else if (scrollRatio > 0.22) {
          // out
          obj.message1.style.opacity = calcValues(values.message1_opacity_out, currentYoffset);
          obj.message1.style.transform = `translate3d(0, ${calcValues(values.message1_translateY_out, currentYoffset)}%, 0)`;
        }
        // message2
        if (scrollRatio <= 0.42) {
          //in
          obj.message2.style.opacity = calcValues(values.message2_opacity_in, currentYoffset);
          obj.message2.style.transform = `translate3d(0, ${calcValues(values.message2_translateY_in, currentYoffset)}%, 0)`;
        } else if (scrollRatio > 0.42) {
          // out
          obj.message2.style.opacity = calcValues(values.message2_opacity_out, currentYoffset);
          obj.message2.style.transform = `translate3d(0, ${calcValues(values.message2_translateY_out, currentYoffset)}%, 0)`;
        }
        // message 3
        if (scrollRatio <= 0.62) {
          //in
          obj.message3.style.opacity = calcValues(values.message3_opacity_in, currentYoffset);
          obj.message3.style.transform = `translateY(${calcValues(values.message3_translateY_in, currentYoffset)}px)`;
        } else if (scrollRatio > 0.62) {
          // out
          obj.message3.style.opacity = calcValues(values.message3_opacity_out, currentYoffset);
          obj.message3.style.transform = `translateY(${calcValues(values.message3_translateY_out, currentYoffset)}px)`;
        }
        // message 4
        if (scrollRatio <= 0.82) {
          //in
          obj.message4.style.opacity = calcValues(values.message4_opacity_in, currentYoffset);
          obj.message4.style.transform = `translateY(${calcValues(values.message4_translateY_in, currentYoffset)}px)`;
        } else if (scrollRatio > 0.82) {
          // out
          obj.message4.style.opacity = calcValues(values.message4_opacity_out, currentYoffset);
          obj.message4.style.transform = `translateY(${calcValues(values.message4_translateY_out, currentYoffset)}px)`;
        }
        // css
        break;
      // section 2(case 1)는 애니메이션이 없으므로 제외
      case 2:
        // section 3
        if (scrollRatio <= 0.22) {
          // in
          obj.message1.style.opacity = calcValues(values.message1_opacity_in, currentYoffset);
          obj.message1.style.transform = `translate3d(0, ${calcValues(values.message1_translateY_in, currentYoffset)}%, 0)`;
        } else if (scrollRatio > 0.22) {
          // out
          obj.message1.style.opacity = calcValues(values.message1_opacity_out, currentYoffset);
          obj.message1.style.transform = `translate3d(0, ${calcValues(values.message1_translateY_out, currentYoffset)}%, 0)`;
        }
        // message2
        if (scrollRatio <= 0.57) {
          //in
          obj.message2.style.opacity = calcValues(values.message2_opacity_in, currentYoffset);
          obj.message2.style.transform = `translate3d(0, ${calcValues(values.message2_translateY_in, currentYoffset)}%, 0)`;
          obj.pin2.style.transform = `scaleY(${calcValues(values.pin2_scaleY, currentYoffset)})`;
        } else {
          // out
          obj.message2.style.opacity = calcValues(values.message2_opacity_out, currentYoffset);
          obj.message2.style.transform = `translate3d(0, ${calcValues(values.message2_translateY_out, currentYoffset)}%, 0)`;
        }
        // message 3
        if (scrollRatio <= 0.8) {
          //in
          obj.message3.style.opacity = calcValues(values.message3_opacity_in, currentYoffset);
          obj.message3.style.transform = `translate3d(0, ${calcValues(values.message3_translateY_in, currentYoffset)}%, 0)`;
          obj.pin3.style.transform = `scaleY(${calcValues(values.pin3_scaleY, currentYoffset)})`;
        } else if (scrollRatio > 0.8) {
          // out
          obj.message3.style.opacity = calcValues(values.message3_opacity_out, currentYoffset);
          obj.message3.style.transform = `translate3d(0, ${calcValues(values.message3_translateY_out, currentYoffset)}%, 0)`;
        }
        break;
      case 3:
        break;
    }
  };

  // 활성화 시킬 scene의 번호 설정
  const scrollLoop = () => {
    changeScene = false;
    prevScrollHeight = 0;
    // 현재 씬 이전의 씬들의 스크롤 높이 합 계산.
    for (let i = 0; i < currentScene; i++) {
      prevScrollHeight += sceneInfo[i].scrollHeight;
    }

    // 현재 스크롤 위치 > 이전 씬들의 스크롤 높이 합(현재씬-1 개) + 현재 씬의 스크롤 높이
    // 즉 섹션이 바뀔 때...
    if (yOffset > prevScrollHeight + sceneInfo[currentScene].scrollHeight) {
      currentScene++;
      changeScene = true; // 씬이 바뀌는 순간 true로 변경
      // body 요소에 현재 씬 관련 아이디 값을 설정하면
      // 씬에 해당하는 .stick_elem 요소가 보임
      document.body.setAttribute("id", `show_scene_0${currentScene + 1}`);
    }
    // 현재 스크롤 위치 < 이전 씬들의 스크롤 높이 합
    // 섹션이 바뀔 때
    if (yOffset < prevScrollHeight) {
      changeScene = true; // 씬이 바뀌는 순간 true로 변경
      // currentScene이 -1 되는 경우를 방지
      if (currentScene === 0) return;
      currentScene--;
      document.body.setAttribute("id", `show_scene_0${currentScene + 1}`);
    }

    // 씬이 바뀌는 순간에는 종료
    if (changeScene) return;

    playAnimation();
  };

  // 브라우저의 사이즈가 변경되면 section의 높이를 재설정
  window.addEventListener("resize", setLayout);
  window.addEventListener("scroll", () => {
    yOffset = window.pageYOffset;
    scrollLoop();
  });

  // DOMContentLoaded: html 요소들으 로드될 때
  // window.addEventListener("DOMContentLoaded", setLayout);

  // load: html요소들과 img와 같은 리소스들도 로드될 때
  // 문서가 로드되면 setLayout 실행.
  window.addEventListener("load", () => {
    setLayout();
    // 로드가 끝나고 동영상 첫 이미지를 캔버스에 그려줌.
    sceneInfo[0].obj.context.drawImage(sceneInfo[0].obj.videoImages[0], 0, 0); // (file, x축, y축)
  });
})();
