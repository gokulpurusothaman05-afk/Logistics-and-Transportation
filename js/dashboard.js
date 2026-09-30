/**
 * STACKLY LOGISTICS - DASHBOARD CONTROLLER
 * Powering both Admin & Client portals with dynamic Gmail user greeting,
 * sidebar section tabs, live data tables, charts, and shipment booking
 */

document.addEventListener('DOMContentLoaded', () => {
  initDashboardUser();
  initSidebarNavigation();
  initShipmentFilters();
  initBookingForm();
  initStatusChanger();
  initLogout();
  renderDashboardCharts();
});

/* 1. Initialize User from Gmail / Session */
function initDashboardUser() {
  let user = JSON.parse(localStorage.getItem('stackly_user'));
  
  // If no user has logged in, redirect to login page
  if (!user || !user.email) {
    window.location.href = 'login.html';
    return;
  }

  // Populate user name and email across all dashboard placeholders
  const nameDisplays = document.querySelectorAll('.dynamic-user-name');
  nameDisplays.forEach(el => {
    if (el.tagName === 'INPUT') {
      el.value = user.username;
    } else {
      el.textContent = user.username;
    }
  });

  const emailDisplays = document.querySelectorAll('.dynamic-user-email');
  emailDisplays.forEach(el => {
    if (el.tagName === 'INPUT') {
      el.value = user.email;
    } else {
      el.textContent = user.email;
    }
  });

  const avatarCircles = document.querySelectorAll('.dynamic-user-avatar');
  avatarCircles.forEach(el => {
    el.textContent = (user.username.charAt(0) || 'U').toUpperCase();
  });
}

/* 2. Sidebar Navigation & Section Switcher */
function initSidebarNavigation() {
  const navBtns = document.querySelectorAll('.dashboard-sidebar .nav-item-btn[data-target]');
  const sections = document.querySelectorAll('.dashboard-section');
  const pageTitle = document.querySelector('.topbar-page-title');
  const sidebarToggle = document.querySelector('.btn-sidebar-toggle');
  const sidebarClose = document.querySelector('.btn-sidebar-close');
  const sidebar = document.querySelector('.dashboard-sidebar');
  
  // Ensure backdrop element exists
  let backdrop = document.querySelector('.sidebar-backdrop');
  if (!backdrop) {
    backdrop = document.createElement('div');
    backdrop.className = 'sidebar-backdrop';
    document.body.appendChild(backdrop);
  }

  function openSidebar() {
    if (sidebar) sidebar.classList.add('open');
    if (backdrop) backdrop.classList.add('active');
  }

  function closeSidebar() {
    if (sidebar) sidebar.classList.remove('open');
    if (backdrop) backdrop.classList.remove('active');
  }

  if (sidebarToggle) {
    sidebarToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      if (sidebar && sidebar.classList.contains('open')) {
        closeSidebar();
      } else {
        openSidebar();
      }
    });
  }

  if (sidebarClose) {
    sidebarClose.addEventListener('click', (e) => {
      e.stopPropagation();
      closeSidebar();
    });
  }

  if (backdrop) {
    backdrop.addEventListener('click', () => {
      closeSidebar();
    });
  }

  // Close sidebar on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeSidebar();
    }
  });

  navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.dataset.target;
      const targetSection = document.getElementById(targetId);

      if (!targetSection) return;

      // Update active nav button
      navBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Update visible section
      sections.forEach(sec => sec.classList.remove('active'));
      targetSection.classList.add('active');

      // Update title
      if (pageTitle) {
        const titleText = btn.querySelector('span') ? btn.querySelector('span').textContent : 'Dashboard';
        pageTitle.textContent = titleText;
      }

      // Close mobile drawer
      if (window.innerWidth <= 960) {
        closeSidebar();
      }
    });
  });
}

/* 3. Shipment Table Search & Filters */
function initShipmentFilters() {
  const searchInput = document.getElementById('shipmentSearchInput');
  const statusFilter = document.getElementById('shipmentStatusFilter');
  const rows = document.querySelectorAll('.shipment-row');

  function filterRows() {
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
    const selectedStatus = statusFilter ? statusFilter.value.toLowerCase() : 'all';

    rows.forEach(row => {
      const text = row.textContent.toLowerCase();
      const status = row.dataset.status ? row.dataset.status.toLowerCase() : '';

      const matchesSearch = !query || text.includes(query);
      const matchesStatus = selectedStatus === 'all' || status === selectedStatus;

      if (matchesSearch && matchesStatus) {
        row.style.display = '';
      } else {
        row.style.display = 'none';
      }
    });
  }

  if (searchInput) searchInput.addEventListener('input', filterRows);
  if (statusFilter) statusFilter.addEventListener('change', filterRows);
}

