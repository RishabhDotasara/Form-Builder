import { Skeleton } from "../ui/skeleton";

export function LoadingSkeleton() {
  return (
    <div className="h-screen w-full bg-white relative flex overflow-hidden">
      <div className="w-64 bg-gray-100">
        <Skeleton className="h-full w-full" />
      </div>
      <div className="flex-1 overflow-auto">
        <header className="bg-background border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-8" />
            <div className="flex items-center space-x-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-24" />
            </div>
          </div>
        </header>
        <main className="p-6">
          <div className="max-w-4xl mx-auto">
            <Skeleton className="h-10 w-48 mb-6" />
            <div className="space-y-4">
              {[...Array(3)].map((_, index) => (
                <Skeleton key={index} className="h-24 w-full" />
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}