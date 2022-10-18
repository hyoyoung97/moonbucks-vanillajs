// step1 에서 얻은 인사이트
// 1. 바닐라js 에서 선택자를 어떻게 사용하는지 알게 돼서 좋았다.
//    -> DOM 요소를 가져올 때는 $표시를 써서 변수처럼 사용할 수 있어서 좋았다.
// 2. 더 깔끔한 코드 리팩터링에 대해 알 수 있어서 좋았다.
// 3. 새롭게 알게 된 메서드 insertAdjacentHTML, closest

// step1 요구사항
// FIXME 메뉴 추가
// - [x] 메뉴의 이름을 입력받고 엔터키로 입력을 추가한다.
// - [x] 메뉴의 이름을 입력받고 확인버튼으로 입력을 추가한다.
// - [x] 추가되는 메뉴의 마크업 `<ul id="espresso-menu-list" class="mt-3 pl-0"><ul>` 안에 삽입해야 한다.
// - [x] 총 메뉴 갯수를 count 하여 상단에 보여준다.
// - [x] 메뉴가 추가되고 나면, input 은 빈 값으로 초기화한다.
// - [x] 사용자 입력값이 빈 값이라면 추가되지 않는다.
// FIXME 메뉴 수정
// - [x] 메뉴의 수정 버튼 이벤트를 받고, 메뉴 수정하는 모달창이 뜬다.
// - [x] 모달창에서 신규메뉴명을 입력 받고, 확인버튼을 누르면 메뉴가 수정된다.
// FIXME 메뉴 삭제
// - [x] 메뉴 삭제 버튼 클릭 이벤트를 받고, 메뉴 삭제 컨펌 모달창이 뜬다.
// - [x] 확인 버튼을 클릭하면 메뉴가 삭제된다.
// - [x] 총 메뉴 갯수를 count 하여 상단에 보여준다.

// step2 요구사항
// TODO localStorage Read & Write
// - [x] localStorage 에 데이터를 저장한다.
// - [x] 추가
// - [x] 수정
// - [x] 삭제
// - [x] localStorage 에 있는 데이터를 읽어온다.
// TODO 카테고리별 메뉴판 관리
// - [x] 에스프레소 메뉴판 관리
// - [x] 프라푸치노 메뉴판 관리
// - [x] 블렌디드 메뉴판 관리
// - [x] 티바나 메뉴판 관리
// - [x] 디저트 메뉴판 관리
// TODO 페이지 접근 시 최초 데이터 Read & Rendering
// - [x] 페이지에 최초로 접근할 때 localStorage 에 에스프레소 메뉴에 읽어온다.
// - [x] 에스프레소 메뉴를 페이지에 그려준다.

// TODO 품질 상태 관리
// - [ ] 품절 버튼을 추가한다.
// - [ ] 품절 버튼을 클릭하면 localStorage 의 상태값이 저장된다.
// - [ ] 클릭 이벤트에서 가장 가까운 li 태그의 class 속성 값에 `sold-out` class 를 추가한다.

const $ = (selector) => document.querySelector(selector);

const store = {
  setLocalStorage(menu) {
    localStorage.setItem("menu", JSON.stringify(menu));
  },
  getLocalStorage() {
    return JSON.parse(localStorage.getItem("menu"));  // 문자열을 다시 객체로 변경
  }
}

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
    if (store.getLocalStorage()) {
      this.menu = store.getLocalStorage();
    }
    render();
  }

  const render = () => {
    const template =  this.menu[this.currentCategory].map((menuItem, index) => {
      return `
        <li data-menu-id="${index}" class="menu-list-item d-flex items-center py-2">
          <span class="w-100 pl-2 menu-name">${menuItem.name}</span> 
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
    store.setLocalStorage(this.menu);
    render();
    $("#menu-name").value = '';
  }

  const updateMenuCount = () => {
    const menuCount = $("#menu-list").querySelectorAll("li").length;
    $(".menu-count").innerText = `총 ${menuCount}개`
  }

  const updateMenuName = (e) => {
    const menuId = e.target.closest("li").dataset.menuId;
    const $menuName = e.target.closest("li").querySelector(".menu-name");
    const updateMenuName = prompt("메뉴명을 수정해 주세요", $menuName.innerText);
    this.menu[this.currentCategory][menuId].name = updateMenuName;
    store.setLocalStorage(this.menu);
    $menuName.innerText = updateMenuName;
  }

  const removeMenuName = (e) => {
    if (confirm("정말 삭제할까요?")) {
      const menuId = e.target.closest("li").dataset.menuId;
      this.menu[this.currentCategory].splice(menuId, 1);
      store.setLocalStorage(this.menu);
      e.target.closest("li").remove();
      updateMenuCount();
    }
  }

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

  // 수정/삭제 - 버튼
  $("#menu-list").addEventListener("click", (e) => {
    if (e.target.classList.contains("menu-edit-button")) {
      updateMenuName(e);
    }
    if (e.target.classList.contains("menu-remove-button")) {
      removeMenuName(e);
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

const app = new App();
app.init();