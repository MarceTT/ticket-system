import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'

const SkeletonTicketDetail = () => {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-10 mx-auto max-w-7xl">
      <Skeleton className="text-4xl font-semibold"></Skeleton>
      <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
    <Card>
    <CardHeader className="px-4 py-6 grid grid-cols-2 items-start gap-4">
      <Skeleton className="h-6 w-24" />
        <Skeleton className="h-6 w-12" />
    </CardHeader>
    <CardContent className="px-4 py-6 grid gap-4">
      <div className="flex items-center gap-4">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="font-medium">
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="font-medium">
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="font-medium">
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="font-medium">
          <Skeleton className="h-4 w-64" />
        </div>
      </div>
    </CardContent>
  </Card>
  </div>
    </div>
  )
}

export default SkeletonTicketDetail