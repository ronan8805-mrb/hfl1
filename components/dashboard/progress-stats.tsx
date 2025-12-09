import { Card, CardContent } from '@/components/ui/card'
import { Clock, CheckCircle, Award } from 'lucide-react'

interface ProgressStatsProps {
  totalHours: number
  completedLessons: number
  totalLessons: number
}

export function ProgressStats({ totalHours, completedLessons, totalLessons }: ProgressStatsProps) {
  const stats = [
    {
      label: 'Hours Watched',
      value: totalHours,
      icon: Clock,
      color: 'text-blue-500',
    },
    {
      label: 'Lessons Completed',
      value: completedLessons,
      icon: CheckCircle,
      color: 'text-green-500',
    },
    {
      label: 'Certificates Earned',
      value: 0, // TODO: Implement certificate system
      icon: Award,
      color: 'text-yellow-500',
    },
  ]

  return (
    <div className="grid md:grid-cols-3 gap-6 mb-8">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        return (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                </div>
                <Icon className={`w-12 h-12 ${stat.color} opacity-20`} />
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

