import { create } from 'zustand'

export const useProductStore = create((set, get) => ({
  product: [],
  total: 0,
  loading: false,
  error: null,
  searchQuery: '',
  currentPage: 1,
  limit: 10,

  setProduct: (product, total) => set({ product, total }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setSearchQuery: (searchQuery) => set({ searchQuery, currentPage: 1 }),
  setCurrentPage: (currentPage) => set({ currentPage }),

  removeProduct: (id) =>
    set((state) => ({
      product: state.product.filter((prev) => prev.id !== id),
      total: state.total - 1,
    })),

  reset: () =>
    set({ product: [], total: 0, loading: false, error: null, searchQuery: '', currentPage: 1 }),
}))
