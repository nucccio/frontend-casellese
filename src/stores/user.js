import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
    state: () => ({
        profile: null,
        isLoading: false,
        error: null
    }),
    getters: {
        isAdmin: (state) => state.profile?.role === 'ADMIN',
        isLoggedIn: (state) => state.profile !== null,
        userName: (state) => state.profile?.name || '',
        userEmail: (state) => state.profile?.email || ''
    },
    actions: {
        async fetchProfile(getAccessTokenSilently, apiBaseUrl) {
            this.isLoading = true
            this.error = null
            try {
                const token = await getAccessTokenSilently()
                const response = await fetch(`${apiBaseUrl}/api/profile`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                
                if (response.ok) {
                    this.profile = await response.json()
                } else {
                    this.error = `Fehler: ${response.status} ${response.statusText}`
                    this.profile = null
                }
            } catch (e) {
                this.error = e.message
                this.profile = null
            } finally {
                this.isLoading = false
            }
        },
        clearProfile() {
            this.profile = null
            this.error = null
        }
    }
})