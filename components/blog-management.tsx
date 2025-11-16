"use client"

import { useState, useEffect } from "react"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { BlogPost } from "@/lib/types"
import { Pencil, Trash2, Plus, Eye } from "lucide-react"
import { toast } from "sonner"

export default function BlogManagement() {
  const t = useTranslations("admin")
  const tBlog = useTranslations("blog")
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [currentPost, setCurrentPost] = useState<Partial<BlogPost>>({})

  useEffect(() => {
    loadPosts()
  }, [])

  const loadPosts = () => {
    const storedPosts = localStorage.getItem("petfendy_blog_posts")
    if (storedPosts) {
      setPosts(JSON.parse(storedPosts))
    }
  }

  const savePosts = (updatedPosts: BlogPost[]) => {
    localStorage.setItem("petfendy_blog_posts", JSON.stringify(updatedPosts))
    setPosts(updatedPosts)
  }

  const handleAddNew = () => {
    setCurrentPost({
      title: "",
      content: "",
      excerpt: "",
      category: "",
      tags: [],
      status: "draft",
      featuredImage: "",
    })
    setIsEditing(true)
  }

  const handleEdit = (post: BlogPost) => {
    setCurrentPost(post)
    setIsEditing(true)
  }

  const handleSave = () => {
    if (!currentPost.title || !currentPost.content) {
      toast.error("Başlık ve içerik gereklidir")
      return
    }

    const now = new Date()
    let updatedPosts: BlogPost[]

    if (currentPost.id) {
      // Update existing post
      updatedPosts = posts.map((p) =>
        p.id === currentPost.id
          ? {
              ...p,
              ...currentPost,
              updatedAt: now,
              publishedAt: currentPost.status === "published" ? (p.publishedAt || now) : p.publishedAt,
            } as BlogPost
          : p
      )
    } else {
      // Create new post
      const newPost: BlogPost = {
        id: `blog_${Date.now()}`,
        title: currentPost.title!,
        slug: currentPost.title!.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        content: currentPost.content!,
        excerpt: currentPost.excerpt || currentPost.content!.substring(0, 150),
        featuredImage: currentPost.featuredImage || "",
        author: "Admin",
        authorId: "admin",
        category: currentPost.category || "Genel",
        tags: currentPost.tags || [],
        status: currentPost.status as "draft" | "published" || "draft",
        publishedAt: currentPost.status === "published" ? now : null,
        createdAt: now,
        updatedAt: now,
        viewCount: 0,
      }
      updatedPosts = [...posts, newPost]
    }

    savePosts(updatedPosts)
    setIsEditing(false)
    setCurrentPost({})
    toast.success(currentPost.id ? "Yazı güncellendi" : "Yeni yazı eklendi")
  }

  const handleDelete = (id: string) => {
    if (confirm(t("confirmDelete"))) {
      const updatedPosts = posts.filter((p) => p.id !== id)
      savePosts(updatedPosts)
      toast.success("Yazı silindi")
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    setCurrentPost({})
  }

  if (isEditing) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{currentPost.id ? t("editPost") : t("addPost")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title">{t("title")}</Label>
            <Input
              id="title"
              value={currentPost.title || ""}
              onChange={(e) => setCurrentPost({ ...currentPost, title: e.target.value })}
              placeholder="Yazı başlığı"
            />
          </div>

          <div>
            <Label htmlFor="excerpt">{t("excerpt")}</Label>
            <Textarea
              id="excerpt"
              value={currentPost.excerpt || ""}
              onChange={(e) => setCurrentPost({ ...currentPost, excerpt: e.target.value })}
              placeholder="Kısa özet"
              rows={2}
            />
          </div>

          <div>
            <Label htmlFor="content">{t("content")}</Label>
            <Textarea
              id="content"
              value={currentPost.content || ""}
              onChange={(e) => setCurrentPost({ ...currentPost, content: e.target.value })}
              placeholder="Yazı içeriği (HTML desteklenir)"
              rows={10}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">{t("category")}</Label>
              <Input
                id="category"
                value={currentPost.category || ""}
                onChange={(e) => setCurrentPost({ ...currentPost, category: e.target.value })}
                placeholder="Kategori"
              />
            </div>

            <div>
              <Label htmlFor="status">{t("status")}</Label>
              <Select
                value={currentPost.status || "draft"}
                onValueChange={(value) => setCurrentPost({ ...currentPost, status: value as "draft" | "published" })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">{t("draft")}</SelectItem>
                  <SelectItem value="published">{t("published")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="featuredImage">{t("imageUrl")}</Label>
            <Input
              id="featuredImage"
              value={currentPost.featuredImage || ""}
              onChange={(e) => setCurrentPost({ ...currentPost, featuredImage: e.target.value })}
              placeholder="https://..."
            />
          </div>

          <div>
            <Label htmlFor="tags">Etiketler (virgülle ayırın)</Label>
            <Input
              id="tags"
              value={currentPost.tags?.join(", ") || ""}
              onChange={(e) =>
                setCurrentPost({ ...currentPost, tags: e.target.value.split(",").map((t) => t.trim()) })
              }
              placeholder="evcil hayvan, bakım, sağlık"
            />
          </div>

          <div className="flex gap-2">
            <Button onClick={handleSave}>Kaydet</Button>
            <Button variant="outline" onClick={handleCancel}>
              İptal
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{t("blog")}</h2>
        <Button onClick={handleAddNew}>
          <Plus className="h-4 w-4 mr-2" />
          {t("addPost")}
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("title")}</TableHead>
                <TableHead>{t("category")}</TableHead>
                <TableHead>{t("status")}</TableHead>
                <TableHead>Görüntülenme</TableHead>
                <TableHead>Tarih</TableHead>
                <TableHead>İşlemler</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-gray-500">
                    {tBlog("noPosts")}
                  </TableCell>
                </TableRow>
              ) : (
                posts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell className="font-medium">{post.title}</TableCell>
                    <TableCell>
                      <Badge>{post.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={post.status === "published" ? "default" : "secondary"}>
                        {post.status === "published" ? t("published") : t("draft")}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        {post.viewCount}
                      </div>
                    </TableCell>
                    <TableCell>{new Date(post.createdAt).toLocaleDateString("tr-TR")}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(post)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDelete(post.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
