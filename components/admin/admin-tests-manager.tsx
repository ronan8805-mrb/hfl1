'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Plus, Edit, Trash2, FileQuestion, ChevronDown, ChevronUp } from 'lucide-react'
import { TestQuestionManager } from './test-question-manager'

interface Course {
  id: string
  title: string
  slug: string
}

interface Test {
  id: string
  course_id: string
  title: string
  description: string | null
  passing_grade: number
  order: number
}

interface AdminTestsManagerProps {
  userId: string
  userRole: string
  courses: Course[]
}

export function AdminTestsManager({ userId, userRole, courses }: AdminTestsManagerProps) {
  const [tests, setTests] = useState<Record<string, Test[]>>({})
  const [loading, setLoading] = useState(true)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null)
  const [expandedTests, setExpandedTests] = useState<Set<string>>(new Set())
  const supabase = createClient()

  useEffect(() => {
    fetchTests()
  }, [courses])

  const fetchTests = async () => {
    try {
      const testsMap: Record<string, Test[]> = {}

      for (const course of courses) {
        const { data, error } = await supabase
          .from('course_tests')
          .select('*')
          .eq('course_id', course.id)
          .order('order', { ascending: true })

        if (!error && data) {
          testsMap[course.id] = data as Test[]
        }
      }

      setTests(testsMap)
    } catch (error) {
      console.error('Error fetching tests:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTest = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    if (!selectedCourseId) {
      alert('Please select a course')
      return
    }

    // Get max order for this course
    const existingTests = tests[selectedCourseId] || []
    const maxOrder = existingTests.length > 0 
      ? Math.max(...existingTests.map(t => t.order)) 
      : 0

    const testData = {
      course_id: selectedCourseId,
      title: formData.get('title') as string,
      description: formData.get('description') as string || null,
      passing_grade: parseInt(formData.get('passing_grade') as string) || 70,
      order: maxOrder + 1,
    }

    const { error } = await supabase.from('course_tests').insert(testData)

    if (error) {
      console.error('Error creating test:', error)
      alert('Failed to create test')
      return
    }

    setShowCreateDialog(false)
    setSelectedCourseId(null)
    fetchTests()
  }

  const handleDeleteTest = async (testId: string, courseId: string) => {
    if (!confirm('Are you sure you want to delete this test? All questions and attempts will be deleted.')) return

    const { error } = await supabase
      .from('course_tests')
      .delete()
      .eq('id', testId)

    if (error) {
      console.error('Error deleting test:', error)
      alert('Failed to delete test')
      return
    }

    fetchTests()
  }

  const toggleTestExpanded = (testId: string) => {
    const newExpanded = new Set(expandedTests)
    if (newExpanded.has(testId)) {
      newExpanded.delete(testId)
    } else {
      newExpanded.add(testId)
    }
    setExpandedTests(newExpanded)
  }

  if (loading) {
    return <p>Loading tests...</p>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Course Tests</h2>
          <p className="text-muted-foreground">Create and manage tests for your courses</p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Test
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Test</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateTest} className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Course</label>
                <select
                  name="course_id"
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                  required
                  value={selectedCourseId || ''}
                  onChange={(e) => setSelectedCourseId(e.target.value)}
                >
                  <option value="">Select a course</option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.title}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Test Title</label>
                <Input name="title" required placeholder="e.g., Final Exam" />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Description (optional)</label>
                <Textarea name="description" rows={3} placeholder="Test description..." />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Passing Grade (%)</label>
                <Input name="passing_grade" type="number" min="0" max="100" defaultValue={70} required />
              </div>
              <Button type="submit" className="w-full">Create Test</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {courses.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground">No courses available. Create a course first.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {courses.map((course) => {
            const courseTests = tests[course.id] || []
            return (
              <Card key={course.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{course.title}</span>
                    <span className="text-sm font-normal text-muted-foreground">
                      {courseTests.length} test{courseTests.length !== 1 ? 's' : ''}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {courseTests.length === 0 ? (
                    <p className="text-muted-foreground text-sm">No tests for this course yet.</p>
                  ) : (
                    <div className="space-y-4">
                      {courseTests.map((test) => (
                        <div key={test.id} className="border rounded-lg p-4 space-y-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <FileQuestion className="w-5 h-5 text-blue-500" />
                                <h3 className="font-semibold">{test.title}</h3>
                                <span className="text-xs bg-blue-500/20 text-blue-500 px-2 py-0.5 rounded">
                                  Pass: {test.passing_grade}%
                                </span>
                              </div>
                              {test.description && (
                                <p className="text-sm text-muted-foreground mb-2">{test.description}</p>
                              )}
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleTestExpanded(test.id)}
                              >
                                {expandedTests.has(test.id) ? (
                                  <ChevronUp className="h-4 w-4" />
                                ) : (
                                  <ChevronDown className="h-4 w-4" />
                                )}
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteTest(test.id, course.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          {expandedTests.has(test.id) && (
                            <TestQuestionManager testId={test.id} courseId={course.id} />
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}

