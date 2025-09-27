"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Bell, Check, CheckCheck } from "lucide-react"
import type { Notification } from "@/lib/types"

interface NotificationWithPlant extends Notification {
  plants: {
    name: string
    species: string
  }
}

export function NotificationsList() {
  const [notifications, setNotifications] = useState<NotificationWithPlant[]>([])
  const [loading, setLoading] = useState(true)

  const fetchNotifications = async () => {
    try {
      const response = await fetch("/api/notifications")
      if (response.ok) {
        const data = await response.json()
        setNotifications(data.notifications || [])
      }
    } catch (error) {
      console.error("Error fetching notifications:", error)
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}/read`, {
        method: "PATCH",
      })
      if (response.ok) {
        setNotifications((prev) => prev.map((n) => (n.id === notificationId ? { ...n, is_read: true } : n)))
      }
    } catch (error) {
      console.error("Error marking notification as read:", error)
    }
  }

  const markAllAsRead = async () => {
    const unreadNotifications = notifications.filter((n) => !n.is_read)

    try {
      await Promise.all(unreadNotifications.map((n) => fetch(`/api/notifications/${n.id}/read`, { method: "PATCH" })))

      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })))
    } catch (error) {
      console.error("Error marking all notifications as read:", error)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "À l'instant"
    if (diffInHours < 24) return `Il y a ${diffInHours}h`
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays === 1) return "Hier"
    if (diffInDays < 7) return `Il y a ${diffInDays} jours`

    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    })
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "watering_due":
        return "💧"
      case "plant_added":
        return "🌱"
      case "watering_completed":
        return "✅"
      default:
        return "📢"
    }
  }

  useEffect(() => {
    fetchNotifications()
  }, [])

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-muted rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const unreadCount = notifications.filter((n) => !n.is_read).length

  return (
    <div className="space-y-6">
      {/* Header with actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Bell className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {notifications.length} notification{notifications.length > 1 ? "s" : ""}
            </span>
          </div>
          {unreadCount > 0 && (
            <Badge variant="secondary">
              {unreadCount} non lue{unreadCount > 1 ? "s" : ""}
            </Badge>
          )}
        </div>

        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={markAllAsRead}
            className="flex items-center space-x-2 bg-transparent"
          >
            <CheckCheck className="h-4 w-4" />
            <span>Tout marquer comme lu</span>
          </Button>
        )}
      </div>

      {/* Notifications list */}
      <div className="space-y-4">
        {notifications.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Aucune notification</h3>
              <p className="text-muted-foreground">
                Vous recevrez des notifications ici quand vos plantes auront besoin d'attention
              </p>
            </CardContent>
          </Card>
        ) : (
          notifications.map((notification) => (
            <Card
              key={notification.id}
              className={`transition-all duration-200 ${
                !notification.is_read ? "border-primary/50 bg-primary/5" : "hover:bg-muted/50"
              }`}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="text-2xl">{getNotificationIcon(notification.type)}</div>

                    <div className="flex-1 space-y-2">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-semibold">{notification.title}</h4>
                        {!notification.is_read && <div className="w-2 h-2 bg-primary rounded-full"></div>}
                      </div>

                      <p className="text-muted-foreground">{notification.message}</p>

                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span>{formatDate(notification.created_at)}</span>
                        {notification.plants && <span>• {notification.plants.name}</span>}
                      </div>
                    </div>
                  </div>

                  {!notification.is_read && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => markAsRead(notification.id)}
                      className="flex items-center space-x-1 text-muted-foreground hover:text-foreground"
                    >
                      <Check className="h-4 w-4" />
                      <span className="sr-only">Marquer comme lu</span>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
