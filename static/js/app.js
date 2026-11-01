/**
 * CampusDrop - Frontend Application Core
 */
const App = {
  activeRoom: window.ACTIVE_ROOM || 'public',
  files: [],
  activeCategory: 'all',
  searchQuery: '',
  networkInfo: null,
  pollTimer: null,

  init() {
    this.setupEventListeners();
    this.loadNetworkInfo();
    this.loadRooms();
    this.loadFiles();
    this.startPolling();
  },

  // Toast Notification Helper
  showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    if (type === 'error') {
      toast.style.borderColor = 'var(--accent-rose)';
      toast.style.color = '#fecdd3';
    } else if (type === 'success') {
      toast.style.borderColor = 'var(--accent-emerald)';
      toast.style.color = '#a7f3d0';
    }
    toast.textContent = message;

    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  },

  // Setup DOM Event Listeners
  setupEventListeners() {
    // Dropzone & File Input
    const dropzone = document.getElementById('dropzone');
    const fileInput = document.getElementById('fileInput');

    if (dropzone && fileInput) {
      dropzone.addEventListener('click', () => fileInput.click());

      ['dragenter', 'dragover'].forEach(eventName => {
        dropzone.addEventListener(eventName, (e) => {
          e.preventDefault();
          e.stopPropagation();
          dropzone.classList.add('dragover');
        });
      });

      ['dragleave', 'drop'].forEach(eventName => {
        dropzone.addEventListener(eventName, (e) => {
          e.preventDefault();
          e.stopPropagation();
          dropzone.classList.remove('dragover');
        });
      });

      dropzone.addEventListener('drop', (e) => {
        const dt = e.dataTransfer;
        const files = dt.files;
        if (files.length > 0) {
          this.handleFileUpload(files);
        }
      });

      fileInput.addEventListener('change', (e) => {
        if (fileInput.files.length > 0) {
          this.handleFileUpload(fileInput.files);
          fileInput.value = ''; // Reset
        }
      });
    }

    // Category Tabs
    const categoryTabs = document.getElementById('categoryTabs');
    if (categoryTabs) {
      categoryTabs.addEventListener('click', (e) => {
        const btn = e.target.closest('.tab-btn');
        if (!btn) return;
        categoryTabs.querySelectorAll('.tab-btn').forEach(t => t.classList.remove('active'));
        btn.classList.add('active');
        this.activeCategory = btn.dataset.category || 'all';
        this.renderFiles();
      });
    }

    // Search Input
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.toLowerCase().trim();
        this.renderFiles();
      });
    }

    // QR Modal Controls
    const openQrBtn = document.getElementById('openQrBtn');
    const qrModal = document.getElementById('qrModal');
    const closeQrModal = document.getElementById('closeQrModal');
    const sideQrBox = document.getElementById('sideQrBox');

    const toggleQrModal = (open) => {
      if (qrModal) {
        if (open) qrModal.classList.add('open');
        else qrModal.classList.remove('open');
      }
    };

    if (openQrBtn) openQrBtn.addEventListener('click', () => toggleQrModal(true));
    if (sideQrBox) sideQrBox.addEventListener('click', () => toggleQrModal(true));
    if (closeQrModal) closeQrModal.addEventListener('click', () => toggleQrModal(false));
    if (qrModal) {
      qrModal.addEventListener('click', (e) => {
        if (e.target === qrModal) toggleQrModal(false);
      });
    }

    // Copy URL Buttons
    const copyUrlBtn = document.getElementById('copyUrlBtn');
    const sideCopyBtn = document.getElementById('sideCopyBtn');

    const copyCurrentUrl = () => {
      const url = this.networkInfo?.current_url || window.location.href;
      navigator.clipboard.writeText(url).then(() => {
        this.showToast('Room link copied to clipboard! 📋', 'success');
      }).catch(() => {
        this.showToast('Could not copy link.', 'error');
      });
    };

    if (copyUrlBtn) copyUrlBtn.addEventListener('click', copyCurrentUrl);
    if (sideCopyBtn) sideCopyBtn.addEventListener('click', copyCurrentUrl);

    // New Room Modal Controls
    const openNewRoomBtn = document.getElementById('openNewRoomBtn');
    const addRoomQuickBtn = document.getElementById('addRoomQuickBtn');
    const roomModal = document.getElementById('roomModal');
    const closeRoomModal = document.getElementById('closeRoomModal');
    const createRoomForm = document.getElementById('createRoomForm');

    const toggleRoomModal = (open) => {
      if (roomModal) {
        if (open) roomModal.classList.add('open');
        else roomModal.classList.remove('open');
      }
    };

    if (openNewRoomBtn) openNewRoomBtn.addEventListener('click', () => toggleRoomModal(true));
    if (addRoomQuickBtn) addRoomQuickBtn.addEventListener('click', () => toggleRoomModal(true));
    if (closeRoomModal) closeRoomModal.addEventListener('click', () => toggleRoomModal(false));
    if (roomModal) {
      roomModal.addEventListener('click', (e) => {
        if (e.target === roomModal) toggleRoomModal(false);
      });
    }

    if (createRoomForm) {
      createRoomForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const code = document.getElementById('roomCodeInput').value.trim();
        const name = document.getElementById('roomNameInput').value.trim();
        const pin = document.getElementById('roomPinInput').value.trim();

        if (!code) return;

        fetch('/api/rooms/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ room_id: code, name: name, pin: pin })
        })
        .then(res => res.json())
        .then(data => {
          if (data.status === 'success') {
            toggleRoomModal(false);
            createRoomForm.reset();
            this.showToast(`Room "${data.room_id.toUpperCase()}" created! 🚀`, 'success');
            this.switchRoom(data.room_id);
          } else {
            this.showToast(data.message || 'Error creating room', 'error');
          }
        })
        .catch(err => {
          this.showToast('Network error creating room', 'error');
        });
      });
    }

    // PIN Verification Form
    const verifyPinForm = document.getElementById('verifyPinForm');
    if (verifyPinForm) {
      verifyPinForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const pin = document.getElementById('verifyPinInput').value.trim();
        if (!pin) return;

        fetch('/api/rooms/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ room_id: this.activeRoom, pin: pin })
        })
        .then(res => res.json())
        .then(data => {
          if (data.status === 'success') {
            const pinModal = document.getElementById('pinModal');
            if (pinModal) pinModal.classList.remove('open');
            document.getElementById('verifyPinInput').value = '';
            this.showToast('Room unlocked! 🔓', 'success');
            this.loadFiles();
          } else {
            this.showToast(data.message || 'Incorrect PIN', 'error');
          }
        })
        .catch(() => {
          this.showToast('Error verifying PIN', 'error');
        });
      });
    }

    // Global Key shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        toggleQrModal(false);
        toggleRoomModal(false);
      }
    });
  },

  // Load Network & QR info
  loadNetworkInfo() {
    fetch(`/api/network-info?room=${encodeURIComponent(this.activeRoom)}`)
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') {
          this.networkInfo = data;
          
          // Update URL badges
          const networkIpText = document.getElementById('networkIpText');
          if (networkIpText) {
            networkIpText.textContent = `${data.primary_ip}:${data.port}`;
          }

          const qrModalUrlText = document.getElementById('qrModalUrlText');
          if (qrModalUrlText) qrModalUrlText.textContent = data.current_url;

          const sideRoomUrl = document.getElementById('sideRoomUrl');
          if (sideRoomUrl) sideRoomUrl.textContent = data.current_url;

          // Update QR images
          const sideQrImg = document.getElementById('sideQrImg');
          const sideQrLoading = document.getElementById('sideQrLoading');
          if (sideQrImg && data.qr_data_uri) {
            sideQrImg.src = data.qr_data_uri;
            sideQrImg.style.display = 'block';
            if (sideQrLoading) sideQrLoading.style.display = 'none';
          }

          const qrCodeContainer = document.getElementById('qrCodeContainer');
          if (qrCodeContainer && data.qr_data_uri) {
            qrCodeContainer.innerHTML = `<img src="${data.qr_data_uri}" alt="CampusDrop Room QR" style="width: 220px; height: 220px;">`;
          }

          // Update Stats
          if (data.stats) {
            const statFileCount = document.getElementById('statFileCount');
            const statStorageSize = document.getElementById('statStorageSize');
            if (statFileCount) statFileCount.textContent = data.stats.total_files;
            if (statStorageSize) statStorageSize.textContent = data.stats.total_size_formatted;
          }
        }
      })
      .catch(err => console.error('Error loading network info:', err));
  },

  // Load Room List
  loadRooms() {
    fetch('/api/rooms')
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') {
          this.renderRoomList(data.rooms);
        }
      })
      .catch(err => console.error('Error loading rooms:', err));
  },

  // Render Rooms in Sidebar
  renderRoomList(rooms) {
    const container = document.getElementById('roomListContainer');
    if (!container) return;

    container.innerHTML = '';

    Object.entries(rooms).forEach(([roomId, rdata]) => {
      const item = document.createElement('div');
      item.className = `room-item ${roomId === this.activeRoom ? 'active' : ''}`;
      
      const lockIcon = rdata.has_pin 
        ? `<svg width="12" height="12" style="color: var(--accent-amber); margin-left: 4px;"><use href="#icon-lock"/></svg>` 
        : '';

      item.innerHTML = `
        <div class="room-item-info">
          <div class="room-item-name">
            ${rdata.name} ${lockIcon}
          </div>
          <div class="room-item-desc">${roomId.toUpperCase()}</div>
        </div>
      `;

      item.addEventListener('click', () => {
        this.switchRoom(roomId);
      });

      container.appendChild(item);
    });

    // Update active room card title
    const activeInfo = rooms[this.activeRoom];
    const activeRoomTitle = document.getElementById('activeRoomTitle');
    const activeRoomDesc = document.getElementById('activeRoomDesc');
    const roomSecurityBadge = document.getElementById('roomSecurityBadge');

    if (activeInfo) {
      if (activeRoomTitle) activeRoomTitle.textContent = activeInfo.name;
      if (activeRoomDesc) activeRoomDesc.textContent = activeInfo.description || `Sharing room ${this.activeRoom.toUpperCase()}`;
      if (roomSecurityBadge) {
        if (activeInfo.has_pin) {
          roomSecurityBadge.textContent = '🔒 PIN PROTECTED';
          roomSecurityBadge.style.color = 'var(--accent-amber)';
          roomSecurityBadge.style.background = 'rgba(245, 158, 11, 0.15)';
        } else {
          roomSecurityBadge.textContent = 'PUBLIC';
          roomSecurityBadge.style.color = 'var(--accent-cyan)';
          roomSecurityBadge.style.background = 'rgba(56, 189, 248, 0.15)';
        }
      }
    }
  },

  // Switch Room
  switchRoom(roomId) {
    if (this.activeRoom === roomId) return;
    this.activeRoom = roomId;
    window.history.pushState({}, '', `/room/${roomId}`);
    this.loadNetworkInfo();
    this.loadRooms();
    this.loadFiles();
  },

  // Load Files in current room
  loadFiles() {
    fetch(`/api/files?room=${encodeURIComponent(this.activeRoom)}`)
      .then(res => res.json())
      .then(data => {
        if (data.status === 'locked') {
          const pinModal = document.getElementById('pinModal');
          if (pinModal) pinModal.classList.add('open');
          this.files = [];
          this.renderFiles();
          return;
        }

        if (data.status === 'success') {
          this.files = data.files || [];
          this.renderFiles();
        }
      })
      .catch(err => console.error('Error loading files:', err));
  },

  // Render Files with Filtering and Search
  renderFiles() {
    const container = document.getElementById('fileListContainer');
    if (!container) return;

    // Filter by Category
    let filtered = this.files;
    if (this.activeCategory !== 'all') {
      filtered = filtered.filter(f => f.category === this.activeCategory);
    }

    // Filter by Search Query
    if (this.searchQuery) {
      filtered = filtered.filter(f => 
        f.original_name.toLowerCase().includes(this.searchQuery) ||
        f.category.toLowerCase().includes(this.searchQuery)
      );
    }

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <svg class="empty-icon"><use href="#icon-cloud-upload"/></svg>
          <h3>${this.files.length === 0 ? 'No files in this room yet' : 'No matching files found'}</h3>
          <p style="font-size: 0.85rem; margin-top: 0.35rem;">
            ${this.files.length === 0 ? 'Drag and drop files above to share!' : 'Try a different filter or search term.'}
          </p>
        </div>
      `;
      return;
    }

    container.innerHTML = '';

    filtered.forEach(file => {
      const item = document.createElement('div');
      item.className = 'file-item';

      let iconId = '#icon-doc';
      if (file.category === 'video') iconId = '#icon-video';
      else if (file.category === 'audio') iconId = '#icon-audio';
      else if (file.category === 'image') iconId = '#icon-image';
      else if (file.category === 'archive') iconId = '#icon-archive';
      else if (file.category === 'code') iconId = '#icon-code';

      // Format date
      const uploadDate = new Date(file.uploaded_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      item.innerHTML = `
        <div class="file-left">
          <div class="file-icon-box cat-${file.category}">
            <svg width="22" height="22"><use href="${iconId}"/></svg>
          </div>
          <div class="file-details">
            <div class="file-name" title="${file.original_name}">${file.original_name}</div>
            <div class="file-meta">
              <span>${file.size_formatted}</span>
              <span>•</span>
              <span>${uploadDate}</span>
              <span>•</span>
              <span>${file.downloads || 0} downloads</span>
            </div>
          </div>
        </div>
        <div class="file-actions">
          <button class="btn btn-secondary btn-icon" title="Preview / Stream" data-action="preview">
            <svg width="16" height="16"><use href="#icon-eye"/></svg>
          </button>
          <a class="btn btn-secondary btn-icon" href="/download/${file.id}" download title="Download">
            <svg width="16" height="16"><use href="#icon-download"/></svg>
          </a>
          <button class="btn btn-secondary btn-icon" title="Copy Direct Download Link" data-action="copy-link">
            <svg width="16" height="16"><use href="#icon-copy"/></svg>
          </button>
          <button class="btn btn-danger btn-icon" title="Delete File" data-action="delete">
            <svg width="16" height="16"><use href="#icon-trash"/></svg>
          </button>
        </div>
      `;

      // Event handlers for actions
      const previewBtn = item.querySelector('[data-action="preview"]');
      if (previewBtn) {
        previewBtn.addEventListener('click', () => {
          if (window.PreviewManager) {
            window.PreviewManager.open(file);
          }
        });
      }

      const copyLinkBtn = item.querySelector('[data-action="copy-link"]');
      if (copyLinkBtn) {
        copyLinkBtn.addEventListener('click', () => {
          const directUrl = `${window.location.origin}/download/${file.id}`;
          navigator.clipboard.writeText(directUrl).then(() => {
            this.showToast('Direct download link copied! 📋', 'success');
          });
        });
      }

      const deleteBtn = item.querySelector('[data-action="delete"]');
      if (deleteBtn) {
        deleteBtn.addEventListener('click', () => {
          if (confirm(`Delete "${file.original_name}"?`)) {
            this.deleteFile(file.id);
          }
        });
      }

      container.appendChild(item);
    });
  },

  // Handle Multi-File Upload with Live Progress & Speed Tracking
  handleFileUpload(fileList) {
    if (!fileList || fileList.length === 0) return;

    const formData = new FormData();
    formData.append('room', this.activeRoom);

    let totalBytes = 0;
    for (let i = 0; i < fileList.length; i++) {
      formData.append('file', fileList[i]);
      totalBytes += fileList[i].size;
    }

    const queueBox = document.getElementById('uploadQueueBox');
    const progressBarFill = document.getElementById('progressBarFill');
    const speedMeter = document.getElementById('speedMeter');
    const uploadTransferredBytes = document.getElementById('uploadTransferredBytes');
    const uploadEta = document.getElementById('uploadEta');
    const uploadStatusText = document.getElementById('uploadStatusText');

    if (queueBox) queueBox.style.display = 'flex';
    if (uploadStatusText) {
      uploadStatusText.textContent = `Uploading ${fileList.length} file(s)...`;
    }

    let startTime = Date.now();
    let lastLoaded = 0;
    let lastTime = Date.now();

    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/upload', true);

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        const percent = Math.round((e.loaded / e.total) * 100);
        if (progressBarFill) progressBarFill.style.width = `${percent}%`;

        // Calculate Transfer Speed & ETA
        const now = Date.now();
        const timeDiff = (now - lastTime) / 1000;

        if (timeDiff >= 0.3 || e.loaded === e.total) {
          const bytesDiff = e.loaded - lastLoaded;
          const speedBps = timeDiff > 0 ? (bytesDiff / timeDiff) : 0;
          const speedMBps = (speedBps / (1024 * 1024)).toFixed(1);

          if (speedMeter) {
            speedMeter.textContent = `⚡ ${speedMBps} MB/s`;
          }

          const remainingBytes = e.total - e.loaded;
          const etaSec = speedBps > 0 ? Math.round(remainingBytes / speedBps) : 0;
          
          if (uploadEta) {
            uploadEta.textContent = etaSec > 0 ? `ETA: ~${etaSec}s` : 'Finishing...';
          }

          lastLoaded = e.loaded;
          lastTime = now;
        }

        const loadedMB = (e.loaded / (1024 * 1024)).toFixed(1);
        const totalMB = (e.total / (1024 * 1024)).toFixed(1);
        if (uploadTransferredBytes) {
          uploadTransferredBytes.textContent = `${loadedMB} MB / ${totalMB} MB (${percent}%)`;
        }
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        const res = JSON.parse(xhr.responseText);
        if (res.status === 'success') {
          this.showToast(`Transferred ${fileList.length} file(s) successfully! 🚀`, 'success');
          this.loadFiles();
          this.loadNetworkInfo();
        } else {
          this.showToast(res.message || 'Upload error', 'error');
        }
      } else {
        this.showToast('Upload failed. Please check room PIN or network.', 'error');
      }

      setTimeout(() => {
        if (queueBox) queueBox.style.display = 'none';
        if (progressBarFill) progressBarFill.style.width = '0%';
      }, 1200);
    };

    xhr.onerror = () => {
      this.showToast('Upload connection error occurred.', 'error');
      if (queueBox) queueBox.style.display = 'none';
    };

    xhr.send(formData);
  },

  // Delete File
  deleteFile(fileId) {
    fetch(`/api/files/${fileId}`, { method: 'DELETE' })
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') {
          this.showToast('File deleted', 'success');
          this.loadFiles();
          this.loadNetworkInfo();
        } else {
          this.showToast(data.message || 'Could not delete file', 'error');
        }
      })
      .catch(() => {
        this.showToast('Error deleting file', 'error');
      });
  },

  // Background Periodic Polling (Sync with other peer uploads)
  startPolling() {
    this.pollTimer = setInterval(() => {
      fetch(`/api/files?room=${encodeURIComponent(this.activeRoom)}`)
        .then(res => res.json())
        .then(data => {
          if (data.status === 'success') {
            const currentCount = this.files.length;
            const newCount = (data.files || []).length;
            if (newCount !== currentCount || JSON.stringify(data.files) !== JSON.stringify(this.files)) {
              this.files = data.files || [];
              this.renderFiles();
            }
          }
        })
        .catch(() => {});
    }, 4000);
  }
};

// Initialize Application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
