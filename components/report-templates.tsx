"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import {
  BarChart3,
  FileText,
  Shield,
  HardDrive,
  TrendingUp,
  Users,
  Database,
  Activity,
  Clock,
  Star,
} from "lucide-react"

interface ReportTemplatesProps {
  onSelectTemplate: (template: any) => void
}

export function ReportTemplates({ onSelectTemplate }: ReportTemplatesProps) {
  const templates = [
    {
      id: "executive-summary",
      name: "Executive Summary",
      description: "High-level overview for management with key metrics and trends",
      type: "performance",
      icon: TrendingUp,
      color: "bg-blue-500",
      popular: true,
      features: ["Key Performance Indicators", "Trend Analysis", "Executive Charts", "Summary Tables"],
      estimatedTime: "2-3 minutes",
    },
    {
      id: "detailed-performance",
      name: "Detailed Performance Analysis",
      description: "Comprehensive performance report with query analysis and optimization recommendations",
      type: "performance",
      icon: BarChart3,
      color: "bg-green-500",
      popular: true,
      features: ["Slow Query Analysis", "Index Usage", "Performance Metrics", "Optimization Tips"],
      estimatedTime: "5-7 minutes",
    },
    {
      id: "security-audit",
      name: "Security Audit Report",
      description: "Complete security assessment with threat analysis and compliance status",
      type: "security",
      icon: Shield,
      color: "bg-red-500",
      popular: false,
      features: ["Access Patterns", "Failed Logins", "Permission Analysis", "Compliance Check"],
      estimatedTime: "3-4 minutes",
    },
    {
      id: "backup-status",
      name: "Backup & Recovery Status",
      description: "Backup health report with success rates and storage analysis",
      type: "backup",
      icon: HardDrive,
      color: "bg-purple-500",
      popular: false,
      features: ["Backup Success Rates", "Storage Usage", "Recovery Testing", "Schedule Analysis"],
      estimatedTime: "2-3 minutes",
    },
    {
      id: "user-activity",
      name: "User Activity Report",
      description: "User behavior analysis with connection patterns and usage statistics",
      type: "usage",
      icon: Users,
      color: "bg-orange-500",
      popular: false,
      features: ["User Sessions", "Query Patterns", "Resource Usage", "Access Times"],
      estimatedTime: "4-5 minutes",
    },
    {
      id: "database-health",
      name: "Database Health Check",
      description: "Comprehensive database health assessment with maintenance recommendations",
      type: "performance",
      icon: Database,
      color: "bg-teal-500",
      popular: true,
      features: ["Table Statistics", "Index Health", "Vacuum Analysis", "Maintenance Tasks"],
      estimatedTime: "6-8 minutes",
    },
    {
      id: "real-time-monitoring",
      name: "Real-time Monitoring",
      description: "Live system monitoring report with current performance metrics",
      type: "performance",
      icon: Activity,
      color: "bg-pink-500",
      popular: false,
      features: ["Live Metrics", "Current Connections", "Resource Usage", "Alert Status"],
      estimatedTime: "1-2 minutes",
    },
    {
      id: "custom-template",
      name: "Custom Template",
      description: "Create your own template with custom queries and formatting",
      type: "usage",
      icon: FileText,
      color: "bg-gray-500",
      popular: false,
      features: ["Custom Queries", "Flexible Layout", "Custom Charts", "Personalized Branding"],
      estimatedTime: "Variable",
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Report Templates</h3>
        <p className="text-muted-foreground">
          Choose from professionally designed templates or create your own custom report
        </p>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
      >
        {templates.map((template) => {
          const Icon = template.icon
          return (
            <motion.div key={template.id} variants={itemVariants}>
              <Card className="h-full hover:shadow-lg transition-all duration-200 cursor-pointer group">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`p-3 rounded-lg ${template.color} text-white group-hover:scale-110 transition-transform`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <CardTitle className="text-base">{template.name}</CardTitle>
                          {template.popular && (
                            <Badge variant="secondary" className="text-xs">
                              <Star className="h-3 w-3 mr-1" />
                              Popular
                            </Badge>
                          )}
                        </div>
                        <Badge variant="outline" className="text-xs mt-1 capitalize">
                          {template.type}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <CardDescription className="text-sm">{template.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Features:</h4>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      {template.features.map((feature, index) => (
                        <li key={index} className="flex items-center space-x-2">
                          <div className="w-1 h-1 bg-current rounded-full" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{template.estimatedTime}</span>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => onSelectTemplate(template)}
                      className="group-hover:bg-primary group-hover:text-primary-foreground"
                    >
                      Use Template
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </motion.div>
    </div>
  )
}
