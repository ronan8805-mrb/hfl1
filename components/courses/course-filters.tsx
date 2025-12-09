'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { cn } from '@/lib/utils'

const categories = ['All', 'Striking', 'Grappling', 'Technique', 'Strategy', 'Movement']
const levels = ['all', 'beginner', 'intermediate', 'advanced']

export function CourseFilters() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Category</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'ghost'}
              className={cn(
                'w-full justify-start',
                selectedCategory === category && 'bg-primary text-primary-foreground'
              )}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Level</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {levels.map((level) => (
            <Button
              key={level}
              variant={selectedLevel === level ? 'default' : 'ghost'}
              className={cn(
                'w-full justify-start capitalize',
                selectedLevel === level && 'bg-primary text-primary-foreground'
              )}
              onClick={() => setSelectedLevel(selectedLevel === level ? null : level)}
            >
              {level === 'all' ? 'All Levels' : level}
            </Button>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

