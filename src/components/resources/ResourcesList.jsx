
import { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Download } from "lucide-react";

const mockResources = [
  {
    id: "1",
    title: "Pomodoro Technique Cheat Sheet",
    description: "A quick reference guide to implementing the Pomodoro technique effectively.",
    fileType: "pdf",
    fileSize: "1.2 MB",
    category: "Productivity",
    url: "#"
  },
  {
    id: "2",
    title: "Weekly Planning Template",
    description: "Structured template for planning your week with Pomodoro sessions.",
    fileType: "pdf",
    fileSize: "842 KB",
    category: "Templates",
    url: "#"
  },
  {
    id: "3",
    title: "Focus Habit Tracker",
    description: "Track your daily focus habits and productivity metrics.",
    fileType: "pdf",
    fileSize: "1.5 MB",
    category: "Templates",
    url: "#"
  },
  {
    id: "4",
    title: "Distraction Management Guide",
    description: "Strategies for identifying and managing common distractions.",
    fileType: "pdf",
    fileSize: "2.1 MB",
    category: "Productivity",
    url: "#"
  },
  {
    id: "5",
    title: "Deep Work Session Planner",
    description: "Plan and schedule your deep work sessions for maximum effectiveness.",
    fileType: "pdf",
    fileSize: "1.8 MB",
    category: "Templates",
    url: "#"
  }
];

export function ResourcesList() {
  const [selectedResource, setSelectedResource] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  
  const categories = ["all", ...Array.from(new Set(mockResources.map(r => r.category)))];
  
  const filteredResources = selectedCategory === "all" 
    ? mockResources 
    : mockResources.filter(r => r.category === selectedCategory);

  const getFileIcon = (fileType) => {
    return (
      <div className="w-12 h-14 flex items-center justify-center rounded bg-muted">
        <span className="uppercase font-bold text-sm text-muted-foreground">{fileType}</span>
      </div>
    );
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Resources</h2>
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <Badge 
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setSelectedCategory(category)}
            >
              {category === "all" ? "All Resources" : category}
            </Badge>
          ))}
        </div>
      </div>
      
      <div className="grid gap-4">
        {filteredResources.map(resource => (
          <Card key={resource.id} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="flex items-center p-4 gap-4">
                {getFileIcon(resource.fileType)}
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium line-clamp-1">{resource.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-1">{resource.description}</p>
                  <div className="flex items-center text-xs text-muted-foreground mt-1">
                    <span>{resource.fileType.toUpperCase()}</span>
                    <span className="mx-2">•</span>
                    <span>{resource.fileSize}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setSelectedResource(resource)}
                  >
                    Preview
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon"
                    className="rounded-full"
                  >
                    <Download className="h-4 w-4" />
                    <span className="sr-only">Download {resource.title}</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* PDF Preview Dialog */}
      <Dialog open={!!selectedResource} onOpenChange={() => setSelectedResource(null)}>
        <DialogContent className="max-w-3xl h-[80vh]">
          <DialogHeader>
            <DialogTitle>{selectedResource?.title}</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col h-full">
            <div className="flex-1 min-h-0">
              {/* In a real app, this would render an actual PDF viewer component */}
              <div className="w-full h-full flex flex-col items-center justify-center bg-muted rounded-md p-8">
                <p className="text-center mb-4">
                  This is a placeholder for a PDF viewer. In a real application, this would display the actual PDF document.
                </p>
                <p className="text-sm text-muted-foreground mb-6">
                  {selectedResource?.description}
                </p>
                <Button className="mx-auto">
                  <Download className="mr-2 h-4 w-4" />
                  Download PDF ({selectedResource?.fileSize})
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
