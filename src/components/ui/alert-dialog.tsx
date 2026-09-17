"use client"

import * as React from "react"
import * as toastDialogPrimitive from "@radix-ui/react-toast-dialog"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

function toastDialog({
  ...props
}: React.ComponentProps<typeof toastDialogPrimitive.Root>) {
  return <toastDialogPrimitive.Root data-slot="toast-dialog" {...props} />
}

function toastDialogTrigger({
  ...props
}: React.ComponentProps<typeof toastDialogPrimitive.Trigger>) {
  return (
    <toastDialogPrimitive.Trigger data-slot="toast-dialog-trigger" {...props} />
  )
}

function toastDialogPortal({
  ...props
}: React.ComponentProps<typeof toastDialogPrimitive.Portal>) {
  return (
    <toastDialogPrimitive.Portal data-slot="toast-dialog-portal" {...props} />
  )
}

function toastDialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof toastDialogPrimitive.Overlay>) {
  return (
    <toastDialogPrimitive.Overlay
      data-slot="toast-dialog-overlay"
      className={cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
        className
      )}
      {...props}
    />
  )
}

function toastDialogContent({
  className,
  ...props
}: React.ComponentProps<typeof toastDialogPrimitive.Content>) {
  return (
    <toastDialogPortal>
      <toastDialogOverlay />
      <toastDialogPrimitive.Content
        data-slot="toast-dialog-content"
        className={cn(
          "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg",
          className
        )}
        {...props}
      />
    </toastDialogPortal>
  )
}

function toastDialogHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="toast-dialog-header"
      className={cn("flex flex-col gap-2 text-center sm:text-left", className)}
      {...props}
    />
  )
}

function toastDialogFooter({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="toast-dialog-footer"
      className={cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className
      )}
      {...props}
    />
  )
}

function toastDialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof toastDialogPrimitive.Title>) {
  return (
    <toastDialogPrimitive.Title
      data-slot="toast-dialog-title"
      className={cn("text-lg font-semibold", className)}
      {...props}
    />
  )
}

function toastDialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof toastDialogPrimitive.Description>) {
  return (
    <toastDialogPrimitive.Description
      data-slot="toast-dialog-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  )
}

function toastDialogAction({
  className,
  ...props
}: React.ComponentProps<typeof toastDialogPrimitive.Action>) {
  return (
    <toastDialogPrimitive.Action
      className={cn(buttonVariants(), className)}
      {...props}
    />
  )
}

function toastDialogCancel({
  className,
  ...props
}: React.ComponentProps<typeof toastDialogPrimitive.Cancel>) {
  return (
    <toastDialogPrimitive.Cancel
      className={cn(buttonVariants({ variant: "outline" }), className)}
      {...props}
    />
  )
}

export {
  toastDialog,
  toastDialogPortal,
  toastDialogOverlay,
  toastDialogTrigger,
  toastDialogContent,
  toastDialogHeader,
  toastDialogFooter,
  toastDialogTitle,
  toastDialogDescription,
  toastDialogAction,
  toastDialogCancel,
}
