import { createClient } from '@/lib/supabase/server'
import AdminPromptActions from '@/app/admin/prompts/AdminPromptActions'

export default async function AdminPromptsPage() {
  const supabase = await createClient()

  const { data: prompts, error } = await supabase
    .from('prompts')
    .select('prompt_id, title, is_public, view_count, copy_count, created_at, categories(name)')
    .order('created_at', { ascending: false })
    .limit(100)

  return (
    <div>
      <h1 className="animate-spring-up section-title text-3xl font-extrabold text-ink mb-6">
        จัดการ Prompt ทั้งหมด
      </h1>

      {error && <p className="text-accent2">เกิดข้อผิดพลาด: {error.message}</p>}

      <div className="animate-spring-up [animation-delay:120ms] rounded-xl bg-surface border border-line overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-line text-left text-faint font-mono text-xs">
              <th className="px-4 py-3">ชื่อ</th>
              <th className="px-4 py-3">หมวดหมู่</th>
              <th className="px-4 py-3">สถานะ</th>
              <th className="px-4 py-3">👁 / 📋</th>
              <th className="px-4 py-3">วันที่สร้าง</th>
              <th className="px-4 py-3">จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {prompts?.map((p: any) => (
              <tr key={p.prompt_id} className="border-b border-line last:border-0">
                <td className="px-4 py-3 text-ink max-w-xs truncate">{p.title}</td>
                <td className="px-4 py-3 text-muted font-mono text-xs">
                  {p.categories?.name ?? '-'}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`text-xs font-mono px-2 py-0.5 rounded-full ${
                      p.is_public
                        ? 'bg-accent/10 text-accent'
                        : 'bg-line text-muted'
                    }`}
                  >
                    {p.is_public ? 'สาธารณะ' : 'ส่วนตัว'}
                  </span>
                </td>
                <td className="px-4 py-3 text-muted font-mono text-xs">
                  {p.view_count} / {p.copy_count}
                </td>
                <td className="px-4 py-3 text-faint font-mono text-xs">
                  {new Date(p.created_at).toLocaleDateString('th-TH')}
                </td>
                <td className="px-4 py-3">
                  <AdminPromptActions promptId={p.prompt_id} title={p.title} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {prompts?.length === 0 && (
          <p className="text-center py-10 text-faint font-mono text-sm">ยังไม่มี Prompt</p>
        )}
      </div>
    </div>
  )
}
