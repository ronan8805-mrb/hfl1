'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Heart, MessageCircle, Send } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

interface CommunityFeedProps {
  userId: string
}

interface Post {
  id: string
  user_id: string
  content: string
  media_url: string | null
  media_type: string | null
  upvotes: number
  created_at: string
  user: {
    id: string
    full_name: string | null
    email: string
    avatar_url: string | null
  }
  comments_count: number
  user_upvoted: boolean
}

export function CommunityFeed({ userId }: CommunityFeedProps) {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [newPost, setNewPost] = useState('')
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    fetchPosts()

    // Subscribe to new posts
    const channel = supabase
      .channel('community-posts')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'community_posts',
        },
        () => {
          fetchPosts()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase])

  const fetchPosts = async () => {
    const { data } = await supabase
      .from('community_posts')
      .select(`
        *,
        user:profiles!community_posts_user_id_fkey(id, full_name, email, avatar_url),
        comments:community_comments(count)
      `)
      .order('created_at', { ascending: false })
      .limit(20)

    if (data) {
      const postsWithCounts = data.map((post: any) => ({
        ...post,
        comments_count: post.comments?.length || 0,
        user_upvoted: false, // TODO: Check if user upvoted
      }))
      setPosts(postsWithCounts as Post[])
    }

    setLoading(false)
  }

  const handleCreatePost = async () => {
    if (!newPost.trim()) return

    const { error } = await supabase.from('community_posts').insert({
      user_id: userId,
      content: newPost.trim(),
    })

    if (error) {
      console.error('Error creating post:', error)
      alert('Failed to create post. Please try again.')
      return
    }

    setNewPost('')
    setShowCreateDialog(false)
    fetchPosts()
  }

  const handleUpvote = async (postId: string) => {
    // TODO: Implement upvote system (could use a separate upvotes table)
    // For now, just increment locally
    setPosts(posts.map(p => 
      p.id === postId 
        ? { ...p, upvotes: p.upvotes + 1, user_upvoted: true }
        : p
    ))
  }

  if (loading) {
    return <p className="text-muted-foreground">Loading community posts...</p>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Recent Posts</h2>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>Create Post</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create a Post</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Textarea
                placeholder="What's on your mind?"
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                rows={4}
              />
              <Button onClick={handleCreatePost} className="w-full">
                Post
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {posts.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground mb-4">No posts yet. Be the first to share!</p>
            <Button onClick={() => setShowCreateDialog(true)}>Create First Post</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <Card key={post.id}>
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <Avatar>
                    <AvatarImage src={post.user.avatar_url || undefined} />
                    <AvatarFallback>
                      {post.user.full_name?.charAt(0) || post.user.email.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold">
                        {post.user.full_name || 'Anonymous'}
                      </h3>
                      <span className="text-sm text-muted-foreground">
                        {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                      </span>
                    </div>
                    <p className="mb-4 whitespace-pre-wrap">{post.content}</p>
                    {post.media_url && (
                      <div className="mb-4">
                        {post.media_type === 'video' ? (
                          <video src={post.media_url} controls className="rounded-lg max-w-full" />
                        ) : (
                          <img src={post.media_url} alt="Post media" className="rounded-lg max-w-full" />
                        )}
                      </div>
                    )}
                    <div className="flex items-center gap-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleUpvote(post.id)}
                        className={post.user_upvoted ? 'text-red-600' : ''}
                      >
                        <Heart className={`w-4 h-4 mr-2 ${post.user_upvoted ? 'fill-current' : ''}`} />
                        {post.upvotes}
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        {post.comments_count}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

