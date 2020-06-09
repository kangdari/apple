"use strict";

// 즉시 실행 함수
// 전역 변수 사용을 피하기 위해서
(() => {
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
    console.log(sceneInfo);
  };

  // 브라우저의 사이즈가 변경되면 section의 높이를 재설정
  window.addEventListener("resize", setLayout);
  setLayout();

  //
})();
