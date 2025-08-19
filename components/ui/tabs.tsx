import * as React from "react"

interface TabsProps {
  defaultValue?: string
  value?: string
  onValueChange?: (value: string) => void
  className?: string
  children: React.ReactNode
}

interface TabsListProps {
  className?: string
  children: React.ReactNode
}

interface TabsTriggerProps {
  value: string
  className?: string
  children: React.ReactNode
}

interface TabsContentProps {
  value: string
  className?: string
  children: React.ReactNode
}

const TabsContext = React.createContext<{
  value: string
  onValueChange: (value: string) => void
}>({
  value: "",
  onValueChange: () => {},
})

export function Tabs({ 
  defaultValue = "", 
  value: controlledValue, 
  onValueChange, 
  className = "",
  children 
}: TabsProps) {
  const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue)
  const value = controlledValue ?? uncontrolledValue
  
  const handleValueChange = React.useCallback((newValue: string) => {
    if (onValueChange) {
      onValueChange(newValue)
    } else {
      setUncontrolledValue(newValue)
    }
  }, [onValueChange])

  return (
    <TabsContext.Provider value={{ value, onValueChange: handleValueChange }}>
      <div className={className}>
        {children}
      </div>
    </TabsContext.Provider>
  )
}

export function TabsList({ className = "", children }: TabsListProps) {
  return (
    <div className={`inline-flex h-10 items-center justify-center rounded-md bg-gray-100 p-1 ${className}`}>
      {children}
    </div>
  )
}

export function TabsTrigger({ value, className = "", children }: TabsTriggerProps) {
  const { value: selectedValue, onValueChange } = React.useContext(TabsContext)
  const isSelected = value === selectedValue

  return (
    <button
      onClick={() => onValueChange(value)}
      className={`
        inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium
        transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
        ${isSelected 
          ? 'bg-white text-gray-900 shadow-sm' 
          : 'text-gray-600 hover:text-gray-900'
        }
        ${className}
      `}
    >
      {children}
    </button>
  )
}

export function TabsContent({ value, className = "", children }: TabsContentProps) {
  const { value: selectedValue } = React.useContext(TabsContext)

  if (value !== selectedValue) {
    return null
  }

  return (
    <div className={`mt-2 ${className}`}>
      {children}
    </div>
  )
}