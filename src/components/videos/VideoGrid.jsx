
import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play } from "lucide-react";
import { VideoPlayer } from "./VideoPlayer";


const mockVideos = [
  {
    id: "1",
    title: "Introduction to Focus Techniques",
    thumbnail: "https://images.unsplash.com/photo-1606636660801-c61b8e97a8b7?w=500&auto=format&fit=crop",
    duration: "12:34",
    progress: 100,
    module: "Getting Started"
  },
  {
    id: "2",
    title: "The Science Behind Pomodoro",
    thumbnail: "https://images.unsplash.com/photo-1596003906949-67221c37965c?w=500&auto=format&fit=crop",
    duration: "18:22",
    progress: 75,
    module: "Getting Started"
  },
  {
    id: "3",
    title: "Creating an Optimal Work Environment",
    thumbnail: "https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?w=500&auto=format&fit=crop",
    duration: "14:56",
    progress: 0,
    module: "Getting Started"
  },
  {
    id: "4",
    title: "Advanced Focus Strategies",
    thumbnail: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=500&auto=format&fit=crop",
    duration: "21:08",
    progress: 0,
    module: "Advanced Techniques"
  },
  {
    id: "5",
    title: "Time Blocking Mastery",
    thumbnail: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=500&auto=format&fit=crop",
    duration: "16:45",
    progress: 30,
    module: "Advanced Techniques"
  },
  {
    id: "6",
    title: "Effective Task Prioritization",
    thumbnail: "https://images.unsplash.com/photo-1483058712412-4245e9b90334?w=500&auto=format&fit=crop",
    duration: "19:33",
    progress: 0,
    module: "Advanced Techniques"
  }
];

export function VideoGrid() {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedModule, setSelectedModule] = useState("all");
  
  const modules = useMemo(() => {
    const allModules = mockVideos.map(video => video.module);
    return ["all", ...Array.from(new Set(allModules))];
  }, []);
  
  const filteredVideos = useMemo(() => {
    if (selectedModule === "all") return mockVideos;
    return mockVideos.filter(video => video.module === selectedModule);
  }, [selectedModule]);
  
  return (
    <div className="space-y-6 animate-fade-in">
      {selectedVideo ? (
        <div className="space-y-6">
          <button 
            onClick={() => setSelectedVideo(null)} 
            className="text-sm font-medium flex items-center hover:text-primary transition-colors"
          >
            ← Back to videos
          </button>
          <VideoPlayer video={selectedVideo} />
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight">Course Videos</h2>
            <div className="flex flex-wrap gap-2">
              {modules.map(module => (
                <Badge 
                  key={module}
                  variant={selectedModule === module ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setSelectedModule(module)}
                >
                  {module === "all" ? "All Modules" : module}
                </Badge>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredVideos.map(video => (
              <Card 
                key={video.id} 
                className="overflow-hidden cursor-pointer card-hover"
                onClick={() => setSelectedVideo(video)}
              >
                <div className="relative aspect-video">
                  <img 
                    src={video.thumbnail} 
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <div className="rounded-full bg-white/90 p-3">
                      <Play className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    {video.duration}
                  </div>
                  {video.progress > 0 && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-muted">
                      <div 
                        className="h-full bg-primary" 
                        style={{ width: `${video.progress}%` }}
                      ></div>
                    </div>
                  )}
                </div>
                <CardContent className="p-4">
                  <h3 className="font-medium line-clamp-2">{video.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{video.module}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
