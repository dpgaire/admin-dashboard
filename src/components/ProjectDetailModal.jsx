import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { ExternalLink, Github, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Eye } from 'lucide-react';

const ProjectDetailModal = ({ project }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  if (!project) return null;

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" className="cursor-pointer rounded-lg font-medium transition-all hover:scale-[1.02] hover:shadow-md">
         <Eye className="h-4 w-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto overflow-x-hidden p-0 rounded-xl border-0 shadow-2xl bg-background data-[state=open]:animate-slide-in-right-fast data-[state=closed]:animate-slide-out-right-fast">
        
        {/* Close Button */}
        <DialogClose asChild>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 h-8 w-8 rounded-full bg-black/20 backdrop-blur-sm text-white hover:bg-black/40 hover:text-white z-50"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogClose>

        {/* Header Image */}
        {project.image && (
          <div className="relative h-56 md:h-64 overflow-hidden rounded-t-xl">
            <img
              src={project.image}
              alt={project.title}
              className="object-cover w-full h-full hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute bottom-4 left-6 text-white">
              <h2 className="text-2xl md:text-3xl font-bold">{project.title}</h2>
              <p className="text-sm opacity-90">{project.category?.replace('-', ' ')}</p>
            </div>
          </div>
        )}

        {/* Body */}
        <div className="p-6 md:p-8 bg-background/80 backdrop-blur-sm">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-2xl font-bold text-foreground">{project.title}</DialogTitle>
            <p className="text-sm text-muted-foreground mt-1">{project.description}</p>
          </DialogHeader>

          <div className="grid gap-6">
            {/* Problem & Solution */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-muted/30 to-muted/10 p-4 rounded-xl border border-border/50">
                <h3 className="font-semibold text-lg mb-2 text-foreground">Problem</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{project.problem}</p>
              </div>
              <div className="bg-gradient-to-br from-muted/30 to-muted/10 p-4 rounded-xl border border-border/50">
                <h3 className="font-semibold text-lg mb-2 text-foreground">Solution</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{project.solution}</p>
              </div>
            </div>

            {/* Process */}
            <div className="bg-gradient-to-br from-muted/30 to-muted/10 p-4 rounded-xl border border-border/50">
              <h3 className="font-semibold text-lg mb-2 text-foreground">Process</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{project.process}</p>
            </div>

            {/* Technologies */}
            <div>
              <h3 className="font-semibold text-lg mb-3 text-foreground">Technologies Used</h3>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <Badge
                    key={tech}
                    className="bg-primary/10 text-primary border border-primary/30 px-3 py-1 text-sm rounded-full hover:bg-primary/20 transition-all hover:scale-105"
                  >
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Enhanced Screenshots Carousel */}
            {project.screenshots?.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-semibold text-lg text-foreground">Screenshots</h3>
                
                <div className="relative group">
                  {/* Main Carousel Container */}
                  <div className="relative overflow-hidden rounded-xl bg-muted/20 p-2 border border-border/50">
                    <Carousel 
                      className="w-full" 
                      opts={{ 
                        align: "start",
                        loop: true,
                      }}
                    >
                      <CarouselContent className="flex w-full -ml-2">
                        {project.screenshots.map((screenshot, index) => (
                          <CarouselItem key={index} className="pl-2 flex-[0_0_100%]">
                            <div className="relative overflow-hidden rounded-lg bg-background">
                              <img
                                src={screenshot}
                                alt={`${project.title} screenshot ${index + 1}`}
                                className="w-full h-auto rounded-lg object-cover transition-all duration-500 hover:scale-[1.02]"
                              />
                              
                              {/* Image Overlay on Hover */}
                              <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-all duration-300 rounded-lg" />
                            </div>
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      
                      {/* Custom Navigation Buttons */}
                      <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-2">
                        <CarouselPrevious className="relative static h-10 w-10 rounded-full bg-black/30 backdrop-blur-sm text-white border-0 hover:bg-black/50 hover:scale-110 transition-all duration-200 -translate-y-1/2 top-1/2 left-2" />
                        <CarouselNext className="relative static h-10 w-10 rounded-full bg-black/30 backdrop-blur-sm text-white border-0 hover:bg-black/50 hover:scale-110 transition-all duration-200 -translate-y-1/2 top-1/2 right-2" />
                      </div>
                    </Carousel>
                  </div>

                  {/* Custom Dot Indicators */}
                  <div className="flex justify-center items-center gap-2 mt-4">
                    {project.screenshots.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`h-3 rounded-full transition-all duration-300 ${
                          index === currentSlide 
                            ? 'bg-primary w-8' 
                            : 'bg-muted-foreground/30 w-3 hover:bg-muted-foreground/50'
                        }`}
                        aria-label={`Go to slide ${index + 1}`}
                      />
                    ))}
                  </div>

                  {/* Slide Counter */}
                  <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
                    {currentSlide + 1} / {project.screenshots.length}
                  </div>
                </div>
              </div>
            )}

            {/* Links */}
            <div className="flex flex-wrap justify-end gap-3 mt-6 pt-4 border-t border-border/50">
              <Button asChild variant="default" className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all hover:scale-105 hover:shadow-lg">
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4" /> Live Demo
                </a>
              </Button>
              <Button asChild variant="secondary" className="flex items-center gap-2 rounded-lg bg-secondary/50 hover:bg-secondary/70 transition-all hover:scale-105 hover:shadow-lg">
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                  <Github className="w-4 h-4" /> GitHub
                </a>
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectDetailModal;