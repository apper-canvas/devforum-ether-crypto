const Loading = () => {
  return (
    <div className="w-full space-y-6">
      {/* Question List Skeleton */}
      {[...Array(5)].map((_, index) => (
        <div key={index} className="bg-surface border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex gap-4">
            {/* Vote section skeleton */}
            <div className="flex flex-col items-center space-y-2 min-w-[60px]">
              <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-6 h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
            </div>
            
            {/* Stats section skeleton */}
            <div className="flex flex-col items-center space-y-2 min-w-[60px]">
              <div className="w-8 h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-12 h-3 bg-gray-200 rounded animate-pulse"></div>
            </div>
            
            {/* Content section skeleton */}
            <div className="flex-1 space-y-3">
              <div className="h-6 bg-gray-200 rounded animate-pulse w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6"></div>
              
              {/* Tags skeleton */}
              <div className="flex gap-2 mt-3">
                {[...Array(3)].map((_, tagIndex) => (
                  <div key={tagIndex} className="h-6 w-16 bg-gray-200 rounded animate-pulse"></div>
                ))}
              </div>
              
              {/* Author info skeleton */}
              <div className="flex justify-between items-center mt-4">
                <div className="w-32 h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-gray-200 rounded-full animate-pulse"></div>
                  <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Loading;