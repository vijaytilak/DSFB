"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { ChevronLeft } from "lucide-react"

import { cn } from "@/lib/utils"
import { useIsMobile } from "@/hooks/use-mobile"

const sidebarVariants = cva(
  "relative flex h-full flex-col gap-4 bg-sidebar p-4 text-sidebar-foreground data-[collapsible=true]:transition-[width] data-[collapsible=true]:duration-300 data-[state=closed]:w-[--sidebar-closed-width] data-[state=open]:w-[--sidebar-width]",
  {
    variants: {
      variant: {
        default: "border-r border-sidebar-border",
        inset: "",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

interface SidebarContextValue {
  isOpen: boolean
  isMobile: boolean
  isCollapsible: boolean
  onOpenChange: (value: boolean) => void
}

const SidebarContext = React.createContext<SidebarContextValue>({
  isOpen: true,
  isMobile: false,
  isCollapsible: false,
  onOpenChange: () => {},
})

export function useSidebar() {
  return React.useContext(SidebarContext)
}

interface SidebarProviderProps {
  children: React.ReactNode
  defaultOpen?: boolean
  onOpenChange?: (value: boolean) => void
}

export function SidebarProvider({
  children,
  defaultOpen = true,
  onOpenChange,
}: SidebarProviderProps) {
  const isMobile = useIsMobile()
  const [isOpen, setIsOpen] = React.useState(defaultOpen)

  React.useEffect(() => {
    if (isMobile) {
      setIsOpen(false)
    } else {
      setIsOpen(true)
    }
  }, [isMobile])

  const handleOpenChange = React.useCallback(
    (value: boolean) => {
      setIsOpen(value)
      onOpenChange?.(value)
    },
    [onOpenChange]
  )

  return (
    <SidebarContext.Provider
      value={{
        isOpen,
        isMobile,
        isCollapsible: !isMobile,
        onOpenChange: handleOpenChange,
      }}
    >
      {children}
    </SidebarContext.Provider>
  )
}

interface SidebarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof sidebarVariants> {}

export function Sidebar({ className, variant, ...props }: SidebarProps) {
  const { isOpen, isCollapsible } = useSidebar()

  return (
    <div
      data-state={isOpen ? "open" : "closed"}
      data-collapsible={isCollapsible}
      className={cn(sidebarVariants({ variant }), className)}
      style={
        {
          "--sidebar-width": "240px",
          "--sidebar-closed-width": "64px",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export function SidebarTrigger({
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { isOpen, onOpenChange } = useSidebar()

  return (
    <button
      type="button"
      onClick={() => onOpenChange(!isOpen)}
      className={cn(
        "inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        className
      )}
      {...props}
    >
      <ChevronLeft
        className={cn("size-4", isOpen ? "rotate-0" : "rotate-180")}
        aria-hidden="true"
      />
      <span className="sr-only">Toggle sidebar</span>
    </button>
  )
}

export function SidebarHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-sidebar="header"
      className={cn("flex shrink-0 items-center gap-4", className)}
      {...props}
    />
  )
}

export function SidebarContent({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-sidebar="content"
      className={cn("flex flex-1 flex-col gap-4 overflow-hidden", className)}
      {...props}
    />
  )
}

export function SidebarFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-sidebar="footer"
      className={cn("flex shrink-0 items-center gap-4", className)}
      {...props}
    />
  )
}

export function SidebarGroup({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-sidebar="group"
      className={cn("flex flex-col gap-4", className)}
      {...props}
    />
  )
}

export function SidebarGroupContent({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-sidebar="group-content"
      className={cn("flex flex-col gap-1", className)}
      {...props}
    />
  )
}

const SidebarGroupLabel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-sidebar="group-label"
    className={cn(
      "duration-200 flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium text-sidebar-foreground/70 outline-none ring-sidebar-ring transition-[margin,opacity] ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
      className
    )}
    {...props}
  />
))
SidebarGroupLabel.displayName = "SidebarGroupLabel"

export { SidebarGroupLabel }

export function SidebarMenu({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-sidebar="menu"
      className={cn("flex flex-col gap-1", className)}
      {...props}
    />
  )
}

export function SidebarMenuItem({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-sidebar="menu-item"
      className={cn("relative", className)}
      {...props}
    />
  )
}

interface SidebarMenuButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: "default" | "sm" | "lg"
  tooltip?: string
  asChild?: boolean
}

const SidebarMenuButton = React.forwardRef<
  HTMLButtonElement,
  SidebarMenuButtonProps
>(({ className, size = "default", tooltip, asChild = false, ...props }, ref) => {
  const Comp = asChild ? React.Fragment : "button"
  const { isOpen } = useSidebar()

  return (
    <Comp
      ref={ref}
      data-sidebar="menu-button"
      data-size={size}
      className={cn(
        "group relative flex w-full items-center gap-2 rounded-md px-2 outline-none ring-sidebar-ring transition-colors focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
        size === "sm" && "h-8",
        size === "default" && "h-9",
        size === "lg" && "h-10",
        className
      )}
      {...(!asChild && {
        type: "button",
        "data-state": isOpen ? "open" : "closed",
      })}
      {...props}
    />
  )
})
SidebarMenuButton.displayName = "SidebarMenuButton"

export { SidebarMenuButton }

export function SidebarMenuAction({
  className,
  showOnHover,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  showOnHover?: boolean
}) {
  return (
    <button
      type="button"
      data-sidebar="menu-action"
      className={cn(
        "absolute right-2 z-10 flex h-6 w-6 items-center justify-center rounded-md opacity-100 ring-sidebar-ring transition-opacity hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 [&>svg]:size-4",
        showOnHover &&
          "opacity-0 group-hover:opacity-100 group-focus:opacity-100",
        className
      )}
      {...props}
    />
  )
}

export function SidebarMenuSub({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-sidebar="menu-sub"
      className={cn(
        "flex flex-col gap-1 pl-6 before:absolute before:left-2.5 before:top-2 before:h-[calc(100%-0.5rem)] before:w-px before:bg-sidebar-border",
        className
      )}
      {...props}
    />
  )
}

export function SidebarMenuSubItem({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-sidebar="menu-sub-item"
      className={cn("relative", className)}
      {...props}
    />
  )
}

interface SidebarMenuSubButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
}

const SidebarMenuSubButton = React.forwardRef<
  HTMLButtonElement,
  SidebarMenuSubButtonProps
>(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? React.Fragment : "button"
  const { isOpen } = useSidebar()

  return (
    <Comp
      ref={ref}
      data-sidebar="menu-sub-button"
      className={cn(
        "group relative flex h-8 w-full items-center gap-2 rounded-md px-2 text-sm outline-none ring-sidebar-ring transition-colors before:absolute before:left-0 before:size-1 before:rounded-full before:bg-sidebar-border before:opacity-0 before:ring-1 before:ring-sidebar-border before:transition-opacity hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 group-[[data-state=active]]:font-medium group-[[data-state=active]]:before:opacity-100 [&>svg]:size-4 [&>svg]:shrink-0",
        className
      )}
      {...(!asChild && {
        type: "button",
        "data-state": isOpen ? "open" : "closed",
      })}
      {...props}
    />
  )
})
SidebarMenuSubButton.displayName = "SidebarMenuSubButton"

export { SidebarMenuSubButton }

export function SidebarInset({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const { isOpen } = useSidebar()

  return (
    <div
      data-state={isOpen ? "open" : "closed"}
      className={cn(
        "flex flex-1 flex-col overflow-hidden pl-[--sidebar-width] data-[state=closed]:pl-[--sidebar-closed-width]",
        className
      )}
      {...props}
    />
  )
}