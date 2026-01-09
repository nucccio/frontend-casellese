<!-- src/components/ShareButtons.vue -->
<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  url: {
    type: String,
    default: () => window.location.href
  },
  imageUrl: {
    type: String,
    default: ''
  },
  layout: {
    type: String,
    default: 'horizontal' // horizontal, vertical, compact
  }
})

const encodedUrl = computed(() => encodeURIComponent(props.url))
const encodedTitle = computed(() => encodeURIComponent(props.title))
const encodedDescription = computed(() => encodeURIComponent(props.description))

// Share URLs
const shareUrls = computed(() => ({
  whatsapp: `https://wa.me/?text=${encodedTitle.value}%0A${encodedUrl.value}`,
  facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl.value}`,
  twitter: `https://twitter.com/intent/tweet?text=${encodedTitle.value}&url=${encodedUrl.value}`,
  pinterest: `https://pinterest.com/pin/create/button/?url=${encodedUrl.value}&description=${encodedTitle.value}&media=${encodeURIComponent(props.imageUrl)}`,
  email: `mailto:?subject=${encodedTitle.value}&body=${encodedDescription.value}%0A%0A${encodedUrl.value}`,
  telegram: `https://t.me/share/url?url=${encodedUrl.value}&text=${encodedTitle.value}`,
  linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl.value}`
}))

function share(platform) {
  const url = shareUrls.value[platform]
  
  if (platform === 'email') {
    window.location.href = url
  } else {
    window.open(url, '_blank', 'width=600,height=400,noopener,noreferrer')
  }
}

// Native Share API (für mobile Geräte)
const canNativeShare = computed(() => !!navigator.share)

async function nativeShare() {
  try {
    await navigator.share({
      title: props.title,
      text: props.description,
      url: props.url
    })
  } catch (err) {
    if (err.name !== 'AbortError') {
      console.error('Share failed:', err)
    }
  }
}

// Kopieren
async function copyLink() {
  try {
    await navigator.clipboard.writeText(props.url)
    alert('Link kopiert!')
  } catch (err) {
    // Fallback
    const input = document.createElement('input')
    input.value = props.url
    document.body.appendChild(input)
    input.select()
    document.execCommand('copy')
    document.body.removeChild(input)
    alert('Link kopiert!')
  }
}
</script>

<template>
  <div :class="['share-buttons', `layout-${layout}`]">
    <span class="share-label">Teilen:</span>
    
    <div class="share-icons">
      <!-- Native Share (mobile) -->
      <button 
        v-if="canNativeShare" 
        @click="nativeShare" 
        class="share-btn share-native"
        title="Teilen"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
          <polyline points="16 6 12 2 8 6"/>
          <line x1="12" y1="2" x2="12" y2="15"/>
        </svg>
      </button>

      <!-- WhatsApp -->
      <button 
        @click="share('whatsapp')" 
        class="share-btn share-whatsapp"
        title="Auf WhatsApp teilen"
      >
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </button>

      <!-- Facebook -->
      <button 
        @click="share('facebook')" 
        class="share-btn share-facebook"
        title="Auf Facebook teilen"
      >
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      </button>

      <!-- Twitter/X -->
      <button 
        @click="share('twitter')" 
        class="share-btn share-twitter"
        title="Auf X teilen"
      >
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      </button>

      <!-- Pinterest (nur wenn Bild vorhanden) -->
      <button 
        v-if="imageUrl"
        @click="share('pinterest')" 
        class="share-btn share-pinterest"
        title="Auf Pinterest pinnen"
      >
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z"/>
        </svg>
      </button>

      <!-- E-Mail -->
      <button 
        @click="share('email')" 
        class="share-btn share-email"
        title="Per E-Mail teilen"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
          <polyline points="22,6 12,13 2,6"/>
        </svg>
      </button>

      <!-- Link kopieren -->
      <button 
        @click="copyLink" 
        class="share-btn share-copy"
        title="Link kopieren"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
        </svg>
      </button>
    </div>
  </div>
</template>

<style scoped>
.share-buttons {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.share-buttons.layout-vertical {
  flex-direction: column;
  align-items: flex-start;
}

.share-buttons.layout-compact .share-label {
  display: none;
}

.share-label {
  font-weight: 500;
  color: #666;
  font-size: 0.9rem;
}

.share-icons {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.share-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  background-color: #f0f0f0;
  color: #333;
}

.share-btn:hover {
  transform: scale(1.1);
}

.share-btn svg {
  width: 20px;
  height: 20px;
}

/* Platform Colors */
.share-whatsapp:hover {
  background-color: #25D366;
  color: white;
}

.share-facebook:hover {
  background-color: #1877F2;
  color: white;
}

.share-twitter:hover {
  background-color: #000000;
  color: white;
}

.share-pinterest:hover {
  background-color: #E60023;
  color: white;
}

.share-email:hover {
  background-color: #e54c4c;
  color: white;
}

.share-copy:hover {
  background-color: #333;
  color: white;
}

.share-native:hover {
  background-color: #e54c4c;
  color: white;
}

/* Compact Layout */
.layout-compact .share-btn {
  width: 32px;
  height: 32px;
}

.layout-compact .share-btn svg {
  width: 16px;
  height: 16px;
}
</style>