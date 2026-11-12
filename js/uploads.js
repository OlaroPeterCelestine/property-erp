(function () {
  const IMAGE_ACCEPT = 'image/jpeg,image/png,image/webp,image/gif';
  const DOC_ACCEPT = 'image/jpeg,image/png,image/webp,application/pdf,.pdf,.doc,.docx,.xls,.xlsx,.csv';
  const STORE_KEY = 'property-erp-uploads';
  const MAX_IMAGE_MB = 8;
  const MAX_DOC_MB = 12;

  function loadStore() {
    try {
      return JSON.parse(localStorage.getItem(STORE_KEY) || '{}') || {};
    } catch {
      return {};
    }
  }

  function saveStore(store) {
    localStorage.setItem(STORE_KEY, JSON.stringify(store));
  }

  function getPropertyImage(propertyId) {
    const store = loadStore();
    return store.propertyImages?.[propertyId] || null;
  }

  function setPropertyImage(propertyId, dataUrl) {
    const store = loadStore();
    store.propertyImages = store.propertyImages || {};
    if (dataUrl) store.propertyImages[propertyId] = dataUrl;
    else delete store.propertyImages[propertyId];
    saveStore(store);
  }

  function getDocuments() {
    return loadStore().documents || [];
  }

  function addDocument(doc) {
    const store = loadStore();
    store.documents = store.documents || [];
    store.documents.unshift(doc);
    saveStore(store);
    return store.documents;
  }

  function formatBytes(bytes) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  function isImageFile(file) {
    return file && /^image\/(jpeg|png|webp|gif)$/i.test(file.type);
  }

  function validateFile(file, { acceptImagesOnly = false, maxMb = MAX_IMAGE_MB } = {}) {
    if (!file) return 'Choose a file to upload.';
    if (acceptImagesOnly && !isImageFile(file)) {
      return 'Please upload a JPG, PNG, WEBP or GIF image.';
    }
    if (!acceptImagesOnly) {
      const ok =
        isImageFile(file) ||
        file.type === 'application/pdf' ||
        /\.(pdf|doc|docx|xls|xlsx|csv)$/i.test(file.name);
      if (!ok) return 'Unsupported file type. Use images, PDF, Word, Excel or CSV.';
    }
    if (file.size > maxMb * 1024 * 1024) {
      return `File is too large. Max ${maxMb} MB.`;
    }
    return null;
  }

  function readAsDataUrl(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(new Error('Could not read file.'));
      reader.readAsDataURL(file);
    });
  }

  function resizeImage(file, { maxWidth = 1600, quality = 0.82 } = {}) {
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, maxWidth / img.width);
        const width = Math.round(img.width * scale);
        const height = Math.round(img.height * scale);
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        URL.revokeObjectURL(url);
        const mime = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
        resolve(canvas.toDataURL(mime, quality));
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('Could not process image.'));
      };
      img.src = url;
    });
  }

  async function prepareFile(file, { imagesOnly = false } = {}) {
    const maxMb = imagesOnly || isImageFile(file) ? MAX_IMAGE_MB : MAX_DOC_MB;
    const error = validateFile(file, { acceptImagesOnly: imagesOnly, maxMb });
    if (error) throw new Error(error);

    if (isImageFile(file)) {
      const dataUrl = await resizeImage(file);
      return {
        name: file.name,
        type: file.type,
        size: file.size,
        kind: 'image',
        previewUrl: dataUrl,
        dataUrl,
      };
    }

    const dataUrl = await readAsDataUrl(file);
    return {
      name: file.name,
      type: file.type || 'application/octet-stream',
      size: file.size,
      kind: 'file',
      previewUrl: null,
      dataUrl,
    };
  }

  function dropzoneHtml({
    name = 'file',
    label = 'Upload file',
    hint = 'PNG, JPG, WEBP up to 8 MB',
    accept = IMAGE_ACCEPT,
    imagesOnly = false,
    multiple = false,
  } = {}) {
    return `
      <div class="upload-field" data-upload-zone data-images-only="${imagesOnly ? '1' : '0'}" data-name="${name}">
        <span class="mb-1 block text-sm font-medium text-slate-700">${label}</span>
        <label class="upload-dropzone group">
          <input type="file" name="${name}" class="sr-only" accept="${accept}" ${multiple ? 'multiple' : ''} data-upload-input />
          <div class="upload-empty flex flex-col items-center justify-center gap-2 px-4 py-6 text-center" data-upload-empty>
            <span class="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
              <i class="hgi-stroke hgi-image-upload-01 text-[22px]" aria-hidden="true"></i>
            </span>
            <p class="text-sm font-medium text-slate-700"><span class="text-brand-600">Click to upload</span> or drag and drop</p>
            <p class="text-xs text-slate-400">${hint}</p>
          </div>
          <div class="upload-preview hidden" data-upload-preview>
            <img alt="" class="upload-preview-img" data-upload-thumb />
            <div class="min-w-0 flex-1">
              <p class="truncate text-sm font-semibold text-slate-800" data-upload-name></p>
              <p class="text-xs text-slate-400" data-upload-meta></p>
              <p class="mt-1 hidden text-xs text-brand-600" data-upload-ready>Ready to save</p>
            </div>
            <button type="button" class="rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50" data-upload-clear>Remove</button>
          </div>
        </label>
        <p class="mt-1.5 hidden text-xs text-rose-600" data-upload-error></p>
      </div>`;
  }

  function setError(zone, message) {
    const err = zone.querySelector('[data-upload-error]');
    if (!err) return;
    if (!message) {
      err.classList.add('hidden');
      err.textContent = '';
      return;
    }
    err.textContent = message;
    err.classList.remove('hidden');
  }

  function showPreview(zone, prepared) {
    const empty = zone.querySelector('[data-upload-empty]');
    const preview = zone.querySelector('[data-upload-preview]');
    const thumb = zone.querySelector('[data-upload-thumb]');
    const nameEl = zone.querySelector('[data-upload-name]');
    const meta = zone.querySelector('[data-upload-meta]');
    const ready = zone.querySelector('[data-upload-ready]');

    empty?.classList.add('hidden');
    preview?.classList.remove('hidden');
    preview?.classList.add('flex');

    if (prepared.kind === 'image' && prepared.previewUrl) {
      thumb.src = prepared.previewUrl;
      thumb.classList.remove('hidden');
    } else {
      thumb.removeAttribute('src');
      thumb.classList.add('hidden');
    }

    nameEl.textContent = prepared.name;
    meta.textContent = `${prepared.kind === 'image' ? 'Image' : 'Document'} · ${formatBytes(prepared.size)}`;
    ready?.classList.remove('hidden');
    zone._prepared = prepared;
    setError(zone, null);

    const form = zone.closest('form');
    const nameInput = form?.querySelector('input[name="name"]');
    if (nameInput && !nameInput.value.trim()) {
      nameInput.value = prepared.name.replace(/\.[^.]+$/, '') || prepared.name;
    }

    zone.dispatchEvent(new CustomEvent('property-erp:file-prepared', {
      bubbles: true,
      detail: { prepared, zone },
    }));
  }

  function clearZone(zone) {
    const input = zone.querySelector('[data-upload-input]');
    const empty = zone.querySelector('[data-upload-empty]');
    const preview = zone.querySelector('[data-upload-preview]');
    const thumb = zone.querySelector('[data-upload-thumb]');
    if (input) input.value = '';
    empty?.classList.remove('hidden');
    preview?.classList.add('hidden');
    preview?.classList.remove('flex');
    if (thumb) {
      thumb.removeAttribute('src');
      thumb.classList.add('hidden');
    }
    zone._prepared = null;
    setError(zone, null);
  }

  async function handleFiles(zone, fileList) {
    const file = fileList?.[0];
    if (!file) return;
    const imagesOnly = zone.dataset.imagesOnly === '1';
    try {
      const prepared = await prepareFile(file, { imagesOnly });
      showPreview(zone, prepared);
    } catch (err) {
      clearZone(zone);
      setError(zone, err.message || 'Upload failed.');
    }
  }

  function bindZone(zone) {
    if (!zone || zone.dataset.bound === '1') return;
    zone.dataset.bound = '1';
    const input = zone.querySelector('[data-upload-input]');
    const drop = zone.querySelector('.upload-dropzone');

    input?.addEventListener('change', () => handleFiles(zone, input.files));

    zone.querySelector('[data-upload-clear]')?.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      clearZone(zone);
    });

    ['dragenter', 'dragover'].forEach((evt) => {
      drop?.addEventListener(evt, (e) => {
        e.preventDefault();
        e.stopPropagation();
        drop.classList.add('is-dragging');
      });
    });

    ['dragleave', 'drop'].forEach((evt) => {
      drop?.addEventListener(evt, (e) => {
        e.preventDefault();
        e.stopPropagation();
        drop.classList.remove('is-dragging');
      });
    });

    drop?.addEventListener('drop', (e) => {
      const files = e.dataTransfer?.files;
      if (files?.length) handleFiles(zone, files);
    });
  }

  function bindAll(root = document) {
    root.querySelectorAll('[data-upload-zone]').forEach(bindZone);
  }

  function getPrepared(root = document) {
    const zone = root.querySelector('[data-upload-zone]');
    return zone?._prepared || null;
  }

  function requirePrepared(root = document, message = 'Please upload a file first.') {
    const prepared = getPrepared(root);
    if (!prepared) {
      const zone = root.querySelector('[data-upload-zone]');
      if (zone) setError(zone, message);
      return null;
    }
    return prepared;
  }

  window.PropertyERPUploads = {
    IMAGE_ACCEPT,
    DOC_ACCEPT,
    dropzoneHtml,
    bindAll,
    bindZone,
    getPrepared,
    requirePrepared,
    prepareFile,
    getPropertyImage,
    setPropertyImage,
    getDocuments,
    addDocument,
    formatBytes,
    clearZone,
  };
})();
