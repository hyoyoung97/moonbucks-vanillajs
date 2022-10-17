// 오늘 얻은 인사이트
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

const $ = (selector) => document.querySelector(selector);

function App() {
  const addMenuName = () => {
    if ($("#espresso-menu-name").value === '') {
      alert("값을 입력해주세요.");
      return;
    }
    const espressoMenuName = $("#espresso-menu-name").value;
    const menuItemTemplate = (espressoMenuName) => {
      return `
        <li class="menu-list-item d-flex items-center py-2">
          <span class="w-100 pl-2 menu-name">${espressoMenuName}</span>
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
    };
    $("#espresso-menu-list").insertAdjacentHTML('beforeend', menuItemTemplate(espressoMenuName));
    updateMenuCount();
    $("#espresso-menu-name").value = '';
  }

  const updateMenuCount = () => {
    const menuCount = $("#espresso-menu-list").querySelectorAll("li").length;
    $(".menu-count").innerText = `총 ${menuCount}개`
  }

  const updateMenuName = (e) => {
    const $menuName = e.target.closest("li").querySelector(".menu-name");
    const updateMenuName = prompt("메뉴명을 수정해 주세요", $menuName.innerText);
    $menuName.innerText = updateMenuName;
  }

  const removeMenuName = (e) => {
    if (confirm("정말 삭제할까요?")) {
      e.target.closest("li").remove();
      updateMenuCount();
    }
  }

  // form 태그가 자동으로 전송되는 것을 막아준다. submit: form 이 전송되는 이벤트 명
  $("#espresso-menu-form").addEventListener("submit", (e) => {
    e.preventDefault();
  })

  // 추가 - 확인버튼
  $("#espresso-menu-submit-button").addEventListener("click", (e) => {
    addMenuName();
  })

  // 추가 - 엔터키
  $("#espresso-menu-name").addEventListener("keypress", (e) => {
    if (e.key !== "Enter") {
      return;
    }
    addMenuName();
  })

  // 수정/삭제 - 버튼
  $("#espresso-menu-list").addEventListener("click", (e) => {
    if (e.target.classList.contains("menu-edit-button")) {
      updateMenuName(e);
    }
    if (e.target.classList.contains("menu-remove-button")) {
      removeMenuName(e);
    }
  })
}

App();