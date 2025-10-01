// Script para abrir/fechar o menu lateral

document.addEventListener('DOMContentLoaded', function() {
  const menuToggle = document.querySelector('.menu-toggle');
  const body = document.body;
  const novoMenu = document.getElementById('novo-menu');
  let overlay = document.querySelector('.menu-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'menu-overlay';
    document.body.appendChild(overlay);
  }

  function openMenu() {
    body.classList.add('menu-open');
    menuToggle.setAttribute('aria-expanded', 'true');
    animateHamburger(true);
    novoMenu.style.display = 'flex';
  }

  function closeMenu() {
    body.classList.remove('menu-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    animateHamburger(false);
    novoMenu.style.display = 'none';
  }

  menuToggle.addEventListener('click', function(e) {
    e.stopPropagation();
    if (body.classList.contains('menu-open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  overlay.addEventListener('click', function() {
    closeMenu();
  });

  // Fecha menu ao clicar em qualquer lugar fora do menu
  document.addEventListener('click', function(e) {
    if (body.classList.contains('menu-open')) {
      const isMenu = e.target.closest('#novo-menu');
      const isToggle = e.target.closest('.menu-toggle');
      if (!isMenu && !isToggle) {
        closeMenu();
      }
    }
  });

  // Fecha menu ao pressionar ESC
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      closeMenu();
    }
  });

  // Animação das listras do hambúrguer
  function animateHamburger(open) {
    const bars = menuToggle.querySelectorAll('.hamburger-bar');
    if (open) {
      bars[0].style.transform = 'translateY(7px) rotate(45deg)';
      bars[1].style.opacity = '0';
      bars[2].style.transform = 'translateY(-7px) rotate(-45deg)';
    } else {
      bars[0].style.transform = '';
      bars[1].style.opacity = '1';
      bars[2].style.transform = '';
    }
  }
});
// (Removido bloco duplicado e fechamento extra)
