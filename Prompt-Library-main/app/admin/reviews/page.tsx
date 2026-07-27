import { createClient } from '@/lib/supabase/server'
import AdminReviewActions from '@/app/admin/reviews/AdminReviewActions'

export default async function AdminReviewsPage() {
  const supabase = await createClient()

  const { data: reviews, error } = await supabase
    .from('reviews')
    .select('review_id, rating, comment, guest_name, created_at, prompts(title), profiles(username)')
    .order('created_at', { ascending: false })
    .limit(100)

  return (
    <div>
      <h1 className="animate-spring-up section-title text-3xl font-extrabold text-ink mb-6">
        จัดการรีวิว
      </h1>

      {error && <p className="text-accent2">เกิดข้อผิดพลาด: {error.message}</p>}

      <div className="flex flex-col gap-2.5">
        {reviews?.map((r: any, i: number) => (
          <div
            key={r.review_id}
            style={{ animationDelay: `${120 + Math.min(i, 12) * 55}ms` }}
            className="animate-spring-up rounded-lg bg-surface border border-line p-4 flex items-start justify-between gap-4"
          >
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-yellow-300 text-sm">{'★'.repeat(r.rating)}</span>
                <span className="text-faint text-xs font-mono">
                  {r.profiles?.username ? '@' + r.profiles.username : r.guest_name ?? 'ผู้เยี่ยมชม'}
                </span>
                <span className="text-faint text-xs font-mono">
                  · {new Date(r.created_at).toLocaleDateString('th-TH')}
                </span>
              </div>
              <p className="text-xs text-accent/80 font-mono mb-1 truncate">
                prompt: {r.prompts?.title ?? '(ถูกลบแล้ว)'}
              </p>
              {r.comment && <p className="text-sm text-ink-soft">{r.comment}</p>}
            </div>
            <AdminReviewActions reviewId={r.review_id} />
          </div>
        ))}

        {reviews?.length === 0 && (
          <p className="text-center py-10 text-faint font-mono text-sm">ยังไม่มีรีวิว</p>
        )}
      </div>
    </div>
  )
}
