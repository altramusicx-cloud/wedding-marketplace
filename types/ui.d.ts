// components/ui/types.d.ts
import * as React from "react"

declare module "@/components/ui/button" {
  export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
    size?: "default" | "sm" | "lg" | "icon"
    asChild?: boolean
    isLoading?: boolean
  }
  
  export const Button: React.ForwardRefExoticComponent<
    ButtonProps & React.RefAttributes<HTMLButtonElement>
  >
}

declare module "@/components/ui/card" {
  export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}
  export const Card: React.ForwardRefExoticComponent<
    CardProps & React.RefAttributes<HTMLDivElement>
  >
  // Tambahkan sub-components jika perlu
}

declare module "@/components/ui/input" {
  export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}
  export const Input: React.ForwardRefExoticComponent<
    InputProps & React.RefAttributes<HTMLInputElement>
  >
}

declare module "@/components/ui/textarea" {
  export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}
  export const Textarea: React.ForwardRefExoticComponent<
    TextareaProps & React.RefAttributes<HTMLTextAreaElement>
  >
}

declare module "@/components/ui/select" {
  export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {}
  export const Select: React.ForwardRefExoticComponent<
    SelectProps & React.RefAttributes<HTMLSelectElement>
  >
}
