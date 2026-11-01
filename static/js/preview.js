/**
 * CampusDrop - In-Browser Media Preview Manager
 */
const PreviewManager = {
  modal: null,
  container: null,
  title: null,
  downloadBtn: null,

  init() {
    this.modal = document.getElementById('previewModal');
    this.container = document.getElementById('previewContent');
    this.title = document.getElementById('previewFileName');
    this.downloadBtn = document.getElementById('previewDownloadBtn');

    const closeBtn = document.getElementById('closePreviewModal');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.close());
    }

    if (this.modal) {
      this.modal.addEventListener('click', (e) => {
        if (e.target === this.modal) this.close();
      });
    }

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modal && this.modal.classList.contains('open')) {
        this.close();
      }
    });
  },

  open(file) {
    if (!this.modal || !this.container) return;

    this.title.textContent = file.original_name;
    this.downloadBtn.href = `/download/${file.id}`;
    this.container.innerHTML = '';

    const streamUrl = `/stream/${file.id}`;
    const category = file.category;

    if (category === 'image') {
      const img = document.createElement('img');
      img.src = streamUrl;
      img.alt = file.original_name;
      this.container.appendChild(img);
    } else if (category === 'video') {
      const video = document.createElement('video');
      video.src = streamUrl;
      video.controls = true;
      video.autoplay = true;
      video.style.width = '100%';
      this.container.appendChild(video);
    } else if (category === 'audio') {
      const audio = document.createElement('audio');
      audio.src = streamUrl;
      audio.controls = true;
      audio.autoplay = true;
      audio.style.width = '100%';
      this.container.appendChild(audio);
    } else if (category === 'code' || file.mime_type?.includes('text') || file.original_name.endsWith('.txt') || file.original_name.endsWith('.md')) {
      const pre = document.createElement('pre');
      pre.className = 'preview-text-box';
      pre.textContent = 'Loading text preview...';
      this.container.appendChild(pre);

      fetch(streamUrl)
        .then(res => res.text())
        .then(text => {
          pre.textContent = text.slice(0, 100000); // Display up to 100KB preview
        })
        .catch(() => {
          pre.textContent = 'Could not load text preview.';
        });
    } else if (category === 'document' && file.mime_type === 'application/pdf') {
      const iframe = document.createElement('iframe');
      iframe.src = streamUrl;
      iframe.style.width = '100%';
      iframe.style.height = '60vh';
      iframe.style.border = 'none';
      iframe.style.borderRadius = '8px';
      this.container.appendChild(iframe);
    } else {
      const fallback = document.createElement('div');
      fallback.style.padding = '2rem';
      fallback.style.textAlign = 'center';
      fallback.innerHTML = `
        <p style="color: var(--text-muted); margin-bottom: 1rem;">Direct preview not available for this file type.</p>
        <a href="/download/${file.id}" class="btn btn-primary" download>Download ${file.original_name}</a>
      `;
      this.container.appendChild(fallback);
    }

    this.modal.classList.add('open');
  },

  close() {
    if (!this.modal) return;
    this.modal.classList.remove('open');
    // Pause any playing media
    const video = this.container.querySelector('video');
    if (video) video.pause();
    const audio = this.container.querySelector('audio');
    if (audio) audio.pause();
    this.container.innerHTML = '';
  }
};

document.addEventListener('DOMContentLoaded', () => {
  PreviewManager.init();
});
