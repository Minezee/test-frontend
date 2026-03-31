import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { ArrowLeft, Save } from 'lucide-react'
import toast from 'react-hot-toast'
import { productService } from '../services/productService'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'

const CATEGORY_OPTIONS = [
  'smartphones', 'laptops', 'fragrances', 'skincare', 'groceries',
  'home-decoration', 'furniture', 'tops', 'womens-dresses', 'womens-shoes',
  'mens-shirts', 'mens-shoes', 'mens-watches', 'womens-watches', 'womens-bags',
  'womens-jewellery', 'sunglasses', 'automotive', 'motorcycle', 'lighting',
]

export default function ProductFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditMode = Boolean(id)

  const [isFetching, setIsFetching] = useState(isEditMode)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      title: '',
      description: '',
      price: '',
      discountPercentage: '',
      rating: '',
      stock: '',
      brand: '',
      category: '',
      thumbnail: '',
    },
  })

  useEffect(() => {
    if (!isEditMode) return

    productService.getById(id)
      .then(({ data }) => {
        reset({
          title: data.title || '',
          description: data.description || '',
          price: data.price || '',
          discountPercentage: data.discountPercentage || '',
          rating: data.rating || '',
          stock: data.stock || '',
          brand: data.brand || '',
          category: data.category || '',
          thumbnail: data.thumbnail || '',
        })
        setIsFetching(false)
      })
      .catch(() => {
        toast.error('Product not found')
        navigate('/products')
      })
  }, [id, isEditMode, navigate, reset])

  const onSubmit = async (formData) => {
    setIsSubmitting(true)

    try {
      const payload = {
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock),
      }

      if (isEditMode) {
        await productService.update(id, payload)
        toast.success('Product updated!')
        navigate(`/products/${id}`)
      } else {
        await productService.create(payload)
        toast.success('Product added!')
        navigate('/products')
      }
    } catch {
      toast.error('Something went wrong')
    } finally {
      setIsSubmitting(false)
    }
  }

  const thumbnailPreview = watch('thumbnail')

  if (isFetching) {
    return <div className="card animate-pulse h-64" />
  }

  return (
    <div className="max-w-2xl space-y-4">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <h2 className="font-semibold text-lg">
          {isEditMode ? 'Edit Product' : 'Add New Product'}
        </h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="card space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          <Input
            label="Title *"
            {...register('title', { required: 'Title is required' })}
            error={errors.title?.message}
          />

          <Input
            label="Brand"
            {...register('brand')}
          />

          <Input
            label="Price *"
            type="number"
            min={0}
            {...register('price', {
              required: 'Price is required',
              validate: (value) =>
                !isNaN(value) || 'Price must be a number',
            })}
            error={errors.price?.message}
          />

          <Input
            label="Stock *"
            type="number"
            min={0}
            {...register('stock', {
              required: 'Stock is required',
              validate: (value) =>
                !isNaN(value) || 'Stock must be a number',
            })}
            error={errors.stock?.message}
          />

          <Input
            label="Discount %"
            type="number"
            min={0}
            max={100}
            {...register('discountPercentage')}
          />

          <Input
            label="Rating"
            type="number"
            min={0}
            max={5}
            {...register('rating')}
          />

          <Input
            label="Thumbnail URL"
            className="sm:col-span-2"
            {...register('thumbnail')}
          />

          {thumbnailPreview && (
          <div className="flex items-center gap-3 p-3 bg-gray-50 w-fit rounded-lg">
            <img
              src={thumbnailPreview}
              alt="preview"
              className="w-12 h-12 object-cover rounded-lg"
              onError={(event) => (event.target.style.display = 'none')}
            />
          </div>
        )}

          <div className="sm:col-span-2 flex flex-col gap-1">
            <label className="text-sm font-medium">Category *</label>
            <select
              {...register('category', { required: 'Category is required' })}
              className={`input-field ${errors.category ? 'border-red-400' : ''}`}
            >
              <option value="">Select category</option>
              {CATEGORY_OPTIONS.map((categoryName) => (
                <option key={categoryName} value={categoryName}>
                  {categoryName}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-xs text-red-500">{errors.category.message}</p>
            )}
          </div>

          <div className="sm:col-span-2 flex flex-col gap-1">
            <label className="text-sm font-medium">Description</label>
            <textarea
              rows={3}
              {...register('description')}
              className="input-field resize-none"
              placeholder="Product description..."
            />
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <Button
            variant="secondary"
            type="button"
            onClick={() => navigate(-1)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            loading={isSubmitting}
            icon={Save}
          >
            {isEditMode ? 'Save Changes' : 'Add Product'}
          </Button>
        </div>
      </form>
    </div>
  )
}