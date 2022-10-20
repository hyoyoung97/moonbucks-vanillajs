// step3
// TODO 서버 요청 부분
// - [ ] 웹 서버를 실행시킨다.
// - [ ] 서버에 새로운 메뉴명이 추가될 수 있도록 요청한다.
// - [ ] 카테고리별 메뉴리스트를 불러온다.
// - [ ] 서버에 메뉴가 수정될 수 있게끔 요청한다.
// - [ ] 서버에 메뉴의 품절상태가 토글될 수 있도록 요청한다.
// - [ ] 서버에 메뉴가 삭제될 수 있도록 요청한다.

// TODO 리펙터링 부분
// - [ ] localStorage 에 저장하는 로직은 지운다.
// - [ ] fetch 비동기 api 를 사용하는 부분을 async await 을 사용하여 구현한다.

// TODO 사용자 경험
// - [ ] API 통신이 실패하는 경우에 대해 사용자가 알 수 있게 alert 으로 예외처리를 진행한다.
// - [ ] 중복되는 메뉴는 추가할 수 없다.

import {$} from "./utils/dom.js";
import localStore from "./localStore/index.js";

function App() {
  // 상태는 변하는 데이터, 이 앱에서 변하는 것은 무엇인가 - 메뉴명
  this.menu = {
    espresso: [],
    frappuccino: [],
    blended: [],
    teavana: [],
    desert: []
  };

  this.currentCategory = "espresso";

  this.init = () => {
    if (localStore.getLocalStorage()) {
      this.menu = localStore.getLocalStorage();
    }
    render();
    initEventListeners();
  }

  const render = () => {
    const template =  this.menu[this.currentCategory].map((menuItem, index) => {
      return `
        <li data-menu-id="${index}" class="menu-list-item d-flex items-center py-2">
          <span class="${menuItem.soldOut ? "sold-out" : ""} w-100 pl-2 menu-name">${menuItem.name}</span> 
           <button
           type="button"
           class="bg-gray-50 text-gray-500 text-sm mr-1 menu-sold-out-button"
           >
           품절
          </button>
          <button
          type="button"
          class="bg-gray-50 text-gray-500 text-sm mr-1 menu-edit-button"
          >
          수정
          </button>
          <button
          type="button"
          class="bg-gray-50 text-gray-500 text-sm menu-remove-button"
          >
          삭제
          </button>
        </li>`
    }).join("");

    $("#menu-list").innerHTML = template;
    updateMenuCount();
  }

  const addMenuName = () => {
    if ($("#menu-name").value === '') {
      alert("값을 입력해주세요.");
      return;
    }
    const menuName = $("#menu-name").value;
    this.menu[this.currentCategory].push({name: menuName});
    localStore.setLocalStorage(this.menu);
    render();
    $("#menu-name").value = '';
  }

  const updateMenuCount = () => {
    $(".menu-count").innerText = `총 ${this.menu[this.currentCategory].length}개`
  }

  const updateMenuName = (e) => {
    const menuId = e.target.closest("li").dataset.menuId;
    const $menuName = e.target.closest("li").querySelector(".menu-name");
    const updateMenuName = prompt("메뉴명을 수정해 주세요", $menuName.innerText);
    this.menu[this.currentCategory][menuId].name = updateMenuName;
    localStore.setLocalStorage(this.menu);
    render();
  }

  const removeMenuName = (e) => {
    if (confirm("정말 삭제할까요?")) {
      const menuId = e.target.closest("li").dataset.menuId;
      this.menu[this.currentCategory].splice(menuId, 1);
      localStore.setLocalStorage(this.menu);
      render();
    }
  }

  const soldOutMenu = (e) => {
    const menuId = e.target.closest("li").dataset.menuId;
    this.menu[this.currentCategory][menuId].soldOut = !this.menu[this.currentCategory][menuId].soldOut;
    localStore.setLocalStorage(this.menu);
    console.log(this.menu);
    render();
  }

  const initEventListeners = () => {

    // form 태그가 자동으로 전송되는 것을 막아준다. submit: form 이 전송되는 이벤트 명
    $("#menu-form").addEventListener("submit", (e) => {
      e.preventDefault();
    })

    // 추가 - 확인버튼
    $("#menu-submit-button").addEventListener("click", (e) => {
      addMenuName();
    })

    // 추가 - 엔터키
    $("#menu-name").addEventListener("keypress", (e) => {
      if (e.key !== "Enter") {
        return;
      }
      addMenuName();
    })

    // 수정/삭제/품절 - 버튼
    $("#menu-list").addEventListener("click", (e) => {
      if (e.target.classList.contains("menu-edit-button")) {
        updateMenuName(e);
        return;
      }
      if (e.target.classList.contains("menu-remove-button")) {
        removeMenuName(e);
        return;
      }
      if (e.target.classList.contains("menu-sold-out-button")) {
        soldOutMenu(e);
        return;
      }
    })

    $("nav").addEventListener("click", (e) => {
      const isCategoryButton = e.target.classList.contains("cafe-category-name");
      if (isCategoryButton) {
        const categoryName = e.target.dataset.categoryName;
        this.currentCategory = categoryName;
        $("#category-title").innerText = `${e.target.innerText} 메뉴 관리`;
        render();
      }
    })
  }
}

const app = new App();
app.init();