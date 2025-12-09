'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Plus, Edit, Trash2, X } from 'lucide-react'
import { Label } from '@/components/ui/label'

interface Question {
  id: string
  test_id: string
  question: string
  question_type: 'multiple_choice' | 'true_false' | 'short_answer'
  order: number
  points: number
}

interface QuestionOption {
  id: string
  question_id: string
  option_text: string
  is_correct: boolean
  order: number
}

interface QuestionAnswer {
  id: string
  question_id: string
  answer_text: string
  is_case_sensitive: boolean
}

interface TestQuestionManagerProps {
  testId: string
  courseId: string
}

export function TestQuestionManager({ testId, courseId }: TestQuestionManagerProps) {
  const [questions, setQuestions] = useState<Question[]>([])
  const [options, setOptions] = useState<Record<string, QuestionOption[]>>({})
  const [answers, setAnswers] = useState<Record<string, QuestionAnswer[]>>({})
  const [loading, setLoading] = useState(true)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null)
  const [questionType, setQuestionType] = useState<'multiple_choice' | 'true_false' | 'short_answer'>('multiple_choice')
  const [formOptions, setFormOptions] = useState<string[]>(['', ''])
  const supabase = createClient()

  useEffect(() => {
    fetchQuestions()
  }, [testId])

  const fetchQuestions = async () => {
    try {
      // Fetch questions
      const { data: questionsData, error: questionsError } = await supabase
        .from('test_questions')
        .select('*')
        .eq('test_id', testId)
        .order('order', { ascending: true })

      if (questionsError) throw questionsError

      setQuestions(questionsData || [])

      // Fetch options and answers for each question
      const optionsMap: Record<string, QuestionOption[]> = {}
      const answersMap: Record<string, QuestionAnswer[]> = {}

      for (const question of questionsData || []) {
        if (question.question_type === 'multiple_choice' || question.question_type === 'true_false') {
          const { data: optionsData } = await supabase
            .from('test_question_options')
            .select('*')
            .eq('question_id', question.id)
            .order('order', { ascending: true })
          optionsMap[question.id] = optionsData || []
        } else if (question.question_type === 'short_answer') {
          const { data: answersData } = await supabase
            .from('test_question_answers')
            .select('*')
            .eq('question_id', question.id)
          answersMap[question.id] = answersData || []
        }
      }

      setOptions(optionsMap)
      setAnswers(answersMap)
    } catch (error) {
      console.error('Error fetching questions:', error)
    } finally {
      setLoading(false)
    }
  }

  const addOption = () => {
    setFormOptions([...formOptions, ''])
  }

  const removeOption = (index: number) => {
    setFormOptions(formOptions.filter((_, i) => i !== index))
  }

  const updateOption = (index: number, value: string) => {
    const newOptions = [...formOptions]
    newOptions[index] = value
    setFormOptions(newOptions)
  }

  const handleCreateQuestion = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    const maxOrder = questions.length > 0 ? Math.max(...questions.map(q => q.order)) : 0

    // Create question
    const { data: questionData, error: questionError } = await supabase
      .from('test_questions')
      .insert({
        test_id: testId,
        question: formData.get('question') as string,
        question_type: questionType,
        order: maxOrder + 1,
        points: parseInt(formData.get('points') as string) || 1,
      })
      .select()
      .single()

    if (questionError) {
      console.error('Error creating question:', questionError)
      alert('Failed to create question')
      return
    }

    const question = questionData as Question

    // Handle options for multiple choice/true-false
    if (questionType === 'multiple_choice' || questionType === 'true_false') {
      const correctOptionIndex = parseInt(formData.get('correct_option') as string)
      const filteredOptions = formOptions.filter(opt => opt.trim() !== '')

      if (filteredOptions.length === 0) {
        alert('Please add at least one option')
        await supabase.from('test_questions').delete().eq('id', question.id)
        return
      }

      const optionsToInsert = filteredOptions.map((text, index) => ({
        question_id: question.id,
        option_text: text,
        is_correct: index === correctOptionIndex,
        order: index,
      }))

      const { error: optionsError } = await supabase.from('test_question_options').insert(optionsToInsert)
      if (optionsError) {
        console.error('Error creating options:', optionsError)
        await supabase.from('test_questions').delete().eq('id', question.id)
        alert('Failed to create options')
        return
      }
    } else if (questionType === 'short_answer') {
      // Handle answers for short answer
      const answerText = formData.get('answer_text') as string
      if (answerText) {
        const { error: answerError } = await supabase.from('test_question_answers').insert({
          question_id: question.id,
          answer_text: answerText,
          is_case_sensitive: formData.get('is_case_sensitive') === 'on',
        })
        if (answerError) {
          console.error('Error creating answer:', answerError)
          await supabase.from('test_questions').delete().eq('id', question.id)
          alert('Failed to create answer')
          return
        }
      }
    }

    setShowCreateDialog(false)
    setQuestionType('multiple_choice')
    setFormOptions(['', ''])
    fetchQuestions()
  }

  const handleDeleteQuestion = async (questionId: string) => {
    if (!confirm('Are you sure you want to delete this question?')) return

    const { error } = await supabase
      .from('test_questions')
      .delete()
      .eq('id', questionId)

    if (error) {
      console.error('Error deleting question:', error)
      alert('Failed to delete question')
      return
    }

    fetchQuestions()
  }

  if (loading) {
    return <p className="text-sm text-muted-foreground">Loading questions...</p>
  }

  return (
    <div className="space-y-4 pt-4 border-t">
      <div className="flex justify-between items-center">
        <h4 className="font-semibold">Questions ({questions.length})</h4>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Question
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add Question</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateQuestion} className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Question</label>
                <Textarea name="question" rows={3} required placeholder="Enter your question..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Question Type</label>
                  <select
                    name="question_type"
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                    required
                    value={questionType}
                    onChange={(e) => {
                      setQuestionType(e.target.value as 'multiple_choice' | 'true_false' | 'short_answer')
                      if (e.target.value === 'true_false') {
                        setFormOptions(['True', 'False'])
                      } else if (e.target.value === 'multiple_choice') {
                        setFormOptions(['', ''])
                      }
                    }}
                  >
                    <option value="multiple_choice">Multiple Choice</option>
                    <option value="true_false">True/False</option>
                    <option value="short_answer">Short Answer</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Points</label>
                  <Input name="points" type="number" min="1" defaultValue={1} required />
                </div>
              </div>

              {/* Dynamic options based on question type */}
              {questionType === 'multiple_choice' && (
                <div className="space-y-4">
                  <label className="text-sm font-medium block">Options</label>
                  {formOptions.map((option, index) => (
                    <div key={index} className="flex gap-2 items-center">
                      <Input
                        value={option}
                        onChange={(e) => updateOption(index, e.target.value)}
                        placeholder={`Option ${index + 1}`}
                        required
                      />
                      <label className="flex items-center gap-2 text-sm">
                        <input
                          type="radio"
                          name="correct_option"
                          value={index}
                          required
                          className="w-4 h-4"
                        />
                        Correct
                      </label>
                      {formOptions.length > 2 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeOption(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button type="button" variant="outline" size="sm" onClick={addOption}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Option
                  </Button>
                </div>
              )}

              {questionType === 'true_false' && (
                <div className="space-y-4">
                  <label className="text-sm font-medium block">Select Correct Answer</label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer hover:bg-accent">
                      <input
                        type="radio"
                        name="correct_option"
                        value="0"
                        required
                        className="w-4 h-4"
                      />
                      <span>True</span>
                    </label>
                    <label className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer hover:bg-accent">
                      <input
                        type="radio"
                        name="correct_option"
                        value="1"
                        required
                        className="w-4 h-4"
                      />
                      <span>False</span>
                    </label>
                  </div>
                </div>
              )}

              {questionType === 'short_answer' && (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Correct Answer</label>
                    <Input name="answer_text" required placeholder="Enter the correct answer..." />
                  </div>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      name="is_case_sensitive"
                      className="w-4 h-4"
                    />
                    Case sensitive
                  </label>
                </div>
              )}

              <Button type="submit" className="w-full">Add Question</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {questions.length === 0 ? (
        <p className="text-sm text-muted-foreground">No questions yet. Add your first question!</p>
      ) : (
        <div className="space-y-4">
          {questions.map((question, index) => (
            <div key={question.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-semibold text-muted-foreground">
                      Q{index + 1}
                    </span>
                    <span className="text-xs bg-blue-500/20 text-blue-500 px-2 py-0.5 rounded">
                      {question.question_type.replace('_', ' ')}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {question.points} pt{question.points !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <p className="font-medium">{question.question}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteQuestion(question.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              {/* Display options or answers */}
              {question.question_type === 'multiple_choice' || question.question_type === 'true_false' ? (
                <div className="space-y-2 pl-6">
                  {options[question.id]?.map((option) => (
                    <div
                      key={option.id}
                      className={`text-sm p-2 rounded ${
                        option.is_correct
                          ? 'bg-green-500/10 border border-green-500'
                          : 'bg-muted'
                      }`}
                    >
                      {option.option_text}
                      {option.is_correct && (
                        <span className="ml-2 text-green-600 text-xs">✓ Correct</span>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-2 pl-6">
                  {answers[question.id]?.map((answer) => (
                    <div key={answer.id} className="text-sm p-2 rounded bg-muted">
                      <span className="font-medium">Answer:</span> {answer.answer_text}
                      {answer.is_case_sensitive && (
                        <span className="ml-2 text-xs text-muted-foreground">(case-sensitive)</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

