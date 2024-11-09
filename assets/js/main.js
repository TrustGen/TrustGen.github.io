/**
* Template Name: Anyar
* Template URL: https://bootstrapmade.com/anyar-free-multipurpose-one-page-bootstrap-theme/
* Updated: Aug 07 2024 with Bootstrap v5.3.3
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/

(function() {
  "use strict";

  /**
   * Apply .scrolled class to the body as the page is scrolled down
   */
  function toggleScrolled() {
    const selectBody = document.querySelector('body');
    const selectHeader = document.querySelector('#header');
    if (!selectHeader.classList.contains('scroll-up-sticky') && !selectHeader.classList.contains('sticky-top') && !selectHeader.classList.contains('fixed-top')) return;
    window.scrollY > 100 ? selectBody.classList.add('scrolled') : selectBody.classList.remove('scrolled');
  }

  document.addEventListener('scroll', toggleScrolled);
  window.addEventListener('load', toggleScrolled);

  /**
   * Mobile nav toggle
   */
  const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');

  function mobileNavToogle() {
    document.querySelector('body').classList.toggle('mobile-nav-active');
    mobileNavToggleBtn.classList.toggle('bi-list');
    mobileNavToggleBtn.classList.toggle('bi-x');
  }
  mobileNavToggleBtn.addEventListener('click', mobileNavToogle);

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll('#navmenu a').forEach(navmenu => {
    navmenu.addEventListener('click', () => {
      if (document.querySelector('.mobile-nav-active')) {
        mobileNavToogle();
      }
    });

  });

  /**
   * Toggle mobile nav dropdowns
   */
  document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
    navmenu.addEventListener('click', function(e) {
      e.preventDefault();
      this.parentNode.classList.toggle('active');
      this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
      e.stopImmediatePropagation();
    });
  });

  /**
   * Preloader
   */
  const preloader = document.querySelector('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove();
    });
  }

  /**
   * Scroll top button
   */
  let scrollTop = document.querySelector('.scroll-top');

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
  }
  scrollTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);

  /**
   * Animation on scroll function and init
   */
  function aosInit() {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }
  window.addEventListener('load', aosInit);

  /**
   * Init swiper sliders
   */
  function initSwiper() {
    document.querySelectorAll(".init-swiper").forEach(function(swiperElement) {
      let config = JSON.parse(
        swiperElement.querySelector(".swiper-config").innerHTML.trim()
      );

      if (swiperElement.classList.contains("swiper-tab")) {
        initSwiperWithCustomPagination(swiperElement, config);
      } else {
        new Swiper(swiperElement, config);
      }
    });
  }

  window.addEventListener("load", initSwiper);

  /**
   * Initiate glightbox
   */
  const glightbox = GLightbox({
    selector: '.glightbox'
  });

  /**
   * Init isotope layout and filters
   */
  document.querySelectorAll('.isotope-layout').forEach(function(isotopeItem) {
    let layout = isotopeItem.getAttribute('data-layout') ?? 'masonry';
    let filter = isotopeItem.getAttribute('data-default-filter') ?? '*';
    let sort = isotopeItem.getAttribute('data-sort') ?? 'original-order';

    let initIsotope;
    imagesLoaded(isotopeItem.querySelector('.isotope-container'), function() {
      initIsotope = new Isotope(isotopeItem.querySelector('.isotope-container'), {
        itemSelector: '.isotope-item',
        layoutMode: layout,
        filter: filter,
        sortBy: sort
      });
    });

    isotopeItem.querySelectorAll('.isotope-filters li').forEach(function(filters) {
      filters.addEventListener('click', function() {
        isotopeItem.querySelector('.isotope-filters .filter-active').classList.remove('filter-active');
        this.classList.add('filter-active');
        initIsotope.arrange({
          filter: this.getAttribute('data-filter')
        });
        if (typeof aosInit === 'function') {
          aosInit();
        }
      }, false);
    });

  });

  /**
   * Frequently Asked Questions Toggle
   */
  document.querySelectorAll('.faq-item h3, .faq-item .faq-toggle').forEach((faqItem) => {
    faqItem.addEventListener('click', () => {
      faqItem.parentNode.classList.toggle('faq-active');
    });
  });

})();

async function loadTableData() {
  const response = await fetch('table.csv'); // 修改为您的 CSV 文件路径
  const data = await response.text();
  console.log('Raw CSV Data:', data); // 输出原始 CSV 数据

  const tableBody = document.getElementById('table-body');
  const rows = data.split('\n');
  console.log('Rows:', rows); // 输出所有行数据

  rows.forEach((row, index) => {
    if (index === 0) return; // 跳过标题行

    const columns = row.split(',');
    console.log(`Row ${index} Columns:`, columns); // 输出每行的列数据

    // 创建一个新行
    const tr = document.createElement('tr');

    // Model
    const tdModel = document.createElement('td');
    tdModel.textContent = columns[0];
    tr.appendChild(tdModel);

    // Model Size
    const tdModelSize = document.createElement('td');
    tdModelSize.textContent = columns[1];
    tr.appendChild(tdModelSize);

    // Open-Weight
    const tdOpenWeight = document.createElement('td');
    const openWeightSpan = document.createElement('span');
    openWeightSpan.classList.add(
        columns[2].trim() === 'Yes' ? 'bg-green-100' : 'bg-yellow-100',
        'text-green-700',
        'font-bold',
        'py-1',
        'px-3',
        'rounded-full'
    );
    openWeightSpan.textContent = columns[2];
    tdOpenWeight.appendChild(openWeightSpan);
    tr.appendChild(tdOpenWeight);

    // Version
    const tdVersion = document.createElement('td');
    tdVersion.textContent = columns[3];
    tr.appendChild(tdVersion);

    // Creator
    const tdCreator = document.createElement('td');
    tdCreator.textContent = columns[4];
    tr.appendChild(tdCreator);

    // Source
    const tdSource = document.createElement('td');
    tdSource.textContent = columns[5];
    tr.appendChild(tdSource);

    // Link
    const tdLink = document.createElement('td');
    const link = document.createElement('a');
    link.href = columns[6];
    link.target = '_blank';
    const button = document.createElement('button');
    button.classList.add('custom-button-flat');
    const img = document.createElement('img');
    img.src = `img/${columns[4].toLowerCase()}.png`; // 假设图片名与 Creator 字段对应
    button.appendChild(img);
    link.appendChild(button);
    tdLink.appendChild(link);
    tr.appendChild(tdLink);

    // 将行添加到表体
    tableBody.appendChild(tr);
  });

  console.log('Table Data Loaded Successfully');
}

// 调用加载数据的函数
loadTableData();