import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'

export function CourseInstructor() {
  return (
    <section>
      <h2 className="text-3xl font-bold mb-6">Your Instructor</h2>
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <Avatar className="w-24 h-24">
              <AvatarImage src="/images/lee-hammond.jpg" alt="Lee Hammond" />
              <AvatarFallback className="text-2xl">LH</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="text-2xl font-bold mb-2">Lee Hammond</h3>
              <p className="text-muted-foreground mb-4">UFC Veteran • Professional MMA Fighter</p>
              <p className="text-muted-foreground leading-relaxed">
                Lee Hammond is a professional MMA fighter and UFC veteran with over 15 years of experience in the sport. 
                Currently training and coaching at the UFC Performance Institute in Shanghai, Lee brings world-class 
                techniques and real-world fight experience to every lesson. His teaching style is direct, practical, 
                and designed to help fighters at every level improve their game.
              </p>
              <div className="mt-4 flex flex-wrap gap-4 text-sm">
                <div>
                  <span className="font-semibold">15+</span> years experience
                </div>
                <div>
                  <span className="font-semibold">UFC</span> veteran
                </div>
                <div>
                  <span className="font-semibold">10,000+</span> students
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}

