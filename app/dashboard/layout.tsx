import { headers } from "next/headers"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Ajouter des headers pour empêcher la mise en cache
  const headersList = headers()
  
  return (
    <div>
      {children}
    </div>
  )
}

// Empêcher la mise en cache de cette page
export const dynamic = 'force-dynamic'
export const revalidate = 0
