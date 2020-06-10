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
      },
      // 각 message에 적용시킬 css 값
      values: {
        // start, end는 애니메이션이 재생되는 구간의 비율
        message1_opacity_in: [0, 1, { start: 0.1, end: 0.2 }], // 나타날 때
        message1_opacity_out: [1, 0, { start: 0.23, end: 0.3 }], // 사라질 때
        message2_opacity_in: [0, 1, { start: 0.3, end: 0.4 }],
      },
    },
    {
      // section 2
      type: "normal",
      heightNum: 5,
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

  // section의 높이 설정 함수
  const setLayout = () => {
    for (let i = 0; i < sceneInfo.length; i++) {
      // 각 섹션의 높이 = 5 * 브라우저의 높이
      sceneInfo[i].scrollHeight = sceneInfo[i].heightNum * window.innerHeight;
      // section의 높이로 적용
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
  };

  const calcValues = (value, currentYoffset) => {
    let res;
    const scrollHeight = sceneInfo[currentScene].scrollHeight;
    // 현재 섹션에서 스크롤의 위치 비율
    const scrollRatio = currentYoffset / scrollHeight;

    if (!!value[2]) {
      // start, end 사이에 애니메이션 실행
      const startPoint = value[2].start * scrollHeight;
      const endPoint = value[2].end * scrollHeight;
      // 애니메이션이 실행 되는 구간의 높이
      const scrollPointHeight = endPoint - startPoint;
      // 애니메이셔이 실행되는 구간안에서만
      if (currentYoffset >= startPoint && currentYoffset <= endPoint) {
        // console.log((currentYoffset - startPoint) / scrollPointHeight);
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

    // 현재 씬에서만 애니메이션이 적용되도록 분기 처리
    switch (currentScene) {
      case 0:
        let message1_opcaity_in = calcValues(values.message1_opacity_in, currentYoffset);
        let message1_opcaity_out = calcValues(values.message1_opacity_out, currentYoffset);

        if (scrollRatio <= 0.22) {
          obj.message1.style.opacity = message1_opcaity_in;
        } else {
          obj.message1.style.opacity = message1_opcaity_out;
        }

        // css
        break;
      case 1:
        break;
      case 2:
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
  window.addEventListener("load", setLayout);
})();
