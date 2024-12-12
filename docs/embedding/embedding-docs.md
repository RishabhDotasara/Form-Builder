
# Form Builder Embedding Guide

This guide will help you embed forms created with the Form Builder into your project.

## Installation

First, install the Form SDK from npm:

```bash
npm install @rishabhdotasara/form-sdk@latest
```

## Configuration

### 1. Tailwind CSS

Ensure that Tailwind CSS is configured in your project. If you haven't set it up yet, follow the official Tailwind CSS installation guide:

[Tailwind CSS Installation](https://tailwindcss.com/docs/installation)

### 2. shadcn/ui

Make sure you have shadcn/ui configured in your project. If you haven't set it up, follow the shadcn/ui installation guide:

[shadcn/ui Installation](https://ui.shadcn.com/docs/installation)

### 3. Install shadcn/ui Components

To install all the necessary shadcn/ui components, run the following command:

```bash
npx shadcn@latest add button input checkbox radio select textarea switch slider card
```

## Usage

After installation and configuration, you can use the Form SDK to embed your forms. Here's a basic example:

```jsx
import { FormRenderer } from '@rishabhdotasara/form-sdk'

export default function MyForm() {
  return (
    <div className="container mx-auto p-4">
      <FormRenderer formId="your-form-id-here" />
    </div>
  )
}
```

Replace `"your-form-id-here"` with the actual ID of the form you want to embed.

## Styling

The Form SDK is compatible with the shadcn/ui CSS variables theme. You can customize the appearance of your forms by adjusting your Tailwind configuration and CSS variables.

For more advanced customization options, refer to the full documentation of the Form SDK.
