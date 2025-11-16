"use client"

import { useTranslations } from "next-intl"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Calendar, User, Eye } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { BlogPost } from "@/lib/types"

export default function BlogPage() {
  const t = useTranslations("blog")
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  useEffect(() => {
    // Load blog posts from localStorage
    const storedPosts = localStorage.getItem("petfendy_blog_posts")
    if (storedPosts) {
      const allPosts = JSON.parse(storedPosts) as BlogPost[]
      // Only show published posts
      setPosts(allPosts.filter(post => post.status === "published"))
    }
  }, [])

  // Get unique categories
  const categories = Array.from(new Set(posts.map(post => post.category)))

  // Filter posts
  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || post.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
            {t("title")}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            {t("subtitle")}
          </p>
        </div>

        {/* Search and Filter */}
        <div className="max-w-4xl mx-auto mb-8 space-y-4">
          <Input
            placeholder={t("search")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-md"
          />
          <div className="flex flex-wrap gap-2">
            <Badge
              variant={selectedCategory === "all" ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setSelectedCategory("all")}
            >
              {t("allCategories")}
            </Badge>
            {categories.map(category => (
              <Badge
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>

        {/* Blog Posts */}
        <div className="max-w-4xl mx-auto space-y-6">
          {filteredPosts.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center text-gray-500">
                {t("noPosts")}
              </CardContent>
            </Card>
          ) : (
            filteredPosts.map((post) => (
              <Card key={post.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge>{post.category}</Badge>
                    {post.tags.map(tag => (
                      <Badge key={tag} variant="outline">{tag}</Badge>
                    ))}
                  </div>
                  <CardTitle className="text-2xl">
                    <Link href={`/tr/blog/${post.slug}`} className="hover:text-blue-600">
                      {post.title}
                    </Link>
                  </CardTitle>
                  <CardDescription className="text-base mt-2">
                    {post.excerpt}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      <span>{post.author}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(post.publishedAt!).toLocaleDateString('tr-TR')}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      <span>{post.viewCount} {t("views")}</span>
                    </div>
                  </div>
                  <Button asChild className="mt-4">
                    <Link href={`/tr/blog/${post.slug}`}>{t("readMore")}</Link>
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
