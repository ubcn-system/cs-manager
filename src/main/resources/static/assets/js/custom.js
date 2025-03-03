/**
 *
 * 기존의 script 파일 수정 없이 이곳에서만 수정요망.
 *
 *
 */

"use strict";
var TemplateSidebar = $('.main-sidebar');

// CHECK FOR CURRENT PAGE AND ADDS AN ACTIVE CLASS FOR TO THE ACTIVE LINK
var current = location.pathname.split("/").slice(-1)[0].replace(/^\/|\/$/g, '');
$('.sidebar-menu li a', TemplateSidebar).each(function () {
  var $this = $(this);
  if (current === "") {
    //FOR ROOT URL
    if ($this.attr('href').indexOf("dashboard.do") !== -1) {
      $(this).parents('li').last().addClass('active');
      if ($(this).parents('.dropdown-menu').length) {
        $(this).addClass('active');
      }
    }
  } else {
    //FOR OTHER URL
    if ($this.attr('href').indexOf(current) !== -1) {
      $(this).parents('li').last().addClass('active');

      /*최상단 li 처리 부분 */
      $(this).parents('li').last().addClass('active-bgc');

      if ($(this).parents('.dropdown-menu').length) {
        $(this).addClass('active');
      }
      if (current !== "dashboard.do") {
        //$(this).parents('li').last().find("a").addClass('active');
        $(this).parent('li').addClass('active');

        if ($(this).parents('.dropdown-menu').length) {
          $(this).closest('.collapse').addClass('show');
        }
      }
    }
  }
});

$(window).on("beforeunload", function () {
  if ($('#_form').val()) {
    alert("'작성 중인 글이 있습니다.'");
  }
});

//한글 불가 한글 금지
$(function () {
  $('.not-kor').on("blur keyup", function () {
    $(this).val($(this).val().replace(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/g, ''));
  });
})

/*2021.12.10 신규 gif 로 추가*/
function loadingStart() {
  //$.LoadingOverlay("show");
  $('.loading_layer').show();
};

function loadingStop() {
  //$.LoadingOverlay("hide");
  $('.loading_layer').hide();
}

/**
 * 이미지 파일 업로드
 */
function uploadSummernoteImageFile(file, editor) {
  var data = new FormData();
  data.append("file", file);
  $.ajax({
    data: data,
    type: "POST",
    url: "/uploadImageFile",
    contentType: false,
    processData: false,
    success: function (data) {
      //항상 업로드된 파일의 url이 있어야 한다.
      $(editor).summernote('insertImage', data.url);
    }
  });
}

/*
* 페이지 이동 Common Script - 상세 페이지
* */

//복수 파라미터를 위해..
function postParamsModel(action) {
  var formData = document.getElementById('formData').submit();
  alert(formData);
  $.ajax({
    cache: false,
    url: action,
    type: 'POST',
    data: formData,
    success: function () {
      Swal.fire({
        title: '<strong>완료</strong>',
        icon: 'success',
        html: '등록이 완료되었습니다.',
        showCloseButton: true,
        showCancelButton: false,
        focusConfirm: false,
        confirmButtonText: '확인',
        confirmButtonAriaLabel: 'Thumbs up, great!',
      }).then((click) => {
        window.location.reload();
      });
    }, // success
    error: function (xhr, status) {
      alert(xhr + " : " + status);
    }
  });
}

function checkboxToggle(target) {
  target = $('#' + target);
  if (!target.is(":checked")) {
    target.prop('checked', true);
  } else {
    target.prop('checked', false);
  }
}

function postParams(action, params) {
  var form = document.createElement('form');
  form.setAttribute('method', 'POST');
  form.setAttribute('action', action);
  form.setAttribute('charset', 'UTF-8');
  for (let key in params) {
    let hiddenField = document.createElement('input');
    hiddenField.setAttribute('type', 'hidden');
    hiddenField.setAttribute('name', key);
    hiddenField.setAttribute('value', params[key]);
    form.appendChild(hiddenField);
  }
  document.body.appendChild(form);
  form.submit();
}

function removeTagRow(rmEl) {
  $("." + rmEl + "").remove();
}

function adminPop(action) {
  window.open(action, "popup",
      "toolbar=no, width=750, height=750, directories=no, status=no, resizable=no");
}

function postParamsPop(action, params) {
  var form = document.createElement('form');
  form.setAttribute('method', 'POST');
  form.setAttribute('action', action);
  form.setAttribute('charset', 'UTF-8');
  form.setAttribute('target', 'popup');
  for (var key in params) {
    var hiddenField = document.createElement('input');
    hiddenField.setAttribute('type', 'hidden');
    hiddenField.setAttribute('name', key);
    hiddenField.setAttribute('value', params[key]);
    form.appendChild(hiddenField);
  }
  document.body.appendChild(form);
  window.open(action, "popup",
      "toolbar=no, width=790, height=720, directories=no, status=no, resizable=no");
  form.submit();
}

