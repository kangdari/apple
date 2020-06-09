"use strict";

// 즉시 실행 함수
// 전역 변수 사용을 피하기 위해서
(() => {
  let yOffset = 0; // window.pageYOffset: 현재 스크롤 위치
  let prevScrollHeight = 0; // 현재 스크롤 위치(yOffset)보다 이전에 위치한 스크롤 섹션들의 scrollHeight 합.
  let currentScene = 0; // 현재 보여지는 씬  = scroll_section

  const sceneInfo = [
    // 4개의 section 정보
    {
      // section 1
      type: "sticky",
      heightNum: 5, // 브라우저의 높이의 5배로 scrollHeight 세팅
      scrollHeight: 0,
      obj: {
        container: document.querySelector("#scroll_section_01"),
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
      sceneInfo[
        i
      ].obj.container.style.height = `${sceneInfo[i].scrollHeight}px`;
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

  // 활성화 시킬 scene의 번호 설정
  const scrollLoop = () => {
    prevScrollHeight = 0;
    // 현재 씬 이전의 씬들의 스크롤 높이 합 계산.
    for (let i = 0; i < currentScene; i++) {
      prevScrollHeight += sceneInfo[i].scrollHeight;
    }

    // 현재 스크롤 위치 > 이전 씬들의 스크롤 높이 합(현재씬-1 개) + 현재 씬의 스크롤 높이
    // 즉 섹션이 바뀔 때...
    if (yOffset > prevScrollHeight + sceneInfo[currentScene].scrollHeight) {
      currentScene++;
      document.body.setAttribute("id", `show_scene_0${currentScene + 1}`);
    }
    // 현재 스크롤 위치 < 이전 씬들의 스크롤 높이 합
    // 섹션이 바뀔 때
    if (yOffset < prevScrollHeight) {
      // currentScene이 -1 되는 경우를 방지
      if (currentScene === 0) return;
      currentScene--;
      document.body.setAttribute("id", `show_scene_0${currentScene + 1}`);
    }

    // body 요소에 현재 씬 관련 아이디 값을 설정하면
    // 씬에 해당하는 .stick_elem 요소가 보임
    // document.body.setAttribute("id", `show_scene_0${currentScene + 1}`);
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
