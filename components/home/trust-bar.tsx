export function TrustBar() {
  const stats = [
    { value: '10,000+', label: 'Students Worldwide' },
    { value: '15+', label: 'Years Experience' },
    { value: 'UFC', label: 'Veteran Fighter' },
    { value: '4.9★', label: 'Average Rating' },
  ]

  return (
    <section className="py-12 bg-card/50 border-y border-border">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-red-600 mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

