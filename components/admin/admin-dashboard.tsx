'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Plus, Edit, Trash2, LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { AdminTestsManager } from './admin-tests-manager'

interface AdminDashboardProps {
  userId: string
  userRole: string
}

interface Course {
  id: string
  title: string
  slug: string
  description: string
  price: number
  thumbnail_url: string
  category: string
  level: string
  is_published: boolean
}

export function AdminDashboard({ userId, userRole }: AdminDashboardProps) {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    fetchCourses()
  }, [userRole, userId])

  const fetchCourses = async () => {
    try {
      // Admins see all courses, instructors see only their courses
      let query = supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false })

      if (userRole !== 'admin') {
        query = query.eq('instructor_id', userId)
      }

      const { data, error } = await query

      if (error) {
        console.error('Error fetching courses:', error)
        alert(`Error loading courses: ${error.message}`)
        setLoading(false)
        return
      }

      if (data) {
        setCourses(data as Course[])
      } else {
        setCourses([])
      }
    } catch (error) {
      console.error('Unexpected error:', error)
      setCourses([])
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const handleCreateCourse = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    const courseData = {
      title: formData.get('title') as string,
      slug: formData.get('slug') as string,
      description: formData.get('description') as string,
      price: parseFloat(formData.get('price') as string),
      thumbnail_url: formData.get('thumbnail_url') as string,
      category: formData.get('category') as string,
      level: formData.get('level') as string,
      instructor_id: userId,
      duration_minutes: parseInt(formData.get('duration_minutes') as string) || 0,
      is_published: false,
    }

    const { error } = await supabase.from('courses').insert(courseData)

    if (error) {
      console.error('Error creating course:', error)
      alert('Failed to create course')
      return
    }

    setShowCreateDialog(false)
    fetchCourses()
  }

  const handleDeleteCourse = async (courseId: string) => {
    if (!confirm('Are you sure you want to delete this course?')) return

    const { error } = await supabase
      .from('courses')
      .delete()
      .eq('id', courseId)

    if (error) {
      console.error('Error deleting course:', error)
      alert('Failed to delete course')
      return
    }

    fetchCourses()
  }

  if (loading) {
    return <p>Loading...</p>
  }

  return (
    <div className="space-y-6">
      {/* Header with Logout */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            {userRole === 'admin' ? 'Manage all courses and content' : 'Manage your courses'}
          </p>
        </div>
        <Button variant="outline" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>

      <Tabs defaultValue="courses" className="space-y-6">
        <TabsList>
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="tests">Tests</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="courses" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">
              {userRole === 'admin' ? 'All Courses' : 'My Courses'}
            </h2>
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Course
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Course</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateCourse} className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Title</label>
                  <Input name="title" required />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Slug (URL-friendly)</label>
                  <Input name="slug" required placeholder="my-awesome-course" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Description</label>
                  <Textarea name="description" rows={4} required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Price (€)</label>
                    <Input name="price" type="number" step="0.01" required />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Duration (minutes)</label>
                    <Input name="duration_minutes" type="number" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Category</label>
                    <Input name="category" required />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Level</label>
                    <select name="level" className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm" required>
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                      <option value="all">All Levels</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Thumbnail URL</label>
                  <Input name="thumbnail_url" type="url" required />
                </div>
                <Button type="submit" className="w-full">Create Course</Button>
              </form>
            </DialogContent>
          </Dialog>
          </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Card key={course.id}>
              <CardHeader>
                <CardTitle className="line-clamp-2">{course.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className={course.is_published ? 'text-green-500' : 'text-muted-foreground'}>
                      {course.is_published ? 'Published' : 'Draft'}
                    </span>
                    <span className="font-semibold">€{course.price}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1" asChild>
                      <a href={`/admin/course/${course.id}`}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </a>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteCourse(course.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {courses.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground mb-4">No courses yet. Create your first course!</p>
              <Button onClick={() => setShowCreateDialog(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create Course
              </Button>
            </CardContent>
          </Card>
        )}
      </TabsContent>

      <TabsContent value="tests" className="space-y-6">
        <AdminTestsManager userId={userId} userRole={userRole} courses={courses} />
      </TabsContent>

      <TabsContent value="analytics">
        <Card>
          <CardHeader>
            <CardTitle>Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Analytics dashboard coming soon...</p>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
    </div>
  )
}

