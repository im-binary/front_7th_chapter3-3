import { BrowserRouter as Router } from "react-router-dom"
import { ReactNode } from "react"

interface RouterProviderProps {
  children: ReactNode
}

export const RouterProvider = ({ children }: RouterProviderProps) => {
  return <Router>{children}</Router>
}
