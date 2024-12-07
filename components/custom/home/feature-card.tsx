export function FeatureCard({ title, description, icon }) {
    return (
      <div className="bg-card text-card-foreground rounded-lg p-6 shadow-sm">
        <div className="text-4xl mb-4">{icon}</div>
        <h2 className="text-xl font-semibold mb-2">{title}</h2>
        <p className="text-muted-foreground">{description}</p>
      </div>
    )
  }