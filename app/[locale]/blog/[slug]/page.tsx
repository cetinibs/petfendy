"use client"

import { useTranslations } from "next-intl"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, User, Eye, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { BlogPost } from "@/lib/types"
import { useParams } from "next/navigation"

export default function BlogPostPage() {
  const t = useTranslations("blog")
  const params = useParams()
  const slug = params.slug as string
  const [post, setPost] = useState<BlogPost | null>(null)
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([])

  useEffect(() => {
    // Load blog post from localStorage
    const storedPosts = localStorage.getItem("petfendy_blog_posts")
    if (storedPosts) {
      const allPosts = JSON.parse(storedPosts) as BlogPost[]
      const foundPost = allPosts.find(p => p.slug === slug && p.status === "published")

      if (foundPost) {
        // Increment view count
        foundPost.viewCount += 1
        const updatedPosts = allPosts.map(p => p.id === foundPost.id ? foundPost : p)
        localStorage.setItem("petfendy_blog_posts", JSON.stringify(updatedPosts))
        setPost(foundPost)

        // Get related posts (same category, max 3)
        const related = allPosts
          .filter(p => p.category === foundPost.category && p.id !== foundPost.id && p.status === "published")
          .slice(0, 3)
        setRelatedPosts(related)
      }
    }
  }, [slug])

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-16">
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-gray-500">Yazı bulunamadı</p>
              <Button asChild className="mt-4">
                <Link href="/tr/blog">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  {t("backToBlog")}
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        {/* Back Button */}
        <Button asChild variant="outline" className="mb-6">
          <Link href="/tr/blog">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t("backToBlog")}
          </Link>
        </Button>

        {/* Blog Post */}
        <article className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              {/* Featured Image */}
              {post.featuredImage && (
                <div className="w-full h-96 bg-gray-200 rounded-lg mb-6 overflow-hidden">
                  <img
                    src={post.featuredImage}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Categories and Tags */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <Badge>{post.category}</Badge>
                {post.tags.map(tag => (
                  <Badge key={tag} variant="outline">{tag}</Badge>
                ))}
              </div>

              {/* Title */}
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {post.title}
              </h1>

              {/* Meta Information */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400 border-b pb-4">
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
            </CardHeader>

            <CardContent>
              {/* Content */}
              <div
                className="prose prose-lg dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </CardContent>
          </Card>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                {t("relatedPosts")}
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                {relatedPosts.map(relatedPost => (
                  <Card key={relatedPost.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <Badge className="w-fit mb-2">{relatedPost.category}</Badge>
                      <h3 className="text-lg font-semibold">
                        <Link href={`/tr/blog/${relatedPost.slug}`} className="hover:text-blue-600">
                          {relatedPost.title}
                        </Link>
                      </h3>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                        {relatedPost.excerpt}
                      </p>
                      <Button asChild variant="link" className="mt-2 px-0">
                        <Link href={`/tr/blog/${relatedPost.slug}`}>{t("readMore")}</Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </article>
      </div>
    </div>
  )
}
