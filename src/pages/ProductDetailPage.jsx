import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Pencil, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { productService } from '../services/productService'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import ConfirmDialog from '../components/ui/ConfirmDialog'

export default function ProductDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)
  const [openDelete, setOpenDelete] = useState(false)
  const [activeImg, setActiveImg] = useState(0)

  useEffect(() => {
    productService.getById(id)
      .then(({ data }) => {
        setProduct(data); setLoading(false)
      }).catch(() => {
        toast.error('Product not found'); navigate('/products')
      })
  }, [id])

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await productService.delete(id)
      toast.success('Product deleted')
      navigate('/products')
    } catch {
      toast.error('Delete failed')
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="card animate-pulse space-y-4">
        <div className="h-6 bg-gray-100 rounded w-1/3" />
        <div className="h-48 bg-gray-100 rounded-xl" />
        <div className="h-4 bg-gray-100 rounded w-2/3" />
      </div>
    )
  }

  if (!product) return null

  return (
    <div className="space-y-4 max-w-4xl">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/products')}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Products
        </button>
        <div className="flex gap-2">
          <Button variant="secondary" icon={Pencil} size="sm" onClick={() => navigate(`/products/${id}/edit`)}>
            Edit
          </Button>
          <Button variant="danger" icon={Trash2} size="sm" onClick={() => setOpenDelete(true)}>
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card space-y-3">
          <img
            src={product.images?.[activeImg] || product.thumbnail}
            alt={product.title}
            className="w-full h-64 object-contain rounded-lg bg-gray-50"
          />
          {product.images?.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {product.images.map((img, i) => (
                <button key={i} onClick={() => setActiveImg(i)}>
                  <img
                    src={img}
                    alt=""
                    className={`w-14 h-14 object-cover rounded-lg flex-shrink-0 border-2 transition-colors ${activeImg === i ? 'border-primary-500' : 'border-transparent'}`}
                  />
                </button>
              ))}
            </div>
          )}
        </div>
        
        <div className="card space-y-4">
          <div>
            <div className="flex items-start justify-between gap-2 mb-1">
              <h2 className="text-xl font-bold text-gray-900">{product.title}</h2>
              <Badge color="blue">{product.category}</Badge>
            </div>
            {product.brand && <p className="text-sm text-gray-400">by {product.brand}</p>}
          </div>

          <p className="text-gray-600 text-sm leading-relaxed">{product.description}</p>

          <div className="grid grid-cols-2 gap-3">
            {[
              ['Price', `$${product.price}`],
              ['Discount', `${product.discountPercentage}%`],
              ['Rating', `⭐ ${product.rating}`],
              ['Stock', product.stock],
              ['SKU', product.sku || '—'],
              ['Weight', product.weight ? `${product.weight}g` : '—'],
            ].map(([label, data]) => (
              <div key={label} className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-400 uppercase">{label}</p>
                <p className="font-semibold text-gray-900 mt-0.5">{data}</p>
              </div>
            ))}
          </div>

          {product.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <Badge key={tag} color="gray">{tag}</Badge>
              ))}
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        isOpen={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete Product"
        message={`Are you sure you want to delete "${product.title}"?`}
      />
    </div>
  )
}
