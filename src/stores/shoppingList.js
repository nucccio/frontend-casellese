// src/stores/shoppingList.js
import { defineStore } from 'pinia'

export const useShoppingListStore = defineStore('shoppingList', {
    state: () => ({
        items: [],
        isLoading: false,
        error: null
    }),

    getters: {
        uncheckedItems: (state) => state.items.filter(item => !item.checked),
        checkedItems: (state) => state.items.filter(item => item.checked),
        uncheckedCount: (state) => state.items.filter(item => !item.checked).length,
        totalCount: (state) => state.items.length
    },

    actions: {
        async fetchItems(getAccessTokenSilently, apiBaseUrl) {
            this.isLoading = true
            this.error = null
            
            try {
                const token = await getAccessTokenSilently()
                const response = await fetch(`${apiBaseUrl}/api/shopping-list`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                
                if (response.ok) {
                    this.items = await response.json()
                } else {
                    this.error = 'Fehler beim Laden der Einkaufsliste'
                }
            } catch (e) {
                this.error = e.message
            } finally {
                this.isLoading = false
            }
        },

        async addItem(ingredient, category, getAccessTokenSilently, apiBaseUrl) {
            try {
                const token = await getAccessTokenSilently()
                const response = await fetch(`${apiBaseUrl}/api/shopping-list`, {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ ingredient, category })
                })
                
                if (response.ok) {
                    const newItem = await response.json()
                    this.items.unshift(newItem)
                    return true
                }
                return false
            } catch (e) {
                console.error('Error adding item:', e)
                return false
            }
        },

        async addFromProduct(productId, ingredients, getAccessTokenSilently, apiBaseUrl) {
            try {
                const token = await getAccessTokenSilently()
                const response = await fetch(`${apiBaseUrl}/api/shopping-list/from-product`, {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ productId, ingredients })
                })
                
                if (response.ok) {
                    const data = await response.json()
                    // Neue Items am Anfang einfügen
                    this.items = [...data.items, ...this.items]
                    return data
                }
                return null
            } catch (e) {
                console.error('Error adding from product:', e)
                return null
            }
        },

        async toggleItem(itemId, getAccessTokenSilently, apiBaseUrl) {
            try {
                const token = await getAccessTokenSilently()
                const response = await fetch(`${apiBaseUrl}/api/shopping-list/${itemId}/toggle`, {
                    method: 'PUT',
                    headers: { Authorization: `Bearer ${token}` }
                })
                
                if (response.ok) {
                    const updated = await response.json()
                    const index = this.items.findIndex(i => i.id === itemId)
                    if (index !== -1) {
                        this.items[index] = updated
                    }
                    return true
                }
                return false
            } catch (e) {
                console.error('Error toggling item:', e)
                return false
            }
        },

        async deleteItem(itemId, getAccessTokenSilently, apiBaseUrl) {
            try {
                const token = await getAccessTokenSilently()
                const response = await fetch(`${apiBaseUrl}/api/shopping-list/${itemId}`, {
                    method: 'DELETE',
                    headers: { Authorization: `Bearer ${token}` }
                })
                
                if (response.ok) {
                    this.items = this.items.filter(i => i.id !== itemId)
                    return true
                }
                return false
            } catch (e) {
                console.error('Error deleting item:', e)
                return false
            }
        },

        async deleteChecked(getAccessTokenSilently, apiBaseUrl) {
            try {
                const token = await getAccessTokenSilently()
                const response = await fetch(`${apiBaseUrl}/api/shopping-list/checked`, {
                    method: 'DELETE',
                    headers: { Authorization: `Bearer ${token}` }
                })
                
                if (response.ok) {
                    this.items = this.items.filter(i => !i.checked)
                    return true
                }
                return false
            } catch (e) {
                console.error('Error deleting checked items:', e)
                return false
            }
        },

        async clearAll(getAccessTokenSilently, apiBaseUrl) {
            try {
                const token = await getAccessTokenSilently()
                const response = await fetch(`${apiBaseUrl}/api/shopping-list/all`, {
                    method: 'DELETE',
                    headers: { Authorization: `Bearer ${token}` }
                })
                
                if (response.ok) {
                    this.items = []
                    return true
                }
                return false
            } catch (e) {
                console.error('Error clearing list:', e)
                return false
            }
        },

        clearStore() {
            this.items = []
            this.error = null
        }
    }
})