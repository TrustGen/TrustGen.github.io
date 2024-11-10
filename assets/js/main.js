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
  mobileNavToggleBtn?.addEventListener('click', mobileNavToogle);

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
  scrollTop?.addEventListener('click', (e) => {
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
  try {
    // 加载所有三个CSV文件
    const [llmResponse, lvmResponse, t2iResponse] = await Promise.all([
      fetch('llm.csv'),
      fetch('lvm.csv'),
      fetch('t2i.csv')
    ]);

    if (!llmResponse.ok || !lvmResponse.ok || !t2iResponse.ok) 
      throw new Error('Failed to fetch CSV files');

    const [llmData, lvmData, t2iData] = await Promise.all([
      llmResponse.text(),
      lvmResponse.text(),
      t2iResponse.text()
    ]);

    // 处理表格的函数
    const processTable = (data, tableId) => {
      const tableBody = document.querySelector(`#${tableId} tbody`);
      if (!tableBody) throw new Error(`Table body not found for ${tableId}`);

      // 清空现有内容
      tableBody.innerHTML = '';

      // 解析CSV数据
      const rows = data.trim().split('\n');
      const headers = rows[0].split(',').map(h => h.trim());

      // 处理每一行
      rows.slice(1).forEach(row => {
        const columns = row.split(',').map(col => col.trim());
        const tr = document.createElement('tr');

        columns.forEach((col, index) => {
          const td = document.createElement('td');
          
          if (headers[index] === 'Open-Weight') {
            const badge = document.createElement('span');
            badge.className = col === "Yes" ? 'badge bg-success' : 'badge bg-warning text-dark';
            badge.textContent = col || 'No';
            td.appendChild(badge);
          } else if (headers[index] === 'Link') {
            if (col) {
              const link = document.createElement('a');
              link.href = col;
              link.target = '_blank';
              link.className = 'btn btn-link';
              link.textContent = 'Visit';
              td.appendChild(link);
            } else {
              td.textContent = 'N/A';
            }
          } else {
            td.textContent = col || 'N/A';
          }
          tr.appendChild(td);
        });

        tableBody.appendChild(tr);
      });
    };

    // 处理所有三个表格
    processTable(llmData, 'llm-table');
    processTable(lvmData, 'lvm-table');
    processTable(t2iData, 't2i-table');

  } catch (error) {
    console.error('Error loading table data:', error);
  }
}

// 当DOM加载完成时调用函数
document.addEventListener('DOMContentLoaded', loadTableData);

// script.js
const images = [
  'assets/img/background/background_1.jpg',
  'assets/img/background/18.jpg',
  'assets/img/background/30.jpg',
  'assets/img/background/37.jpg'
];
let currentIndex = 0;
const changeInterval = 10000; // 切换间隔，毫秒

function changeBackground() {
  const background = document.getElementById('background');
  currentIndex = (currentIndex + 1) % images.length;
  background.style.backgroundImage = `url('${images[currentIndex]}')`;
}

// 初始化时设置初始背景图片
document.addEventListener("DOMContentLoaded", () => {
  const background = document.getElementById('background');
  background.style.backgroundImage = `url('${images[currentIndex]}')`;
});

setInterval(changeBackground, changeInterval); // 每隔几秒切换背景