/*
* 등록 및 수정 - 상세 페이지
* */
function confirmPost(action) {
  $.ajax({
    cache: false,
    url: action,
    type: 'POST',
    data: $("#formData").serialize(),
    success: function () {
      Swal.fire({
        title: '<strong>완료</strong>',
        icon: 'success',
        html: '완료되었습니다.',
        showCloseButton: true,
        showCancelButton: false,
        focusConfirm: false,
        confirmButtonText: '확인',
        confirmButtonAriaLabel: 'Thumbs up, great!',
      }).then((click) => {
        window.location.reload();
      });
    }, // success
    error: function () {
      alert("최소 하나 이상의 정보가 필요합니다.");
    }
  });
}

function cancelConfirmPost(action, params) {
  Swal.fire({
    title: '정말로 취소하시겠습니까?',
    text: "취소 시, 복구할 수 없습니다!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#6777ef',
    cancelButtonColor: '#fc544b',
    confirmButtonText: '승인',
    cancelButtonText: '취소'
  }).then((result) => {
    if (result.isConfirmed) {
      $.ajax({
        cache: false,
        url: action,
        type: 'POST',
        data: params,
        success: function () {
          Swal.fire({
            title: '<strong>완료</strong>',
            icon: 'success',
            html: '완료되었습니다.',
            showCloseButton: true,
            showCancelButton: false,
            focusConfirm: false,
            confirmButtonText: '확인',
            confirmButtonAriaLabel: 'Thumbs up, great!',
          }).then((click) => {
            window.location.reload();
          });
        }, // success
        error: function (xhr, status) {
          alert(xhr + " : " + status);
        }
      });
    }
  })
}

//DESC: 유효성검사
function _searchTypeValid() {
  $('#searchValue').val('');
}

function _searchValid(obj) {
  if ($('#searchType option:selected').val().includes('COUPON')) {
    $('#searchValue').attr('maxlength', '12');
  } else if ($('#searchType option:selected').val().includes('REV')) {
    $('#searchValue').attr('maxlength', '13');
    addHyphenPhoneNo(obj);
  } else if ($('#searchType option:selected').val().includes('REV')) {
    $('#searchValue').attr('maxlength', '10');
  }
}

function validationCheck() {
  const sDate = moment($('#sDate').val(), 'YYYYMMDD');
  const eDate = moment($('#eDate').val(), 'YYYYMMDD');

  if ($('#searchValue').val().length > 0 &&
      ($('#searchType').val() == null || $('#searchType').val() == '')) {
    alert('검색타입을 선택해주세요.');
    $('#searchType').focus();
    event.preventDefault();
  } else if (
      ($('#searchType option:selected').val().includes('TCB') ||
          $('#searchType option:selected').val().includes('TCS')) &&
      ($('#searchValue').val() == null || $('#searchValue').val() == '')) {
    alert('검색내용을 입력해주세요.');
    $('#searchValue').focus();
    event.preventDefault();

  } else if (eDate.diff(sDate, 'days') > 32) {        // 언제까지 실행하기
    alert('최대 검색 기간인 한 달을 초과하였습니다');
    event.preventDefault();
  } else {
    $('#formData').submit();
  }
}

//빙고뮤(쿠폰 연락처 '-')
function addHyphenPhoneNo(obj) {
  var number = obj.value.replace(/[^0-9]/g, "");
  var phoneNo = '';
  if (number.length < 4) {
    return number;
  } else if (number.length <= 5) {
    phoneNo += number.substr(0, 3);
    phoneNo += '-';
    phoneNo += number.substr(3);
  } else if (number.length < 10) {
    phoneNo += number.substr(0, 3);
    phoneNo += '-';
    phoneNo += number.substr(3, 4);
    phoneNo += '-';
    phoneNo += number.substr(7);
  } else {
    phoneNo += number.substr(0, 3);
    phoneNo += '-';
    phoneNo += number.substr(3, 4);
    phoneNo += '-';
    phoneNo += number.substr(7);
  }
  obj.value = phoneNo;
}

