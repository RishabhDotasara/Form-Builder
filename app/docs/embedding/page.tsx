import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function EmbeddingGuide() {
  return (
    <div className="container mx-auto p-4 space-y-8">
      <h1 className="text-4xl font-bold">Form Builder Embedding Guide</h1>
      <p className="text-lg">
        This guide will help you embed forms created with the Form Builder into your project.
      </p>

      <Card className="p-6 space-y-4">
        <h2 className="text-2xl font-semibold">Installation</h2>
        <p>First, install the Form SDK from npm:</p>
        <pre className="bg-muted p-2 rounded-md">
          <code>npm install @rishabhdotasara/form-sdk@latest</code>
        </pre>
      </Card>

      <Card className="p-6 space-y-4">
        <h2 className="text-2xl font-semibold">Configuration</h2>
        
        <div>
          <h3 className="text-xl font-medium">1. Tailwind CSS</h3>
          <p>Ensure that Tailwind CSS is configured in your project. If you haven&apos;t set it up yet, follow the official Tailwind CSS installation guide:</p>
          <Button variant="link" className="p-0">
            <a href="https://tailwindcss.com/docs/installation" target="_blank" rel="noopener noreferrer">
              Tailwind CSS Installation
            </a>
          </Button>
        </div>

        <div>
          <h3 className="text-xl font-medium">2. shadcn/ui</h3>
          <p>Make sure you have shadcn/ui configured in your project. If you haven&apos;t set it up, follow the shadcn/ui installation guide:</p>
          <Button variant="link" className="p-0">
            <a href="https://ui.shadcn.com/docs/installation" target="_blank" rel="noopener noreferrer">
              shadcn/ui Installation
            </a>
          </Button>
        </div>

        <div>
          <h3 className="text-xl font-medium">3. Install shadcn/ui Components</h3>
          <p>To install all the necessary shadcn/ui components, run the following command:</p>
          <pre className="bg-muted p-2 rounded-md">
            <code>npx shadcn@latest add card form input label radio-group textarea</code>
          </pre>
        </div>
      </Card>

      <Card className="p-6 space-y-4">
        <h2 className="text-2xl font-semibold">Usage</h2>
        <p>After installation and configuration, you can use the Form SDK to embed your forms. Here&apos;s a basic example:</p>
        <pre className="bg-muted p-2 rounded-md">
          <code>{`import { EmbedForm } from '@rishabhdotasara/form-sdk'

export default function MyForm() {
  return (
    <div className="container mx-auto p-4">
      <EmbedForm formId="your-form-id-here" />
    </div>
  )
}`}</code>
        </pre>
        <p>Replace &quot;your-form-id-here&quot; with the actual ID of the form you want to embed.</p>
      </Card>

      <Card className="p-6 space-y-4">
        <h2 className="text-2xl font-semibold">Styling</h2>
        <p>
          The Form SDK is compatible with the shadcn/ui CSS variables theme. You can customize the appearance of your forms by adjusting your Tailwind configuration and CSS variables.
        </p>
      </Card>
    </div>
  )
}

