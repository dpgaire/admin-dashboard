import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Github, X, Calendar, Clock, Heart, User,Eye } from 'lucide-react';

const BlogDetailModal = ({ blog }) => {
  if (!blog) return null;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="cursor-pointer rounded-lg font-medium transition-all hover:scale-[1.02] hover:shadow-md">
         <Eye className="h-4 w-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto overflow-x-hidden p-0 rounded-xl border-0 shadow-2xl bg-background data-[state=open]:animate-slide-in-right-fast data-[state=closed]:animate-slide-out-right-fast">
        
        <DialogClose asChild>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 h-8 w-8 rounded-full bg-black/20 backdrop-blur-sm text-white hover:bg-black/40 hover:text-white z-50"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogClose>

        {blog.image && (
          <div className="relative h-56 md:h-64 overflow-hidden rounded-t-xl">
            <img
              src={blog.image}
              alt={blog.title}
              className="object-cover w-full h-full hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute bottom-4 left-6 text-white">
              <h2 className="text-2xl md:text-3xl font-bold">{blog.title}</h2>
              <p className="text-sm opacity-90">{blog.category}</p>
            </div>
          </div>
        )}

        <div className="p-6 md:p-8 bg-background/80 backdrop-blur-sm">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-2xl font-bold text-foreground">{blog.title}</DialogTitle>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    <span>{blog.author}</span>
                </div>
                <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(blog.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{blog.readTime}</span>
                </div>
                <div className="flex items-center gap-1">
                    <Heart className="h-4 w-4" />
                    <span>{blog.likes}</span>
                </div>
            </div>
          </DialogHeader>

          <div className="prose prose-stone dark:prose-invert max-w-none">
            <p>{blog.content}</p>
          </div>

            {blog.tags && blog.tags.length > 0 && (
                <div className="mt-6">
                <h3 className="font-semibold text-lg mb-3 text-foreground">Tags</h3>
                <div className="flex flex-wrap gap-2">
                    {blog.tags.map((tag) => (
                    <Badge
                        key={tag}
                        className="bg-primary/10 text-primary border border-primary/30 px-3 py-1 text-sm rounded-full hover:bg-primary/20 transition-all hover:scale-105"
                    >
                        {tag}
                    </Badge>
                    ))}
                </div>
                </div>
            )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BlogDetailModal;
