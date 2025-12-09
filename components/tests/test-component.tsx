'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { cn } from '@/lib/utils'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Test {
  id: string
  title: string
  passing_grade: number
}

interface Question {
  id: string
  question: string
  question_type: 'multiple_choice' | 'true_false' | 'short_answer'
  points: number
  options?: Array<{
    id: string
    option_text: string
    is_correct: boolean
  }>
  answers?: Array<{
    id: string
    answer_text: string
  }>
}

interface TestComponentProps {
  test: Test
  questions: Question[]
  userId: string
  previousAttempt: any | null
}

export function TestComponent({ test, questions, userId, previousAttempt }: TestComponentProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)
  const [results, setResults] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  const handleSubmit = async () => {
    if (Object.keys(answers).length !== questions.length) {
      alert('Please answer all questions before submitting.')
      return
    }

    setLoading(true)

    // Calculate score
    let totalPoints = 0
    let earnedPoints = 0
    const answerDetails: Record<string, { correct: boolean; points: number }> = {}

    questions.forEach((question) => {
      totalPoints += question.points
      const userAnswer = answers[question.id]

      if (question.question_type === 'multiple_choice' || question.question_type === 'true_false') {
        const correctOption = question.options?.find(opt => opt.is_correct)
        const isCorrect = userAnswer === correctOption?.id
        if (isCorrect) {
          earnedPoints += question.points
        }
        answerDetails[question.id] = { correct: isCorrect, points: isCorrect ? question.points : 0 }
      } else if (question.question_type === 'short_answer') {
        const correctAnswers = question.answers?.map(a => a.answer_text) || []
        const userAnswerTrimmed = userAnswer?.trim() || ''
        const isCorrect = correctAnswers.some(correctAnswer => {
          // Check if case sensitive (default to false for short answers)
          const answer = question.answers?.[0]
          if (answer && answer.answer_text) {
            // Simple comparison - can be enhanced with fuzzy matching
            return correctAnswer.toLowerCase().trim() === userAnswerTrimmed.toLowerCase()
          }
          return false
        })
        if (isCorrect) {
          earnedPoints += question.points
        }
        answerDetails[question.id] = { correct: isCorrect, points: isCorrect ? question.points : 0 }
      }
    })

    const percentage = Math.round((earnedPoints / totalPoints) * 100)
    const passed = percentage >= test.passing_grade

    // Save attempt
    const { error } = await supabase.from('user_test_attempts').insert({
      user_id: userId,
      test_id: test.id,
      score: earnedPoints,
      total_points: totalPoints,
      percentage: percentage,
      passed: passed,
      answers: answerDetails,
      completed_at: new Date().toISOString(),
    })

    if (error) {
      console.error('Error saving test attempt:', error)
      alert('Error submitting test. Please try again.')
      setLoading(false)
      return
    }

    setResults({ earnedPoints, totalPoints, percentage, passed, answerDetails })
    setSubmitted(true)
    setLoading(false)
  }

  if (submitted && results) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {results.passed ? (
              <>
                <CheckCircle className="w-6 h-6 text-green-500" />
                Test Passed!
              </>
            ) : (
              <>
                <XCircle className="w-6 h-6 text-red-500" />
                Test Failed
              </>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center py-4">
            <div className="text-4xl font-bold mb-2">
              {results.percentage}%
            </div>
            <p className="text-muted-foreground">
              Score: {results.earnedPoints} / {results.totalPoints} points
            </p>
            <p className={results.passed ? 'text-green-500 font-semibold mt-2' : 'text-red-500 font-semibold mt-2'}>
              {results.passed ? 'You passed!' : `You need ${test.passing_grade}% to pass.`}
            </p>
          </div>

          <div className="space-y-4">
            {questions.map((question, index) => {
              const result = results.answerDetails[question.id]
              const userAnswer = answers[question.id]

              return (
                <Card key={question.id} className={result.correct ? 'border-green-500' : 'border-red-500'}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-2 mb-3">
                      {result.correct ? (
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <p className="font-semibold mb-2">
                          Question {index + 1}: {question.question}
                        </p>
                        {question.question_type === 'multiple_choice' || question.question_type === 'true_false' ? (
                          <div className="space-y-2">
                            {question.options?.map((option) => {
                              const isSelected = userAnswer === option.id
                              const isCorrect = option.is_correct
                              return (
                                <div
                                  key={option.id}
                                  className={cn(
                                    'p-2 rounded border',
                                    isCorrect && 'bg-green-500/10 border-green-500',
                                    isSelected && !isCorrect && 'bg-red-500/10 border-red-500',
                                    !isSelected && !isCorrect && 'border-border'
                                  )}
                                >
                                  {option.option_text}
                                  {isCorrect && <span className="ml-2 text-green-500">✓ Correct</span>}
                                  {isSelected && !isCorrect && <span className="ml-2 text-red-500">✗ Your answer</span>}
                                </div>
                              )
                            })}
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <p className="text-sm text-muted-foreground">
                              Your answer: {userAnswer}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Correct answer: {question.answers?.[0]?.answer_text}
                            </p>
                          </div>
                        )}
                        <p className="text-sm text-muted-foreground mt-2">
                          Points: {result.points} / {question.points}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={() => {
                setSubmitted(false)
                setResults(null)
                setAnswers({})
              }}
            >
              Retake Test
            </Button>
            <Button onClick={() => router.back()}>
              Back to Course
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Test Questions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {questions.map((question, index) => (
          <div key={question.id} className="space-y-3">
            <div className="flex items-start gap-2">
              <span className="font-semibold text-lg">{index + 1}.</span>
              <p className="font-semibold flex-1">{question.question}</p>
              <span className="text-sm text-muted-foreground">{question.points} pts</span>
            </div>

            {question.question_type === 'multiple_choice' && (
              <RadioGroup
                value={answers[question.id] || ''}
                onValueChange={(value) => setAnswers({ ...answers, [question.id]: value })}
              >
                {question.options?.map((option) => (
                  <div key={option.id} className="flex items-center space-x-2">
                    <RadioGroupItem value={option.id} id={option.id} />
                    <Label htmlFor={option.id} className="cursor-pointer">
                      {option.option_text}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            )}

            {question.question_type === 'true_false' && (
              <RadioGroup
                value={answers[question.id] || ''}
                onValueChange={(value) => setAnswers({ ...answers, [question.id]: value })}
              >
                {question.options?.map((option) => (
                  <div key={option.id} className="flex items-center space-x-2">
                    <RadioGroupItem value={option.id} id={option.id} />
                    <Label htmlFor={option.id} className="cursor-pointer">
                      {option.option_text}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            )}

            {question.question_type === 'short_answer' && (
              <Input
                value={answers[question.id] || ''}
                onChange={(e) => setAnswers({ ...answers, [question.id]: e.target.value })}
                placeholder="Type your answer..."
              />
            )}
          </div>
        ))}

        <div className="pt-4 border-t">
          <Button
            onClick={handleSubmit}
            disabled={loading || Object.keys(answers).length !== questions.length}
            className="w-full"
            size="lg"
          >
            {loading ? 'Submitting...' : 'Submit Test'}
          </Button>
          {Object.keys(answers).length !== questions.length && (
            <p className="text-sm text-muted-foreground text-center mt-2">
              Please answer all {questions.length} questions
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function cn(...classes: (string | boolean | undefined)[]): string {
  return classes.filter(Boolean).join(' ')
}

