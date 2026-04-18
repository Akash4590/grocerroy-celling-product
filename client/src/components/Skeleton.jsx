import { motion } from 'framer-motion'

export function ProductCardSkeleton() {
  return (
    <div className="card p-0 overflow-hidden" style={{ borderRadius: '20px' }}>
      <div className="skeleton h-44 rounded-none" />
      <div className="p-4 flex flex-col gap-3">
        <div className="flex justify-between">
          <div className="skeleton h-3 w-20 rounded" />
          <div className="skeleton h-3 w-16 rounded" />
        </div>
        <div className="skeleton h-5 w-3/4 rounded" />
        <div className="skeleton h-3 w-full rounded" />
        <div className="skeleton h-3 w-2/3 rounded" />
        <div className="flex justify-between items-center mt-2">
          <div className="skeleton h-7 w-16 rounded" />
          <div className="skeleton h-9 w-20 rounded-xl" />
        </div>
      </div>
    </div>
  )
}

export function CartItemSkeleton() {
  return (
    <div className="flex items-center gap-4 p-4 glass rounded-xl">
      <div className="skeleton w-14 h-14 rounded-xl shrink-0" />
      <div className="flex-1 flex flex-col gap-2">
        <div className="skeleton h-4 w-3/4 rounded" />
        <div className="skeleton h-3 w-1/2 rounded" />
      </div>
      <div className="skeleton h-8 w-24 rounded-xl shrink-0" />
    </div>
  )
}

export function HeroSkeleton() {
  return (
    <div className="flex flex-col gap-4 max-w-xl">
      <div className="skeleton h-6 w-40 rounded-full" />
      <div className="flex flex-col gap-2">
        <div className="skeleton h-12 w-full rounded-xl" />
        <div className="skeleton h-12 w-3/4 rounded-xl" />
      </div>
      <div className="skeleton h-5 w-full rounded" />
      <div className="skeleton h-5 w-2/3 rounded" />
      <div className="skeleton h-12 w-40 rounded-xl" />
    </div>
  )
}