/* 4. Client Book New Shipment Form */
function initBookingForm() {
  const bookingForm = document.getElementById('clientBookingForm');
  if (!bookingForm) return;

  bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const origin = document.getElementById('bookOrigin') ? document.getElementById('bookOrigin').value.trim() : '';
    const dest = document.getElementById('bookDestination') ? document.getElementById('bookDestination').value.trim() : '';
    const type = document.getElementById('bookCargoType') ? document.getElementById('bookCargoType').value : '';
    const weight = document.getElementById('bookWeight') ? document.getElementById('bookWeight').value : '';

    if (!origin || !dest || !type || !weight) {
      if (typeof showToast === 'function') {
        showToast('Please fill all required consignment fields.', 'error');
      }
      return;
    }

    // Redirect to 404 page per project specification for completed submissions
    window.location.href = '404.html';
  });
}

/* 5. Status Updater & Interactive Row Actions */
function initStatusChanger() {
  window.updateShipmentStatus = function(btn, trackingId) {
    const row = btn.closest('tr');
    if (!row) return;

    const currentStatus = row.dataset.status;
    let nextStatus = 'delivered';
    let nextPill = '<span class="status-pill delivered"><span class="dot"></span> Delivered</span>';

    if (currentStatus === 'in-transit') {
      nextStatus = 'delivered';
      nextPill = '<span class="status-pill delivered"><span class="dot"></span> Delivered</span>';
    } else if (currentStatus === 'delivered') {
      nextStatus = 'delayed';
      nextPill = '<span class="status-pill delayed"><span class="dot"></span> Delayed</span>';
    } else {
      nextStatus = 'in-transit';
      nextPill = '<span class="status-pill in-transit"><span class="dot"></span> In Transit</span>';
    }

    row.dataset.status = nextStatus;
    const statusCell = row.querySelector('td:nth-child(5)') || row.querySelector('.status-pill').parentElement;
    if (statusCell) statusCell.innerHTML = nextPill;

    showToast(`Updated shipment #${trackingId} status to ${nextStatus.toUpperCase()}`, 'info');
  };

  window.showTrackDetails = function(trackingId) {
    showToast(`Loading real-time GPS telemetry for #${trackingId}...`, 'info');
    const trackTab = document.querySelector('.nav-item-btn[data-target="section-tracking"]');
    if (trackTab) trackTab.click();
  };
}

/* 6. Logout Handler */
function initLogout() {
  const logoutBtns = document.querySelectorAll('.btn-logout, #btnLogout');
  logoutBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      localStorage.removeItem('stackly_user');
      showToast('Logged out successfully', 'info');
      setTimeout(() => {
        window.location.href = 'login.html';
      }, 500);
    });
  });
}

/* 7. Lightweight Responsive Charts (Canvas) */
function renderDashboardCharts() {
  const revenueCanvas = document.getElementById('revenueChart');
  if (revenueCanvas && revenueCanvas.getContext) {
    const ctx = revenueCanvas.getContext('2d');
    const width = revenueCanvas.width = revenueCanvas.parentElement.clientWidth || 500;
    const height = revenueCanvas.height = 200;

    ctx.clearRect(0, 0, width, height);

    // Draw grid lines
    ctx.strokeStyle = '#eae6dc';
    ctx.lineWidth = 1;
    for (let y = 30; y < height; y += 40) {
      ctx.beginPath();
      ctx.moveTo(40, y);
      ctx.lineTo(width - 20, y);
      ctx.stroke();
    }

    // Data points (Monthly Freight Volume)
    const points = [
      { m: 'Jan', v: 45 },
      { m: 'Feb', v: 62 },
      { m: 'Mar', v: 58 },
      { m: 'Apr', v: 75 },
      { m: 'May', v: 92 },
      { m: 'Jun', v: 88 },
      { m: 'Jul', v: 110 }
    ];

    const stepX = (width - 80) / (points.length - 1);

    // Fill gradient area
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, 'rgba(255, 94, 20, 0.35)');
    gradient.addColorStop(1, 'rgba(255, 94, 20, 0.0)');

    ctx.beginPath();
    points.forEach((pt, i) => {
      const x = 50 + i * stepX;
      const y = height - 40 - (pt.v / 120) * (height - 70);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.lineTo(50 + (points.length - 1) * stepX, height - 30);
    ctx.lineTo(50, height - 30);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    // Draw main stroke line
    ctx.beginPath();
    ctx.strokeStyle = '#ff5e14';
    ctx.lineWidth = 3;
    points.forEach((pt, i) => {
      const x = 50 + i * stepX;
      const y = height - 40 - (pt.v / 120) * (height - 70);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Draw point nodes & labels
    points.forEach((pt, i) => {
      const x = 50 + i * stepX;
      const y = height - 40 - (pt.v / 120) * (height - 70);

      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fillStyle = '#0e0f18';
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Month text
      ctx.fillStyle = '#7a7d8d';
      ctx.font = '11px Outfit, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(pt.m, x, height - 12);
    });
  }
}
