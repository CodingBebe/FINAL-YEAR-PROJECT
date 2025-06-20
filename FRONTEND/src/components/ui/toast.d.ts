import * as React from "react"
import { type VariantProps } from "class-variance-authority"

import { toastVariants } from "@/components/ui/toast"
 
export type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>
export type ToastActionElement = React.ReactElement<typeof ToastAction> 