$(function () {
  var companyList = new Array();
  $(".my-select2").select2();
  /*$("#newEntry").on("click", function () {
      $("#bizList").empty();  //#bizList 하위 초기화
      $("#selectOption").text($("#vmmsCompany :selected").text());           //소속명 HTML에 보여주기 위함
      $("#selectOption").attr('title',$("#vmmsCompany :selected").val());    //소속 SEQ
      $("#selectOption").attr('value',$("#vmmsCompany :selected").text());   //소속명 value
      $("#selectOption").attr('onclick',"popBiz("+$("#vmmsCompany :selected").val()+");");   //소속명 value
      $("#removeBtn").attr('title',$("#vmmsCompany :selected").val());       //삭제버튼에 소속 SEQ

      var data = new Object() ;
      data.seq = $("#function-template > #selectOption").attr('title');
      data.name = $("#function-template > #selectOption").attr('value');
      companyList.push(data);
      popBiz($("#vmmsCompany :selected").val());

      $(".add_field").html($(".vmmsFormGrpSpan").clone());
      $(".add_field #function-template").css('display','block');
      $(".add_field #function-label").css('display','none');
  });*/

  $(document).on("click", "button.removeEntry", function () {
    var rmSelector = $(this).siblings('span').attr('title');
    //alert('선택된 값 : '+rmSelector);

    var json_idx = companyList.findIndex(function (key) {
      return key.seq === rmSelector
    });
    companyList.splice(json_idx, 1);
    $(this).parents("div.vmmsFormGrpSpan").remove();
  });
});

//카드결제시스템(날짜를 무조건 2자리로 만들기 위함)
function scriptDateFormat(date) {
  var year = date.getFullYear();
  var month = (1 + date.getMonth());
  month = month >= 10 ? month : '0' + month;
  var day = date.getDate();
  day = day >= 10 ? day : '0' + day;
  return year + '' + month + '' + day;
}

function diffDate() {
  const sDate = moment($('#sDate').val(), 'YYYYMMDD');
  const eDate = moment($('#eDate').val(), 'YYYYMMDD');
  if (eDate.diff(sDate, 'days') > 32) {        // 언제까지 실행하기
    alert('최대 검색 기간인 한 달을 초과하였습니다');
    return false;
  }
}

function excelTemplate(target) {
  let queryString = "?page=" + 0;
  location.href = "/api/" + target + "/excelTemplate" + queryString;
}

function excelDownload(target) {
  let queryString = "?page=" + 0;
  location.href = "/api/" + target + "/excel" + queryString;
  /*$.ajax({
    type: "GET",
    url: "/api/" + target + "/excel" + queryString,
    cache: false,
    success: function () {

    },
    error: function (xhr, status) {
      alert(xhr + " : " + status);
    }
  });*/

}

//천단위 (,) 생성
function numberWithCommas(number) {

  if (isNaN(number)) {
    number = parseInt(number);
  }
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function convertDateFormat(date, format) {
  let dateSplit = date;
  if (date.indexOf("T") != -1) {
    dateSplit = date.split("T");
    dateSplit = dateSplit[0] + ' ' + dateSplit[1].substring(0, 8);
  }

  switch (format) {
    case 'YYYY-MM-DD':
      dateSplit = dateSplit.substring(0, 10);
      break;
    case 'YYYY-MM-DD HH:MM:SS':
      dateSplit = dateSplit;
      break;
    case 'YYYY-MM-DD HH:MM':
      dateSplit = dateSplit.substring(0, 16);
      break;
    case 'YYYY-MM-DD HH:MM:SS':
      dateSplit = dateSplit.substring(0, 19);
      break;
  }
  return dateSplit;
}

function createPagination(page, target) {
  let html = "";
  if (page.startPage > 10) {
    html += '<li class="page-item"><a href="#" class="page-link" onclick="callList(\'' + 1 + '\' ,\'' + target + '\')">처음</a></li>';
  }
  if (page.startPage > 1) {
    html += '<li class="page-item"><a href="#" class="page-link" onclick="callList(\'' + (page.startPage - 1) + '\' ,\'' + target + '\')">'
        + '<i class="custom-fas fas fa-chevron-left"></i></a></li>';
  }
  for (let i = page.startPage; i <= page.endPage; i++) {
    html += '<li class="page-item ' + (page.pageNum == i ? 'active' : '') + '">';
    html += '<a href="#" class="page-link" onclick="callList(\'' + i + '\' ,\'' + target + '\')">'
        + i + '</a>';
    html += '</li>';
  }
  if ((page.endPage - page.startPage) > 8) {
    html += '<li class="page-item"><a href="#" class="page-link" onclick="callList(\'' + (page.endPage + 1) + '\' ,\'' + target + '\')">'
        + '<i class="custom-fas fas fa-chevron-right"></i></a></li>';
  }
  if (page.startPage > 10 && page.pages != page.endPage) {
    html += '<li class="page-item"><a href="#" class="page-link" '
        + 'onclick="callList(\'' + page.pages + '\' ,\'' + target + '\')">마지막</a></li>';
  }
  $('.pagination').html(html);
}
