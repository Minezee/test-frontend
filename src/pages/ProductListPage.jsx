import React, { useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Search, Pencil, Trash2, Eye, RefreshCw } from 'lucide-react'
import toast from 'react-hot-toast'
import { useProductStore } from '../store/productStore'
import { productService } from '../services/productService'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import Pagination from '../components/ui/Pagination'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import { useState } from 'react'

export default function ProductListPage() {
  const navigate = useNavigate()
  const {
    product, total, loading, searchQuery, currentPage, limit, setProduct,
    setLoading, setError, setSearchQuery, setCurrentPage,
  } = useProductStore()

  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [searchInput, setSearchInput] = useState(searchQuery)

  const totalPages = Math.ceil(total / limit)

  const fetchProducts = useCallback(async () => {
    setLoading(true)

    try {
      const skip = (currentPage - 1) * limit
      const { data } = searchQuery
        ? await productService.search(searchQuery, limit, skip)
        : await productService.getAll(limit, skip)
      setProduct(data.products, data.total)
    } catch {
      setError('Failed to load products')
      toast.error('Failed to load products')
    } finally {
      setLoading(false)
    }
  }, [searchQuery, currentPage, limit])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  useEffect(() => {
    const time = setTimeout(() => setSearchQuery(searchInput), 500)
    return () => clearTimeout(time)
  }, [searchInput])

  const handleDelete = async () => {
    if (!deleteTarget) return;

    setDeleting(true)

    try {
      await productService.delete(deleteTarget.id)
      toast.success(`"${deleteTarget.title}" deleted`)
      setDeleteTarget(null)
      fetchProducts()
    } catch {
      toast.error('Failed to delete product')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              className="input-field pl-9"
              placeholder="Search products..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
          <Button icon={Plus} onClick={() => navigate('/products/add')}>
            Add Product
          </Button>
        </div>
        <div className="card p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  {['Product', 'Category', 'Price', 'Stock', 'Rating', 'Actions'].map((data) => (
                    <th key={data} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      {data}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center text-gray-400">
                      <div className='flex flex-col items-center gap-2'>
                        <RefreshCw className='animate-spin !text-slate-700' />
                        <p styled={'mt-4 !text-slate-700'}>Loading</p>
                      </div>
                    </td>
                  </tr>
                ) : product.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center text-gray-400">
                      No products found.
                    </td>
                  </tr>
                ) : (
                  product.map((data) => (
                    <tr key={data.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={data.thumbnail}
                            alt={data.title}
                            className="w-9 h-9 rounded-lg object-cover flex-shrink-0 bg-gray-100"
                          />
                          <div>
                            <p className="font-medium text-gray-900 line-clamp-1">{data.title}</p>
                            <p className="text-xs text-gray-400">{data.brand || '—'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge color="blue">{data.category}</Badge>
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-900">${data.price}</td>
                      <td className="px-4 py-3">
                        <Badge color={data.stock > 10 ? 'green' : data.stock > 0 ? 'yellow' : 'red'}>
                          {data.stock}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-gray-600">⭐ {data.rating}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => navigate(`/products/${data.id}`)}
                            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => navigate(`/products/${data.id}/edit`)}
                            className="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(data)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {!loading && (
            <div className="px-4 py-3 border-t border-gray-100 text-xs text-gray-400">
              Showing {product?.length} of {total} products
            </div>
          )}
        </div>
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      </div>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete Product"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
      />
    </>
  )
}
